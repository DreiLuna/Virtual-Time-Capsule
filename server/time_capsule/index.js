import express from 'express';
import passport, { Passport } from 'passport';
import "./strategies/local-strategy.js"
import { Sequelize, Model, DataTypes, Utils } from 'sequelize';
const app = express();

// Import the route files
import userRoutes from './routes/users.js'
import { Strategy } from 'passport-local';

app.use(express.json());

app.use(passport.initialize());
app.use(userRoutes);

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