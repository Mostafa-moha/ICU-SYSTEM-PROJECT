// routes/patientRoutes.js
const express = require('express');
const { authenticateJWT, isPatient } = require('../middleware/authMiddleware');
const patientController = require('../controllers/patientController');
const reservationController = require('../controllers/reservationController');

const router = express.Router();

// Patient Routes
router.post('/register',authenticateJWT, patientController.patientRegister); // Register Patient
router.post('/login', patientController.patientLogin); // Patient Login
router.get('/search-hospitals', authenticateJWT, isPatient, patientController.searchNearbyHospitals); // Search Nearby Hospitals


// Reservation Routes for Patients
router.post('/create-reservation', authenticateJWT, isPatient, reservationController.createReservation); // Create Reservation
router.delete('/cancel-reservation/:reservationID', authenticateJWT, isPatient, reservationController.cancelReservation); // Cancel Reservation
router.put('/submit-reservation/:reservationID', authenticateJWT, isPatient, reservationController.submitReservation); // Submit Reservation
router.get('/reservation-details/:reservationID', authenticateJWT, isPatient, reservationController.getReservationDetails); // Get Reservation Details

module.exports = router;
