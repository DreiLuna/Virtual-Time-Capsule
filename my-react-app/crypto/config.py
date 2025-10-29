NONCE_LEN = 12                  #nonce for AES-GCM
KEY_LEN = 32                    #256-bit key
SALT_LEN = 16                   #PBKDF2 salt
PBKDF2_ITERATIONS = 1000        #minimum listed in https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf
#add AAD later