import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Worker } from "../modelSchema/worker.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALL_BACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Worker.findOne({ googleId: profile.id });

        if (!user) {
          user = await Worker.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
          });
        }

        const accessTokenJWT = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        const refreshTokenJWT = jwt.sign(
          { _id: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        user.refreshToken = refreshTokenJWT;
        await user.save();

        const payload = {
          accessToken: accessTokenJWT,
          refreshToken: refreshTokenJWT,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            role: user.role
          }
        };

        done(null, payload); 
      } catch (err) {
        done(err, null);
      }
    }
  )
);
