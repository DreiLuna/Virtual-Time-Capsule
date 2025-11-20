const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
    
    res.send('New User');
});

router.post('/login', (req, res) => {
    res.send('Login');
});

module.exports = router;