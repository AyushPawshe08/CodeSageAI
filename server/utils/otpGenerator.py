from random import randint
def generate_otp() -> str:
    return f"{randint(0, 999999):06d}"