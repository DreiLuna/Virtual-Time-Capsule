from hashlib import pbkdf2_hmac
from config import SALT_LEN, PBKDF2_ITERATIONS
import os

# use PBKDF2 to generate AES-GCM key from password 


def new_salt() -> bytes:
    return os.urandom(SALT_LEN)

def derive_key(password: bytes, salt: bytes) -> bytes:
    kdf = pbkdf2_hmac(
        'sha256',
        password,
        salt,
        PBKDF2_ITERATIONS,
    )
    return kdf

