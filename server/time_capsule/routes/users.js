import { Router } from "express";
import { validationResult, matchedData, checkSchema } from "express-validator";
import { hashPassword } from "../utils/helpers.js";
import { userValidationSchema } from "../utils/validationSchemas.js";
import { User, File, sequelize } from "../database.js";

// Temp imports
import { fakeUsers } from "../utils/demoData.js";
import passport from "passport";

const router = Router();

router.post(
  "/register",
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
  },
);

router.post("/login", checkSchema(userValidationSchema), (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({ message: info?.message || "Login failed" });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      // Optionally, send user info (never send passwordHash)
      return res.json({
        message: "Login successful!",
        user: { id: user.id, email: user.email },
      });
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);

  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.sendStatus(200);
  });
});

export default router;
