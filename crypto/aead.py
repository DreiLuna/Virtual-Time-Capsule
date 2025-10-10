from config import NONCE_LEN
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

# encrypt file using AES-GCM

def encrypt_bytes(key: bytes, plaintext: bytes, aad: bytes):
    nonce = os.urandom(NONCE_LEN)
    ciphertext = AESGCM(key).encrypt(nonce, plaintext, aad)
    return nonce, ciphertext

def decrypt_bytes(key: bytes, nonce: bytes, ciphertext: bytes, aad: bytes) -> bytes:
    return AESGCM(key).decrypt(nonce, ciphertext, aad)