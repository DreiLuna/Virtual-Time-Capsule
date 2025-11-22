import { Router } from 'express';
import { validationResult, matchedData, checkSchema } from 'express-validator'
import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/helpers.js';
import { userValidationSchema } from '../utils/validationSchemas.js';

// Temp imports
// import {demoData} from '../utils/demoData.js'
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';
const users = [
    { id: 1, username: 'user1', password: 'password123' },
    { id: 2, username: 'user2', password: 'password123' },
    { id: 3, username: 'user3', password: 'password123' }
];

const router = Router();

router.post('/api/register', checkSchema(userValidationSchema), (req, res) => { 
    // Input validation result
    const result = validationResult(req);
    // Error handling
    if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });

    const data = matchedData(req);
    // Check if username is unique

    // Hash password
    data.password = hashPassword(data.password);
    console.log(data.password);
    // Create new user
    const newUser = {
        id:
            users.length + 1,
        username: data.username,
        password: data.password
    };

    // Add user to database

    // Successful response
    res.status(201).send(newUser); // 201 means resource created
});

router.post('/api/login', checkSchema(userValidationSchema), (req, res) => {
    // Input validation result
    const result = validationResult(req);
    // Error handling
    if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });

    const data = matchedData(req);
    // Query database for user info

    // If user found and password matches
    if (data.username === user.username && data.password === user.password) {
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