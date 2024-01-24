import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import session from 'express-session';

export default function usePassportAuth(app) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, callback) => {
        req.profile = profile;
        callback(null, profile);
      },
    ),
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['emails', 'displayName', 'name', 'picture'],
      },
      (accessToken, refreshToken, profile, callback) => {
        callback(null, profile);
      },
    ),
  );

  passport.serializeUser((user, callback) => {
    callback(null, user);
  });

  passport.deserializeUser((user, callback) => {
    callback(null, user);
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}
