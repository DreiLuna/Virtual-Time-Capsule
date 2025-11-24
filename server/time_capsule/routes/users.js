import { Router } from "express";
import { checkSchema } from "express-validator";
import { userValidationSchema } from "../utils/validationSchemas.js";
import { createUserHandler } from "../handlers/users.js";

// Temp imports
import { fakeUsers } from "../utils/demoData.js";
import passport from "passport";

const router = Router();

router.post("/register", checkSchema(userValidationSchema), createUserHandler);

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
