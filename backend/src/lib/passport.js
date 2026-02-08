// googleStrategy.js
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const avatar = profile.photos[0].value;
        const name = profile.displayName;

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            fullName: name,
            email,
            profilePicture: avatar,
            provider: "google",
          });
        }

        done(null, user);
      } catch (error) {
        console.log("Error in Google OAuth:", error);
        done(error, null);
      }
    },
  ),
);
