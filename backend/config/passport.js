/**
 * Passport.js Google OAuth 2.0 strategy configuration.
 * On successful Google login, upserts user into the DB and returns JWT.
 */
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: googleId, displayName, emails } = profile;
        const email = emails?.[0]?.value;

        // Upsert — insert if new, return existing if already registered
        const result = await pool.query(
          `INSERT INTO users (name, email, google_id)
           VALUES ($1, $2, $3)
           ON CONFLICT (google_id) DO UPDATE SET name = $1, email = $2
           RETURNING *`,
          [displayName, email, googleId]
        );

        return done(null, result.rows[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize / deserialize (not using sessions, but needed for passport init)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
