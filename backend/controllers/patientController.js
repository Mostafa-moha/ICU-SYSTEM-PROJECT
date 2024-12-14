const Patient = require('../models/Patient');
const Hospital = require('../models/Hospital');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateToken } = require('../utils/jwt'); // Import generateToken


// Register a patient
exports.patientRegister = async (req, res) => {
  const { name, age, gender, condition, location, contactNumber } = req.body;
  
  // Validate missing data
  if (!name || !age || !gender || !condition || !location || !contactNumber) {
    return res.status(400).json({ error: 'Missing required fields for patient registration' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);  // Hash password
    const patient = await Patient.create({
      name, age, gender, condition, location, contactNumber, password: hashedPassword
    });
    res.status(201).json({ message: 'Patient registered successfully', patient });
  } catch (error) {
    res.status(500).json({ error: 'Unable to register patient' });
  }
};

// Patient Login
exports.patientLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patient.findOne({ where: { email } });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const validPassword = await bcrypt.compare(password, patient.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = generateToken(patient); // Generate JWT token for the patient
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Unable to login as patient' });
  }
};

exports.searchNearbyHospitals = async (req, res) => {
  const { latitude, longitude, specialization } = req.query;

  try {
    // Validate inputs
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    // Build query conditions
    const proximityRadius = 0.1; // Define a radius for proximity (adjust as needed)
    const whereClause = {
      latitude: {
        [Op.between]: [latitude - proximityRadius, latitude + proximityRadius],
      },
      longitude: {
        [Op.between]: [longitude - proximityRadius, longitude + proximityRadius],
      },
      hasICURooms: true,
    };

    // Add specialization filter if provsided
    if (specialization) {
      whereClause.specialization = specialization; // Ensure "specialization" exists in your model
    }

    // Fetch nearby hospitals
    const hospitals = await Hospital.findAll({ where: whereClause });

    // Send response
    res.json(hospitals);
  } catch (error) {
    console.error('Error finding nearby hospitals:', error);
    res.status(500).json({ error: 'Unable to search hospitals' });
  }
};


