# Crypto Module

This module handles all encryption and decryption for the Virtual Time Capsule project.

## Files
- encrypt_decrypt.py    facilitates aead and kdf and creates a JSON envelope format that can be stored/sent
- kdf.py                derives key used for encryption from password using PBKDF2 (might switch to argon2id in the future)
- aead.py               uses AES-GCM encryption to encrypt file

## Usage
```python
from crypto.encrypt_decrypt import encrypt_blob, decrypt_blob

password = b"password123"
message = b"hello from time capsule"
aad = "file encrypted on 10/09/2025"

env = encrypt_blob(message, password, aad) # JSON-encoded envelope
plaintext, new_aad = decrypt_blob(env, password)

print(plaintext)
```