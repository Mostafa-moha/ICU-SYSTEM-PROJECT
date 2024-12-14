// utils/db.js
const { Sequelize } = require('sequelize');


const dotenv = require('dotenv');
dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

// Validate environment variables
if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_NAME || !DB_PORT) {
  console.error('Missing database configuration in environment variables');
  process.exit(1); // Exit the app if DB config is missing
}

// Initialize Sequelize with connection pooling
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false, // Disable SQL logging in the console
  pool: {
    max: 5, // max number of connections
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});



// Import Models
const User = require('../models/User')(sequelize, Sequelize.DataTypes); // Pass sequelize instance
const Hospital = require('../models/Hospital')(sequelize, Sequelize.DataTypes); // Pass sequelize instance
const ICURoom = require('../models/ICURoom')(sequelize, Sequelize.DataTypes); // Pass sequelize instance
const Patient = require('../models/Patient')(sequelize, Sequelize.DataTypes); // Pass sequelize instance
const Reservation = require('../models/Reservation')(sequelize, Sequelize.DataTypes); // Pass sequelize instance




// Associations
// SuperAdmin ↔ Hospital (One SuperAdmin can manage many Hospitals)
User.hasMany(Hospital, { foreignKey: 'superAdminId', as: 'hospitals' });
Hospital.belongsTo(User, { foreignKey: 'superAdminId' }); // Hospital has one SuperAdmin

// SuperAdmin ↔ Admin (One SuperAdmin can manage many Admins)
User.hasMany(User, { foreignKey: 'superAdminId', as: 'admins' }); // SuperAdmin has many Admins
User.belongsTo(User, { foreignKey: 'superAdminId', as: 'superAdmin' }); // Admin belongs to SuperAdmin

// Admin ↔ Hospital (One Admin manages one Hospital)
User.hasOne(Hospital, { foreignKey: 'adminId' }); // Admin has one Hospital
Hospital.belongsTo(User, { foreignKey: 'adminId' }); // Hospital belongs to Admin

// Admin ↔ ICURoom (One Admin can manage many ICURooms)
User.hasMany(ICURoom, { foreignKey: 'adminId' }); // Admin has many ICURooms
ICURoom.belongsTo(User, { foreignKey: 'adminId' }); // ICURoom belongs to Admin

// Hospital ↔ ICURoom (One Hospital can have many ICURooms)
Hospital.hasMany(ICURoom, { foreignKey: 'hospitalId' }); // Hospital has many ICURooms
ICURoom.belongsTo(Hospital, { foreignKey: 'hospitalId' }); // ICURoom belongs to Hospital

// Hospital ↔ Patient (One Hospital can have many Patients)
Hospital.hasMany(Patient, { foreignKey: 'hospitalId' }); // Hospital has many Patients
Patient.belongsTo(Hospital, { foreignKey: 'hospitalId' }); // Patient belongs to Hospital

// Patient ↔ ICURoom (One Patient can reserve many ICURooms, One ICURoom belongs to one Patient)
Patient.hasMany(ICURoom, { foreignKey: 'patientId' }); // Patient reserves many ICURooms
ICURoom.belongsTo(Patient, { foreignKey: 'patientId' }); // ICURoom is reserved by one Patient

// Patient ↔ Reservation (One Patient can reserve multiple times)
Patient.hasMany(Reservation, { foreignKey: 'patientId' }); // Patient can have many Reservations
Reservation.belongsTo(Patient, { foreignKey: 'patientId' }); // Reservation belongs to Patient

// ICURoom ↔ Reservation (One ICURoom can be reserved by one Patient)
ICURoom.hasMany(Reservation, { foreignKey: 'icuRoomId' }); // ICURoom can have many Reservations
Reservation.belongsTo(ICURoom, { foreignKey: 'icuRoomId' }); // Reservation belongs to one ICURoom



// Initialize Sequelize and check if the SuperAdmin exists
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Check if SuperAdmin exists
    const superAdmin = await User.findOne({ where: { role: 'superadmin' } });

    if (!superAdmin) {
      console.log('SuperAdmin does not exist. Creating SuperAdmin...');
      // Create SuperAdmin if it doesn't exist
      const newSuperAdmin = await User.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@domain.com',
        password: 'hashedpassword123', // Ensure this is securely hashed
        phoneNumber: '01123445634',
        role: 'superadmin',
      });
      console.log('SuperAdmin created successfully.');

      // Generate JWT for the newly created SuperAdmin
      const token = generateToken(newSuperAdmin);
      console.log('SuperAdmin JWT:', token);
    } else {
      console.log('SuperAdmin already exists.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();


// Sync Database (Create tables based on models and associations)
sequelize.sync({ force: false })  // Set to true for resetting the DB (e.g., during development)
  .then(() => console.log('Database sync complete'))
  .catch(err => console.error('Error syncing database:', err));

module.exports = sequelize;
