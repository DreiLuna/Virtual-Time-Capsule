import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware for parsing json
router.use(express.json())

// Demo data
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';
const user = { id: uuidv4(), username: 'user1', password: 'password123' };

router.post('/api/register', (req, res) => {
    // Input Validation (might be redundant)
    if (!req.body.name || !req.body.password) {
        return res.status(400).json({
            message: 'Name and password are required'
        });
    }
    // Check if username is unique


    // Hash password
    pw_hash = 0;

    // Create new user
    const new_user = {
        id: uuidv4(), // Makes a unique userid
        username: req.body.name,
        password: pw_hash
    };

    // Add user to database

    res.status(201).json({ message: 'User registered successfully' }); // 201 means resource created
    res.send("Success"); // Temporary
});

router.post('/api/login', (req, res) => {
    // Input Validation (might be redundant)
    if (!req.body.name || !req.body.password) {
        return res.status(400).json({ // 400 means Bad Request
            message: 'Invalid Credentials'
        });
    }

    // Query for user info

    // If user found and password matches
    if (req.body.name === user.username && req.body.password === user.password) {
        // Create token
        const token = jwt.sign(
            {
                userId: user.id,

            }
        )
    }

    token = 

    res.send('Login');
});

export default router;