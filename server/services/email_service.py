import resend
from config.settings import settings
def send_otp_email(email: str, otp: str) -> None:
    if not settings.RESEND_API_KEY:
        raise ValueError("RESEND_API_KEY is missing from the environment")
    resend.api_key = settings.RESEND_API_KEY
    html = f"""
    <div style="font-family: Arial, sans-serif; background:
      <div style="max-width: 560px; margin: 0 auto; background:
        <p style="margin: 0 0 8px; color:
        <h1 style="margin: 0 0 12px; color:
        <p style="margin: 0 0 24px; color:
          Use the one-time code below to complete your registration. The code expires in a few minutes.
        </p>
        <div style="font-size: 36px; font-weight: 800; letter-spacing: 0.2em; color:
          {otp}
        </div>
        <p style="margin: 24px 0 0; color:
          If you did not request this email, you can ignore it.
        </p>
      </div>
    </div>
    """
    params = {
        "from": settings.AUTH_FROM_EMAIL,
        "to": [email],
        "subject": "Your CodeSage AI verification code",
        "html": html,
    }
    resend.Emails.send(params)