from typing import Any

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status

from sqlalchemy.orm import Session

from config.database import get_db

from auth.auth_handler import require_authenticated_user

from models.history_model import CodeReviewHistory

from schema.history_schema import HistoryDetailResponse, HistoryListItem, ReviewStoredResponse

from services.review_processor import (

    UploadedSource,

    combine_sources,

    extract_text_from_bytes,

    generate_refactored_code,

    generate_review_output,

    normalize_filename,

)

router = APIRouter(tags=["Code Reviews"])

def _infer_language_from_filename(filename: str) -> str:

    extension = normalize_filename(filename).rsplit(".", 1)[-1].lower() if "." in filename else "text"

    return {

        "py": "Python",

        "js": "JavaScript",

        "jsx": "JavaScript",

        "ts": "TypeScript",

        "tsx": "TypeScript",

        "java": "Java",

        "cpp": "C++",

        "c": "C",

        "cs": "C",

        "go": "Go",

        "rs": "Rust",

        "txt": "Plain Text",

    }.get(extension, extension.upper())

async def _read_multipart_sources(form_data: Any) -> tuple[str, str, list[UploadedSource], str | None]:

    code_text = (form_data.get("code") or "").strip()

    language = (form_data.get("language") or "").strip()

    files = form_data.getlist("files")

    sources: list[UploadedSource] = []

    for upload in files:

        if not upload.filename:

            continue

        raw_bytes = await upload.read()

        source = extract_text_from_bytes(upload.filename, raw_bytes)

        sources.append(source)

    if code_text and not sources:

        synthetic_source = extract_text_from_bytes("manual-input.txt", code_text.encode("utf-8"))

        sources.insert(0, synthetic_source)

    if sources and not language:

        language = _infer_language_from_filename(sources[0].filename)

    return code_text, language or "Text", sources, (sources[0].filename if sources else None)

async def _read_json_payload(request: Request) -> tuple[str, str, list[UploadedSource], str | None, str]:

    payload = await request.json()

    code_text = str(payload.get("code", "")).strip()

    language = str(payload.get("language", "")).strip() or "Text"

    mode = str(payload.get("mode", "")).strip().lower()

    filename = str(payload.get("filename", "manual-input.txt")).strip() or "manual-input.txt"

    sources: list[UploadedSource] = []

    if code_text:

        encoded = code_text.encode("utf-8")

        source = extract_text_from_bytes(filename, encoded)

        sources.append(source)

    return code_text, language, sources, filename, mode

def _prepare_review_record(code_text: str, sources: list[UploadedSource]) -> tuple[str, str, int, str]:

    if sources:

        combined_code, primary_filename, file_size = combine_sources(sources)

        selected_source = next((source for source in sources if source.filename != "manual-input.txt"), sources[0])

        return combined_code, selected_source.filename, file_size, _infer_language_from_filename(selected_source.filename)

    filename = "manual-input.txt"

    file_size = len(code_text.encode("utf-8"))

    return code_text, filename, file_size, "Text"

@router.post("/review-code/", response_model=ReviewStoredResponse)

async def review_code(

    request: Request,

    db: Session = Depends(get_db),

    _current_user: dict = Depends(require_authenticated_user),

):

    content_type = request.headers.get("content-type", "")

    mode = "review"

    if "multipart/form-data" in content_type:

        form_data = await request.form()

        code_text, language, sources, fallback_filename = await _read_multipart_sources(form_data)

        mode = str(form_data.get("mode", "review")).strip().lower() or "review"

    elif "application/json" in content_type or not content_type:

        code_text, language, sources, fallback_filename, mode = await _read_json_payload(request)

    else:

        raise HTTPException(

            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,

            detail="Unsupported request format",

        )

    if not code_text and not sources:

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Provide text input or uploaded file(s).",

        )

    original_code, filename, file_size, inferred_language = _prepare_review_record(code_text, sources)

    language = language or inferred_language

    review_output = ""

    refactored_code = ""

    if mode == "refactor":

        refactored_code = await generate_refactored_code(original_code, language)

    else:

        review_output = await generate_review_output(original_code, language)

    history = CodeReviewHistory(

        original_code=original_code,

        review_output=review_output,

        refactored_code=refactored_code,

        filename=filename or fallback_filename or "manual-input.txt",

        language=language,

        file_size=file_size,

    )

    db.add(history)

    db.commit()

    db.refresh(history)

    return {

        "id": history.id,

        "message": "Review stored successfully",

    }

@router.get("/history/", response_model=list[HistoryListItem])

async def list_history(

    db: Session = Depends(get_db),

    _current_user: dict = Depends(require_authenticated_user),

):

    records = (

        db.query(CodeReviewHistory)

        .order_by(CodeReviewHistory.created_at.desc())

        .all()

    )

    return records

@router.get("/history/{history_id}", response_model=HistoryDetailResponse)

async def get_history(

    history_id: UUID,

    db: Session = Depends(get_db),

    _current_user: dict = Depends(require_authenticated_user),

):

    record = db.query(CodeReviewHistory).filter(CodeReviewHistory.id == history_id).first()

    if not record:

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="History item not found")

    return record

@router.delete("/history/{history_id}")

async def delete_history(

    history_id: UUID,

    db: Session = Depends(get_db),

    _current_user: dict = Depends(require_authenticated_user),

):

    record = db.query(CodeReviewHistory).filter(CodeReviewHistory.id == history_id).first()

    if not record:

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="History item not found")

    db.delete(record)

    db.commit()

    return {"message": "History item deleted successfully"}