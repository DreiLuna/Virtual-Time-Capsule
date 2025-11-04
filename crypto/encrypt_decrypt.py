import json, base64
from config import PBKDF2_ITERATIONS
from kdf import new_salt, derive_key
from aead import encrypt_bytes, decrypt_bytes

def pack_envelope(kdf_name: str, iterations: int, salt: bytes, nonce: bytes, aad: bytes, ciphertext: bytes) -> bytes:
    obj = {
        "kdf": kdf_name,
        "iterations": iterations,
        "salt": base64.b64encode(salt).decode(),
        "nonce": base64.b64encode(nonce).decode(),
        "aad": base64.b64encode(aad).decode(),
        "ct": base64.b64encode(ciphertext).decode()
    }
    return json.dumps(obj, separators=(",", ":")).encode()

def unpack_envelope(blob: bytes):
    obj = json.loads(blob.decode())
    return {
        "kdf": obj["kdf"],
        "iterations": obj["iterations"],
        "salt": base64.b64decode(obj["salt"]),
        "nonce": base64.b64decode(obj["nonce"]),
        "aad": base64.b64decode(obj["aad"]),
        "ct": base64.b64decode(obj["ct"]),
    }

def encrypt_blob(plaintext: bytes, password: bytes, aad: bytes) -> bytes:
    #encrypt bytes and returns envelope that can be stored/sent 
    salt = new_salt()
    key = derive_key(password, salt)
    nonce, ciphertext = encrypt_bytes(key, plaintext, aad)
    env = pack_envelope("pbkdf2-sha256", PBKDF2_ITERATIONS, salt, nonce, aad, ciphertext)
    return env

def decrypt_blob(envelope: bytes, password: bytes) -> tuple[bytes, bytes]:
    unpacked = unpack_envelope(envelope)
    key = derive_key(password, unpacked["salt"])
    plaintext = decrypt_bytes(key, unpacked["nonce"], unpacked["ct"], unpacked["aad"])
    return plaintext, unpacked["aad"]

if __name__ == "__main__":
    password = b"password123"
    message = b"hello from the time capsule"
    aad = b"file encrypted 10/09/2025"

    # --- first "session": derive key, encrypt ---
    env = encrypt_blob(message, password, aad)

    print(env.decode())
    env_unpacked = unpack_envelope(env)
    salt = env_unpacked["salt"]
    print(salt)

    # --- later (or simulating a fresh run): re-derive key, decrypt ---
    
    #key2 = derive_key(password, salt)        same password + same salt -> same key
    plaintext, new_aad = decrypt_blob(env, password)
    print("decrypted:", plaintext)