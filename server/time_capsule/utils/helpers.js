import bcrypt from 'bcrypt';

const saltRounds = 10; // Time needed to calculate hash

export const hashPassword = (password) => {
    // Synchronous version (no need for async/await). 
    const salt = bcrypt.genSaltSync(saltRounds); 
    return bcrypt.hashSync(password, salt)
}

export const comparePassword = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed);
}