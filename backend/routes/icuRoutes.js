// routes/icuRoutes.js
const express = require('express');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware');
const icuController = require('../controllers/icuController');

const router = express.Router();


// Admin Routes for ICU Rooms
router.post('/icu-rooms/:hospitalID', authenticateJWT, isAdmin, icuController.addICURoom); // Add ICU Room
router.put('/icu-rooms/:roomID', authenticateJWT, isAdmin, icuController.updateICURoom); // Update ICU Room
router.delete('/icu-rooms/:roomID', authenticateJWT, isAdmin, icuController.deleteICURoom); // Delete ICU Room

// ICU Room Availability Routes
router.put('/occupy/:roomID', authenticateJWT, isAdmin, icuController.markAsOccupied); // Mark ICU Room as Occupied
router.put('/available/:roomID', authenticateJWT, isAdmin, icuController.markAsAvailable); // Mark ICU Room as Available
router.get('/checkAvailability/:hospitalID/:specialization', authenticateJWT, isAdmin, icuController.checkAvailability); // Check ICU Room Availability


module.exports = router;
