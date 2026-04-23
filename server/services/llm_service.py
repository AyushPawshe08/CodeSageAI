import requests
from config.settings import settings
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
def _review_prompt(code: str, language: str) -> str:
    return f"""You are a Senior Software Engineer with 15 years of experience in software development.
You have worked in multiple startups and MNCs.
You have experience in multiple programming languages.
You are an expert in code review.
Review the following {language} code:
{code}
Provide detailed feedback on:
- Bugs and potential issues
- Security vulnerabilities
- Performance bottlenecks
- Proper function, variable, method, and class naming
- Error handling improvements
- Code comments and documentation
- Best practices and design patterns
"""
def _refactor_prompt(code: str, language: str) -> str:
    return f"""You are a Senior Software Engineer with 15 years of experience in software development.
You have worked in multiple startups and MNCs.
You have experience in multiple programming languages.
You are an expert in code refactoring.
Refactor the following {language} code:
{code}
Focus on:
- Improving readability and formatting
- Proper function, variable, method, and class naming
- Adding proper error handling
- Adding proper comments and documentation
- Applying best practices and design patterns
- Optimizing performance where applicable
Provide the refactored code with explanations.
"""
def call_llm(prompt: str) -> str:
    if not settings.GROQ_API_KEY:
        raise Exception("GROQ_API_KEY is missing from the environment")
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": settings.MODEL_NAME,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
    }
    try:
        response = requests.post(GROQ_URL, headers=headers, json=payload, timeout=120)
        if response.status_code == 401:
            raise Exception(
                "Groq rejected the API key with a 401 Unauthorized response. "
                "Check GROQ_API_KEY in server/.env and make sure the key is active."
            )
        if response.status_code == 403:
            raise Exception(
                "Groq denied the request with a 403 Forbidden response. "
                "Check that the key has access to the selected model."
            )
        if not response.ok:
            detail = response.text.strip()
            raise Exception(
                f"Groq API returned {response.status_code}. {detail or 'No response body was returned.'}"
            )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as exc:
        raise Exception(f"Error calling LLM API: {exc}") from exc
def review_code_llm(code: str, language: str) -> str:
    return call_llm(_review_prompt(code, language))
def refactor_code_llm(code: str, language: str) -> str:
    return call_llm(_refactor_prompt(code, language))