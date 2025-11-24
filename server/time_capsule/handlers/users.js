import { validationResult, matchedData, checkSchema } from 'express-validator';
import { hashPassword } from '../utils/helpers.js';
import { User } from '../database.js';

export const createUserHandler = async (req, res) => {
    // Input validation result
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    const data = matchedData(req); // e.g. { username, password }

    // Hash password
    const hashed = hashPassword(data.password);
    try {
        // Add user to database
        const newUser = await User.create({
            email: data.email,
            passwordHash: hashed,
        });

        // Successful response (do NOT send passwordHash)
        res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            createdAt: newUser.createdAt,
        });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}