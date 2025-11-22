import { Router } from 'express';
import { validationResult, matchedData, checkSchema } from 'express-validator'
import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/helpers.js';
import { userValidationSchema } from '../utils/validationSchemas.js';

// Temp imports
import { fakeUsers, SECRET_KEY } from '../utils/demoData.js'
import passport from 'passport';

const router = Router();

router.post('/api/users', checkSchema(userValidationSchema), (req, res) => {
    // Input validation result
    const result = validationResult(req);
    // Error handling
    if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });

    const data = matchedData(req);
    // Check if username is unique

    // Hash password
    data.password = hashPassword(data.password);
    // Create new user
    const newUser = {
        id:
            fakeUsers.length + 1,
        username: data.username,
        password: data.password
    };

    // Add user to database

    fakeUsers.push(newUser);
    // Successful response
    res.status(201).send(newUser); // 201 means resource created
});

router.post('/api/auth', checkSchema(userValidationSchema), passport.authenticate("local"), (req, res) => {
    // Input validation result
    const result = validationResult(req);
    // Error handling
    if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });

    const data = matchedData(req);
    console.log(data.username);

    res.status(200).send("Logged in");
});

router.post('/api/auth/logout', (req, res) => {
    if (!req.user) return res.sendStatus(400);
    return res.sendStatus(200);
});

export default router;