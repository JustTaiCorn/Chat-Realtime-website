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
      callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (accessToken, profile, done) => {
      try {
        const email = profile.emails[0].value; // ✅ Sửa: emails là array
        const avatar = profile.photos[0].value; // ✅ Sửa: photos là array
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
    }
  )
);
