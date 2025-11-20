const express = require("express");
const app = express();

// Import the route files
const userRoutes = require('./routes/users');

app.get("/", (req, res) => {
    res.send("Hello world");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));

// // Register
// app.post("/register", (req, res) => {

// });