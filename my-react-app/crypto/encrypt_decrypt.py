
from kdf import new_salt, derive_key
from aead import encrypt_bytes, decrypt_bytes


if __name__ == "__main__":
    password = b"my strong passphrase"
    message = b"hello from the time capsule"
    aad = b"file encrypted 10/09/2025"

    # --- first "session": derive key, encrypt ---
    salt = new_salt()                       # KEEP this with your ciphertext in real life
    key  = derive_key(password, salt)
    
    print("Password: ", password)
    print("Message:", message)
    print("AAD: ", aad)
    print("Salt: ", new_salt)
    print("Key: ", key)

    nonce, ciphertext = encrypt_bytes(key, message, aad)  # aad can be None for now
    print("ciphertext bytes:", ciphertext)

    # --- later (or simulating a fresh run): re-derive key, decrypt ---
    key2 = derive_key(password, salt)       # same password + same salt -> same key
    plaintext = decrypt_bytes(key2, nonce, ciphertext, aad)
    print("decrypted:", plaintext)