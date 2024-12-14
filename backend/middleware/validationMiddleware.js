// middleware/validationMiddleware.js
const { check, validationResult } = require('express-validator');
const { validatePatientInput } = require('../utils/validation');

// Middleware for patient registration validation
exports.validatePatientRegistration = [
  // First layer: express-validator checks for basic field validations
  check('name').notEmpty().withMessage('Name is required'),
  check('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
  check('condition').notEmpty().withMessage('Condition is required'),
  check('contactNumber').isLength({ min: 10 }).withMessage('Contact number must be at least 10 digits'),

  // Second layer: custom validation using utility functions (more specific checks)
  (req, res, next) => {
    const patient = req.body; // Assuming patient data is in the request body
    
    // Validate custom conditions
    if (!validateCondition(patient.condition)) {
      return res.status(400).json({ message: 'Invalid condition provided' });
    }

    const validationError = validatePatientInput(patient);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    next();
  },
];



// Middleware for admin registration validation
exports.validateAdminRegistration = [
  // First layer: express-validator checks for basic field validations
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  // Additional validation for admin role, if needed
  check('role').notEmpty().withMessage('Role is required').isIn(['admin', 'superadmin']).withMessage('Invalid role'),
  
  // Result handler for express-validator errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];




// Middleware for room availability validation (basic checks using express-validator)
exports.validateRoomAvailability = [
  check('hospitalID').isInt().withMessage('Hospital ID must be an integer'),
  check('specialization').notEmpty().withMessage('Specialization is required'),

  // Result handler for express-validator errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware for login validation (basic checks using express-validator)
exports.validateLogin = [
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  // Result handler for express-validator errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
