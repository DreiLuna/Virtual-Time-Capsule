import { Router } from 'express';
import { validationResult, matchedData, checkSchema } from 'express-validator';
import { hashPassword } from '../utils/helpers.js';
import { userValidationSchema } from '../utils/validationSchemas.js';
import {User, File, sequelize} from '../database.js';

// Temp imports
import { fakeUsers } from '../utils/demoData.js'
import passport from 'passport';

const router = Router();

router.post(
  '/api/users',
  checkSchema(userValidationSchema),
  async (req, res) => {
    try {
      // Input validation result
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const data = matchedData(req); // e.g. { username, password }



      // Hash password
      const hashed = hashPassword(data.password);

      // Add user to database
      const newUser = await User.create({
        email: data.username,     // or data.email if that's how you validate it
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
);

router.post('/api/auth', checkSchema(userValidationSchema), passport.authenticate("local"), (req, res) => {
    // Input validation result
    const result = validationResult(req);
    // Error handling
    if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });

    const data = matchedData(req);
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