from app.config import settings
import requests

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

def _review_prompt(code: str, language: str) -> str:
    """Generate review prompt for the LLM"""
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
    """Generate refactor prompt for the LLM"""
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
    """Call the Groq LLM API with the given prompt"""
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": settings.MODEL_NAME,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2
    }
    
    try:
        response = requests.post(GROQ_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error calling LLM API: {str(e)}")

def review_code_llm(code: str, language: str) -> str:
    """Review code using LLM"""
    prompt = _review_prompt(code, language)
    return call_llm(prompt)

def refactor_code_llm(code: str, language: str) -> str:
    """Refactor code using LLM"""
    prompt = _refactor_prompt(code, language)
    return call_llm(prompt)