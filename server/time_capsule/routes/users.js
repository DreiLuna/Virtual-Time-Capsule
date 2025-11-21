import express from 'express';

const userRoutes = express.Router();

userRoutes.post('/register', (req, res) => {
    
    res.send('New User');
});

userRoutes.post('/login', (req, res) => {
    res.send('Login');
});

export default userRoutes;