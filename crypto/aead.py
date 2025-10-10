from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

# encrypt file using AES-GCM

data = b'my secret message'
aad = b'This message is for Alice, dated 10/09/2025' #additional authenticated data - metadata included in authentication tag
key = AESGCM.generate_key(bit_length = 128) #replace with derived key from kdf
aesgcm = AESGCM(key)
nonce = os.urandom(12)
ciphertext = aesgcm.encrypt(nonce, data, aad)
decrypted_data = aesgcm.decrypt(nonce, ciphertext, aad)

encrypt
if __name__ == "__main__":
    #for quick test
    print("ciphertext:", ciphertext)
    print("decrypted", decrypted_data)