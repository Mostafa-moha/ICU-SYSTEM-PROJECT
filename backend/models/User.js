// models/User.js
const Hospital = require('./Hospital'); 

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      userID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      role: {
        type: DataTypes.ENUM('superadmin', 'admin', 'patient'),  // Add 'patient' to roles
        allowNull: false,
        defaultValue: 'patient',  // Default to 'patient' if no role is specified
      },
      isPatient: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // If true, this user is a patient
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'users', // Explicit table name
    }
  );

  // Define Associations
  User.hasMany(Hospital, { foreignKey: 'superAdminId', as: 'hospitals' });
  User.hasMany(User, { foreignKey: 'superAdminId', as: 'admins' });
  User.hasOne(Hospital, { foreignKey: 'adminId' });
  User.hasMany(ICURoom, { foreignKey: 'adminId' });

  return User;
};
