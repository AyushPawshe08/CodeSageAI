import resend

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


def send_otp_email(email: str, otp: str) -> None:
    if not settings.RESEND_API_KEY:
        raise ValueError("RESEND_API_KEY is missing from the environment")

    resend.api_key = settings.RESEND_API_KEY

    from_email = (settings.RESEND_FROM_EMAIL or settings.AUTH_FROM_EMAIL).strip()
    test_sender = "onboarding@resend.dev"

    if from_email == test_sender and email.lower() != from_email.lower():
        raise ValueError(
            "Resend test sender can only email its own verified test address. "
            "Set RESEND_FROM_EMAIL to a verified domain sender at resend.com/domains."
        )

    params = {
        "from": from_email,
        "to": [email],
        "subject": "Your CodeSage AI verification code",
        "html": _build_otp_html(otp),
        "text": f"Your CodeSage AI verification code is {otp}. It expires in a few minutes.",
    }

    resend.Emails.send(params)
