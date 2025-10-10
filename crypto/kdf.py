from hashlib import pbkdf2_hmac
import os

# use PBKDF2 to generate AES-GCM key from password 
iterations = 1000 
salt = os.urandom(16)
password = b'examplePSWD123'

dk = pbkdf2_hmac('sha256', password, salt, iterations)


if __name__ == "__main__":
    #for quick test
    print("Salt:", salt.hex())
    print("Derived key:", dk.hex())