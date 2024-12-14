// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { Hospital } = require('../models/Hospital');
const { ICURoom } = require('../models/ICURoom');
const { Patient } = require('../models/Patient');
const { Reservation } = require('../models/Reservation');
const { User } = require('../models/User');


// Helper function to verify the token
const verifyToken = (token) => {
  const secretKey = process.env.JWT_SECRET_KEY; // Ensure you have this secret key in your environment
  return jwt.verify(token, secretKey);
};


// Verify token middleware
exports.authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const decoded = verifyToken(token); // Use verifyToken to decode the token

    // Attach decoded user data to the request object
    req.user = decoded;
    
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Verify if the user has admin privileges (including SuperAdmin)
exports.isAdmin = async (req, res, next) => {
  try {
    // Check the user role, allowing both SuperAdmin and Admin roles
    const { role } = req.user;
    
    if (role !== 'admin' && role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }
    
    // If the user is an admin or super admin, continue
    const user = await User.findByPk(req.user.id); // Validate user in the database
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error validating admin privileges' });
  }
};

// Verify if the user has super admin privileges
exports.isSuperAdmin = async (req, res, next) => {
  try {
    // Only SuperAdmins should be allowed to proceed
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied: Super Admins only' });
    }

    // Verify SuperAdmin in the database (if necessary)
    const superAdmin = await Admin.findByPk(req.user.id);
    if (!superAdmin) {
      return res.status(404).json({ error: 'SuperAdmin not found' });
    }

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(500).json({ error: 'Error validating super admin privileges' });
  }
};


// Verify if the user is a patient
exports.isPatient = async (req, res, next) => {
  try {
    // Ensure the user role is patient
    if (req.user.role !== 'patient') {
      return res.status(403).json({ error: 'Access denied: Patients only' });
    }

    // Verify patient in the database
    const patient = await Patient.findByPk(req.user.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(500).json({ error: 'Error validating patient privileges' });
  }
};
