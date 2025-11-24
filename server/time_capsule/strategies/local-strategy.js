import passport from "passport";
import { Strategy } from "passport-local";
import { fakeUsers } from "../utils/demoData.js"
import { comparePassword } from "../utils/helpers.js";
import {User, File, sequelize} from '../database.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);  // look up user by their primary key

    if (!user) {
      return done(new Error("User not found"), null);
    }

    return done(null, user);  // attaches user to req.user
  } catch (err) {
    return done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      // 1. Look up user by email
      const findUser = await User.findOne({ where: { email: username } });

      if (!findUser) {
        return done(null, false, { message: "User not found" });
      }

      // 2. Compare hashed password
      if (!comparePassword(password, findUser.passwordHash)) {
        return done(null, false, { message: "Invalid Credentials" });
      }

      // 3. Return authenticated user
      return done(null, findUser);

    } catch (err) {
      return done(err, null);
    }
  })
);