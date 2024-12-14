const Admin = require('../models/User');
const Hospital = require('../models/Hospital');
const { generateToken } = require('../utils/jwt'); // Import generateToken
const bcrypt = require('bcrypt');

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email, role: 'admin' } });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate JWT token for the admin
    const token = generateToken(admin); // Using the generateToken function
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to log in' });
  }
};

// Super Admin: Register Admin to a Specific Hospital
exports.registerAdmin = async (req, res) => {
  const { name, email, password, hospitalId } = req.body;

  // Validate the provided information
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, Email, and Password are required' });
  }

  // Check if the hospital exists (You can modify this depending on your DB structure)
  const hospital = await Hospital.findByPk(hospitalId); 
  if (!hospital) {
    return res.status(400).json({ message: 'Hospital not found' });
  }

  // Check if email already exists for another admin
  const existingAdmin = await User.findOne({ where: { email, role: 'admin' } });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Admin with this email already exists' });
  }

  try {

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create a new admin
    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword, // You should hash the password before saving it
      role: 'admin',
      hospitalId, // Assign the admin to the correct hospital
    });

    // Generate a JWT token for the new admin
    const token = generateToken(newAdmin);

    // Return the new admin and JWT token
    return res.status(201).json({ message: 'Admin registered successfully', token, admin: newAdmin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering the admin', details: error.message });
  }
};



// Super Admin: Update Admin details (Optional)
exports.updateAdminDetails = async (req, res) => {
  const { userID  } = req.params;
  const { name, email, password } = req.body;

  try {
    const admin = await Admin.findByPk(userID , { where: { role: 'admin' } });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Update admin details (if password is provided, hash it)
    admin.name = name || admin.name;
    admin.email = email || admin.email;

    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();
    res.json({ message: 'Admin details updated successfully', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update admin details' });
  }
};

// Super Admin: Delete Admin
exports.deleteAdmin = async (req, res) => {
  const { userID  } = req.params;

  try {
    const admin = await Admin.findByPk(userID , { where: { role: 'admin' } });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    await admin.destroy();
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete admin' });
  }
};


