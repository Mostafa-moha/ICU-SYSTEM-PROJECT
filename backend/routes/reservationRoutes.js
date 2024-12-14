// routes/reservationRoutes.js
const express = require('express');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware');
const reservationController = require('../controllers/reservationController');

const router = express.Router();

// Admin Routes for Reservations
router.get('/all', authenticateJWT, isAdmin, reservationController.getAllReservationsForAdmin); // Get All Reservations for Admin

module.exports = router;