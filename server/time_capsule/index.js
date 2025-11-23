import express from 'express';
import passport from 'passport';
import "./strategies/local-strategy.js"
import cookieParser from "cookie-parser";
import session from "express-session";
//import { Sequelize, Model, DataTypes, Utils } from 'sequelize';
const app = express();

// Import the route files
import userRoutes from './routes/users.js'

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
app.use(userRoutes);

// Sets session cookie when a user visits the homepage
app.get("/", (req, res) => {
    req.session.visited = true;
    res.sendStatus(200);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));


// export const sequelize = new Sequelize({
//   dialect: 'postgres',
//   database: 'postgres',
//   user: 'postgres',
//   password: 'mysecretpassword',
//   host: 'localhost',
//   port: 5432,
//   ssl: true,
//   clientMinMessages: 'notice',
// });

// class User extends Model {}
// User.init(
//   {
//     username: DataTypes.STRING,
//     birthday: DataTypes.DATE,
//   },
//   { sequelize, modelName: 'user' },
// );

// (async () => {
//   await sequelize.sync();
//   const jane = await User.create({
//     username: 'janedoe',
//     birthday: new Date(1980, 6, 20),
//   });
//   console.log(jane.toJSON());
// })();