import passport from "passport";
import { Strategy } from "passport-local";
import { fakeUsers } from "../utils/demoData.js"
import { comparePassword } from "../utils/helpers.js";

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((username, done) => {
    try {
        const findUser = fakeUsers.find((user) => user.email === username);
        if (!findUser) throw new Error("User not found");
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy({ usernameField: "email" }, (username, password, done) => {
        try {
            // Query database for user info
            const findUser = fakeUsers.find((user) => user.email === username);
            if (!findUser) throw new Error("User not found");
            if (!comparePassword(password, findUser.password)) throw new Error("Invalid Credentials");
            done(null, findUser);
        } catch (err) {
            done(err, null);
        }
    })
);