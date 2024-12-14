const express = require('express');
const { authenticateJWT, isSuperAdmin, isAdmin } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();


// SuperAdmin Routes
router.post('/register-admin', authenticateJWT, isSuperAdmin, userController.registerAdmin); // Register Admin
router.put('/update-admin/:userID', authenticateJWT, isSuperAdmin, userController.updateAdminDetails); // Update Admin Details
router.delete('/delete-admin/:userID', authenticateJWT, isSuperAdmin, userController.deleteAdmin); // Delete Admin

// Admin Routes (Login and Management)
router.post('/admin-login', userController.adminLogin); // Admin Login

module.exports = router;