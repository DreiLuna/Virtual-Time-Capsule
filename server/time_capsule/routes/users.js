import { Router } from 'express';
import { validationResult, matchedData, checkSchema } from 'express-validator';
import { hashPassword } from '../utils/helpers.js';
import { userValidationSchema } from '../utils/validationSchemas.js';

// Temp imports
import { fakeUsers } from '../utils/demoData.js'
import passport from 'passport';

const router = Router();

router.post('/api/users', checkSchema(userValidationSchema), (req, res) => {
    // Input validation result
    const result = validationResult(req);
    // Error handling
    if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });

    const data = matchedData(req);
    console.log(data.email);

    // Hash password
    data.password = hashPassword(data.password);
    // Create new user
    const newUser = {
        id:
            fakeUsers.length + 1,
        username: data.email,
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

    res.sendStatus(200);
});

router.get('/api/auth/status', (req, res) => {
    return req.user ? res.send(req.user) : res.sendStatus(401);
});

router.post('/api/auth/logout', (req, res) => {
    if (!req.user) return res.sendStatus(401);
    
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.sendStatus(200);
        console.log("Done");
    })
});

export default router;