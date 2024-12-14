// models/Patient.js
module.exports = (sequelize, DataTypes) => {
const Patient = sequelize.define('Patient', {
  patientID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.JSONB,  // Store as a JSON object (latitude and longitude)
    allowNull: false,
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'patient',
  timestamps: true,
});

return Patient;
};
