import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';


import express from 'express';
const app = express();

// Import the route files
import userRoutes from './routes/users.js'

app.get("/", (req, res) => {
    res.send("Hello world");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));

// // Register
// app.post("/register", (req, res) => {

// });

export const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: 'virtualTimeCapsule',
  user: 'postgres',
  password: 'mysecretpassword',
  host: 'localhost',
  port: 5432,
  ssl: true,
  clientMinMessages: 'notice',
});

