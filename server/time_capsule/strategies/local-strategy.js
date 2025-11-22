import passport from "passport";
import { Strategy } from "passport-local";
import { fakeUsers } from "../utils/demoData.js"
import { comparePassword } from "../utils/helpers.js";

// Used with sessions (not currently implemented)
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     try {
//         const findUser = fakeUsers.find((user) => user.id === id);
//         if (!findUser) throw new Error("User not found");
//         done(null, findUser);
//     } catch (err) {
//         done(err, null); 
//     }
// });
// End

export default passport.use(
    new Strategy((username, password, done) => {
        try {
            // Query database for user info
            const findUser = fakeUsers.find((user) => user.username === username);
            if (!findUser) throw new Error("User not found");
            if (!comparePassword(password, findUser.password)) throw new Error("Invalid Credentials");
            done(null, findUser);
        } catch (err) {
            done(err, null);
        }
    })
);