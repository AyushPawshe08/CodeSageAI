import asyncio
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from fastapi import HTTPException, status
from services.llm_service import call_llm
try:
    import tiktoken
except ImportError:
    tiktoken = None
MAX_TOKENS = 8000
CHUNK_TOKENS = 3000
MAX_FILE_SIZE = 2 * 1024 * 1024
ALLOWED_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".java",
    ".cpp",
    ".c",
    ".cs",
    ".go",
    ".rs",
    ".txt",
}
IGNORED_FOLDERS = {"node_modules", "dist", "build", "__pycache__"}
@dataclass
class UploadedSource:
    filename: str
    content: str
    file_size: int
def normalize_filename(filename: str) -> str:
    return Path(filename).name
def should_ignore_file(filename: str) -> bool:
    parts = {part.lower() for part in Path(filename).parts}
    return any(folder in parts for folder in IGNORED_FOLDERS)
def validate_file_upload(filename: str, raw_bytes: bytes) -> None:
    normalized = normalize_filename(filename)
    if should_ignore_file(filename):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"File {normalized} is inside an ignored folder.")
    if len(raw_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large. Maximum allowed size is 2MB.",
        )
    if b"\x00" in raw_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File {normalized} looks binary and was rejected.",
        )
    extension = Path(normalized).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {extension or 'unknown'}",
        )
    try:
        raw_bytes.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File {normalized} could not be decoded as text.",
        ) from exc
def extract_text_from_bytes(filename: str, raw_bytes: bytes) -> UploadedSource:
    validate_file_upload(filename, raw_bytes)
    text = raw_bytes.decode("utf-8", errors="strict")
    return UploadedSource(
        filename=normalize_filename(filename),
        content=text,
        file_size=len(raw_bytes),
    )
def clean_code_text(code: str) -> str:
    cleaned_lines: list[str] = []
    for line in code.splitlines():
        stripped = line.rstrip()
        if not stripped.strip():
            continue
        if stripped.lstrip().startswith(("//", "#", "/*", "*")) and len(stripped) > 220:
            continue
        normalized = re.sub(r"\s+", " ", stripped).strip()
        cleaned_lines.append(normalized)
    return "\n".join(cleaned_lines).strip()
def combine_sources(sources: Iterable[UploadedSource]) -> tuple[str, str, int]:
    combined_parts: list[str] = []
    primary_filename = "input.txt"
    total_size = 0
    for index, source in enumerate(sources):
        if index == 0:
            primary_filename = source.filename
        total_size += source.file_size
        cleaned = clean_code_text(source.content)
        combined_parts.append(f"#
    return "\n\n".join(combined_parts).strip(), primary_filename, total_size
def get_tokenizer():
    if tiktoken is None:
        return None
    try:
        return tiktoken.get_encoding("cl100k_base")
    except Exception:
        return None
def estimate_tokens(text: str) -> int:
    tokenizer = get_tokenizer()
    if tokenizer is not None:
        return len(tokenizer.encode(text))
    return max(1, len(text) // 4)
def chunk_code(text: str, chunk_tokens: int = CHUNK_TOKENS) -> list[str]:
    tokenizer = get_tokenizer()
    if tokenizer is None:
        approx_chunk_size = max(1, chunk_tokens * 4)
        return [text[i : i + approx_chunk_size] for i in range(0, len(text), approx_chunk_size)]
    tokens = tokenizer.encode(text)
    return [
        tokenizer.decode(tokens[i : i + chunk_tokens])
        for i in range(0, len(tokens), chunk_tokens)
    ]
def _strip_markers(text: str) -> str:
    cleaned_lines: list[str] = []
    for line in text.splitlines():
        line = re.sub(r"^\s*[-*•]+\s*", "", line)
        line = re.sub(r"^\s*
        cleaned_lines.append(line.rstrip())
    return "\n".join(cleaned_lines).strip()
def build_review_prompt(code: str, language: str, chunk_index: int | None = None, total_chunks: int | None = None) -> str:
    chunk_context = ""
    if chunk_index is not None and total_chunks is not None:
        chunk_context = f"This is chunk {chunk_index} of {total_chunks}. "
    return f"""
You are a senior software engineer reviewing {language} code.
{chunk_context}Write in professional paragraphs only.
Do not use bullet symbols, markdown bullets, hashtags, or code fence symbols.
Use these section labels exactly and keep each section as a paragraph:
Bug Detection:
Performance Issues:
Security Issues:
Code Improvements:
Code:
{code}
""".strip()
def build_refactor_prompt(code: str, language: str, chunk_index: int | None = None, total_chunks: int | None = None) -> str:
    chunk_context = ""
    if chunk_index is not None and total_chunks is not None:
        chunk_context = f"This is chunk {chunk_index} of {total_chunks}. "
    return f"""
You are a senior software engineer refactoring {language} code.
{chunk_context}Return only the refactored code and meaningful sentence-style comments when needed.
Do not use shorthand comments.
Keep the code readable and properly formatted.
Code:
{code}
""".strip()
async def _call_llm_async(prompt: str) -> str:
    return await asyncio.to_thread(call_llm, prompt)
async def generate_review_output(code: str, language: str) -> str:
    cleaned = clean_code_text(code)
    token_count = estimate_tokens(cleaned)
    if token_count <= MAX_TOKENS:
        prompt = build_review_prompt(cleaned, language)
        return _strip_markers(await _call_llm_async(prompt))
    chunks = chunk_code(cleaned, CHUNK_TOKENS)
    chunk_outputs: list[str] = []
    total_chunks = len(chunks)
    for index, chunk in enumerate(chunks, start=1):
        prompt = build_review_prompt(chunk, language, index, total_chunks)
        chunk_outputs.append(_strip_markers(await _call_llm_async(prompt)))
    synthesis_prompt = f"""
Combine and deduplicate the following code review notes into one professional review.
Write in plain paragraphs with the labels Bug Detection, Performance Issues, Security Issues, and Code Improvements.
Do not use markdown bullets or symbols.
Notes:
{chr(10).join(chunk_outputs)}
""".strip()
    return _strip_markers(await _call_llm_async(synthesis_prompt))
async def generate_refactored_code(code: str, language: str) -> str:
    cleaned = clean_code_text(code)
    token_count = estimate_tokens(cleaned)
    if token_count <= MAX_TOKENS:
        prompt = build_refactor_prompt(cleaned, language)
        return await _call_llm_async(prompt)
    chunks = chunk_code(cleaned, CHUNK_TOKENS)
    refactored_parts: list[str] = []
    total_chunks = len(chunks)
    for index, chunk in enumerate(chunks, start=1):
        prompt = build_refactor_prompt(chunk, language, index, total_chunks)
        refactored_parts.append(await _call_llm_async(prompt))
    return "\n\n".join(refactored_parts).strip()