import express from 'express';
import passport from 'passport';
import "./strategies/local-strategy.js"
import cookieParser from "cookie-parser";
import session from "express-session";
const app = express();

// Import the route files
import routes from './routes/index.js'

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: "secret", // Replace with better string
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60 * 12, // (60000 * 60) = 1 hour. Cookies set to be valid for 12 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Access routes
app.use(routes);

// Sets session cookie when a user visits the homepage
app.get("/", (req, res) => {
    req.session.visited = true;
    res.sendStatus(200);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));