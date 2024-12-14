const { Hospital } = require('../models/Hospital');
const bcrypt = require('bcrypt');
const {User} = require('../models/User');


// Super Admin: Add Hospital and optionally add Admin
exports.addHospitalAndAdmin = async (req, res) => {
  const { name, street, city, country, latitude, longitude, contactNumber, adminData } = req.body;
  // Validate missing data
  if (!name || !street || !city || !country || !latitude || !longitude || !contactNumber) {
    return res.status(400).json({ error: 'Missing required fields for hospital' });
  }

  try {
    // Create the hospital first
    const hospital = await Hospital.create({
      name,
      street,
      city,
      country,
      latitude,
      longitude,
      contactNumber,
    });

    // If admin data is provided, register an admin for this hospital
    if (adminData) {
      if (!adminData.username || !adminData.password || !adminData.email) {
        return res.status(400).json({ error: 'Missing admin username or password or email' });
      }
      
      const hashedPassword = await bcrypt.hash(adminData.password, 10);  // Hash the password before saving
      const admin = await User.create({ 
        name: adminData.username,
        email: adminData.email,
        password: hashedPassword,
        role: 'admin',
        hospitalId: hospital.id,
      });

      return res.status(201).json({ 
        message: 'Hospital added successfully with admin', 
        hospital, 
        admin
      });
    }

    res.status(201).json({ message: 'Hospital added successfully', hospital });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to add hospital' });
  }
};


// SUPER ADMIN: Update Hospital
exports.updateHospital = async (req, res) => {
  const { hospitalID } = req.params;
  const { name, street, city, country, latitude, longitude, contactNumber } = req.body;

  try {
    const hospital = await Hospital.findByPk(hospitalID);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    hospital.name = name;
    hospital.street = street;
    hospital.city = city;
    hospital.country = country;
    hospital.latitude = latitude;
    hospital.longitude = longitude;
    hospital.contactNumber = contactNumber;

    await hospital.save();
    res.json({ message: 'Hospital updated successfully', hospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update hospital' });
  }
};

// Super Admin: Delete Hospital
exports.deleteHospital = async (req, res) => {
  const { hospitalID } = req.params;

  try {
    const hospital = await Hospital.findByPk(hospitalID);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    await hospital.destroy();
    res.status(204).send();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete hospital' });
  }
};

// SUPER ADMIN: List All Hospitals
exports.listAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.findAll();
    res.json(hospitals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch hospitals' });
  }
};


// Get hospital details
exports.getHospitalDetails = async (req, res) => {
  const { hospitalID } = req.params;
  try {
    const hospital = await Hospital.findByPk(hospitalID);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch hospital details' });
  }
};