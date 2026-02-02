const jwt = require('jsonwebtoken');

// Use the same secret key as in your auth.js
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

const verifyToken = (req, res, next) => {
  // 1. Get the token from the header
  const token = req.header('Authorization');

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    // 3. Verify the token (Remove "Bearer " if sent with prefix)
    const tokenString = token.replace("Bearer ", "");
    const verified = jwt.verify(tokenString, JWT_SECRET);
    
    // 4. Add the user data to the request object so we can use it later
    req.user = verified;
    next(); // Let them pass
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = verifyToken;