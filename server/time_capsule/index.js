import express from "express";
import passport from "passport";
import "./strategies/local-strategy.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { sequelize } from "./database.js";

const app = express();

// Serve uploaded images statically
import path from "path";
app.use("/uploads", express.static(path.resolve("uploads")));

// CORS setup for frontend on Vite (localhost:5173)
import cors from "cors";
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

import userRoutes from "./routes/users.js";
import imagesRoutes from "./routes/images.js";

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "secret", // Replace with better string
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60 * 12, // (60000 * 60) = 1 hour. Cookies set to be valid for 12 hours
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/users", userRoutes);
app.use("/api/images", imagesRoutes);

// Sets session cookie when a user visits the homepage
app.get("/", (req, res) => {
  req.session.visited = true;
  res.sendStatus(200);
});

const port = process.env.PORT || 3001;

async function startServer() {
  try {
    // 1. Check DB connection
    await sequelize.authenticate();
    console.log("Connected to the database");

    // 2. Sync models (create tables if needed)
    await sequelize.sync(); // use { alter: true } in dev if needed
    console.log(" Models synced");

    // 3. Start the server only after DB is ready
    app.listen(port, () => console.log(` Server running on port ${port}...`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
