import passport from "passport";
import { Strategy } from "passport-local";
import { fakeUsers } from "../utils/demoData.js";
import { comparePassword } from "../utils/helpers.js";
import { User, File, sequelize } from "../database.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

<<<<<<< HEAD
=======
// passport.deserializeUser((username, done) => {
//     try {
//         const findUser = fakeUsers.find((user) => user.username === username);
//         if (!findUser) throw new Error("User not found");
//         done(null, findUser);
//     } catch (err) {
//         done(err, null);
//     }
// });
>>>>>>> 401b3844cb87e8e4ed1e9a99dac3bb91eeacdb5c
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id); // look up user by their primary key

    if (!user) {
      return done(new Error("User not found"), null);
    }

    return done(null, user); // attaches user to req.user
  } catch (err) {
    return done(err, null);
  }
});

export default passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      // 1. Look up user by email
      const findUser = await User.findOne({ where: { email } });

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
  }),
);
