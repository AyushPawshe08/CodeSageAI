import smtplib
from email.message import EmailMessage

from config.settings import settings


def _build_otp_html(otp: str) -> str:
    return f"""
    <div style="font-family: Arial, sans-serif; background:#f7f7f7; padding:32px;">
      <div style="max-width:560px; margin:0 auto; background:#ffffff; border:1px solid #e5e5e5; border-radius:16px; padding:32px;">
        <p style="margin:0 0 8px; color:#111111; font-size:14px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">
          CodeSage AI
        </p>
        <h1 style="margin:0 0 12px; color:#111111; font-size:24px;">Your verification code</h1>
        <p style="margin:0 0 24px; color:#444444; font-size:16px; line-height:1.6;">
          Use the one-time code below to complete your registration. The code expires in a few minutes.
        </p>
        <div style="font-size:36px; font-weight:800; letter-spacing:0.2em; color:#111111; background:#f2f2f2; padding:18px 20px; border-radius:12px; text-align:center;">
          {otp}
        </div>
        <p style="margin:24px 0 0; color:#666666; font-size:14px; line-height:1.6;">
          If you did not request this email, you can ignore it.
        </p>
      </div>
    </div>
    """


def _build_otp_text(otp: str) -> str:
    return (
        "CodeSage AI verification code\n\n"
        f"Your one-time code is: {otp}\n\n"
        "This code expires in a few minutes."
    )


def _validate_smtp_config() -> None:
    missing = []

    if not settings.SMTP_HOST:
        missing.append("SMTP_HOST")
    if not settings.SMTP_USERNAME:
        missing.append("SMTP_USERNAME")
    if not settings.SMTP_PASSWORD:
        missing.append("SMTP_PASSWORD")
    if not settings.SMTP_FROM_EMAIL:
        missing.append("SMTP_FROM_EMAIL")

    if missing:
        raise ValueError(f"Missing SMTP environment variables: {', '.join(missing)}")


def send_otp_email(email: str, otp: str) -> None:
    _validate_smtp_config()

    message = EmailMessage()
    message["Subject"] = "Your CodeSage AI verification code"
    message["From"] = settings.SMTP_FROM_EMAIL
    message["To"] = email
    message.set_content(_build_otp_text(otp))
    message.add_alternative(_build_otp_html(otp), subtype="html")

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=30) as smtp:
        if settings.SMTP_USE_TLS:
            smtp.starttls()
        smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        smtp.send_message(message)
