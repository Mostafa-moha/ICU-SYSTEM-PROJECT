const express = require('express');
const router = express.Router();

const hospitalController = require('../controllers/hospitalController');
const { authenticateJWT, isAdmin, isSuperAdmin  } = require('../middleware/authMiddleware'); // Correct import


//SuperAdmin Routes
router.post('/add', authenticateJWT, isSuperAdmin, hospitalController.addHospitalAndAdmin);
router.put('/update/:hospitalID', authenticateJWT, isSuperAdmin, hospitalController.updateHospital); // Update Hospital
router.delete('/delete/:hospitalID', authenticateJWT, isSuperAdmin, hospitalController.deleteHospital); // Delete Hospital
router.get('/list', authenticateJWT, isSuperAdmin, hospitalController.listAllHospitals); // List all Hospitals

// Admin Routes
router.get('/hospitals/:hospitalID', authenticateJWT, isAdmin, hospitalController.getHospitalDetails);

module.exports = router;