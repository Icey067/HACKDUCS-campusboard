/**
 * JWT authentication middleware.
 * Extracts token from Authorization header or cookie,
 * verifies it, and attaches user to req.user.
 */
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // Check Authorization header first, then cookie fallback
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, name }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Optional auth — attaches user if token present, but doesn't block.
 * Useful for routes that behave differently when logged in.
 */
const optionalAuth = (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch {
      // Token invalid — just proceed without user
    }
  }

  next();
};

module.exports = { authenticate, optionalAuth };
