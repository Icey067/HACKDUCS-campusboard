/**
 * Authentication routes — Google OAuth + JWT.
 *
 * Flow:
 *   1. GET /api/auth/google          → redirect to Google consent
 *   2. GET /api/auth/google/callback  → Google redirects back, issue JWT
 *   3. GET /api/auth/me              → get current user from JWT
 *   4. POST /api/auth/logout         → clear token cookie
 */
const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { authenticate } = require("../middleware/auth");

// ── Initiate Google OAuth ──
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ── Google callback — issue JWT and redirect to frontend ──
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    const payload = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      is_admin: req.user.is_admin,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set HTTP-only cookie and also pass token as query param for SPA
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend with token (frontend stores in localStorage)
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

// ── Get current authenticated user ──
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// ── Logout — clear cookie ──
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;
