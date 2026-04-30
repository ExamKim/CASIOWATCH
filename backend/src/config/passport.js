const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const userService = require('../services/userService');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const API_BASE = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${API_BASE}/auth/google/callback`,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails && profile.emails[0] && profile.emails[0].value;
            const username = profile.displayName || (profile.name && `${profile.name.givenName} ${profile.name.familyName}`) || email;
            if (!email) return done(new Error('No email from Google'), null);

            let user = await userService.findByEmail(email);
            if (!user) {
                user = await userService.createUser({ username, email, passwordHash: null });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));
}

if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: `${API_BASE}/auth/facebook/callback`,
        profileFields: ['id', 'emails', 'name', 'displayName']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails && profile.emails[0] && profile.emails[0].value;
            const username = profile.displayName || (profile.name && `${profile.name.givenName} ${profile.name.familyName}`) || email;
            if (!email) return done(new Error('No email from Facebook'), null);

            let user = await userService.findByEmail(email);
            if (!user) {
                user = await userService.createUser({ username, email, passwordHash: null });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));
}

module.exports = passport;