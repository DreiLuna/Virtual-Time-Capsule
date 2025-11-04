import unittest
from crypto.encrypt_decrypt import encrypt_blob, decrypt_blob

class TestEncryption(unittest.TestCase):
    def test_encryption(self):
        password = b"password123"
        message = b"hello from time capsule"
        aad = "file encrypted on 10/09/2025"

        env = encrypt_blob(message, password, aad)
        plaintext, new_aad = decrypt_blob(env, password)
        
        self.assertEqual(message, plaintext)

if __name__ == '__main__':
    unittest.main()