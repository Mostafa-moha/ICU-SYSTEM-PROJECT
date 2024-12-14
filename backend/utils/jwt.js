require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET;

// Function to generate a JWT token for a user
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const options = {
    expiresIn: '1h' // token expiration time (e.g., 1 hour)
  };

  return jwt.sign(payload, JWT_SECRET_KEY, options);
};

// Function to verify a JWT token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    console.error('Invalid token', error);
    throw new Error('Invalid token');
  }
};

module.exports = {
  generateToken,
  verifyToken
};
