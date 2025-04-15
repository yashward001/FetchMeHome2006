const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from request headers
  const token = req.header("Authorization");

  // Check if token is missing
  if (!token) {
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }

  try {
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with process.env.JWT_SECRET for security
    req.user = { id: decoded.id };  // Attach user info to request object
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
};
