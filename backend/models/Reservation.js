// models/Reservation.js
const ICURoom = require('./ICURoom');
const Patient = require('./Patient');

module.exports = (sequelize, DataTypes) => {
const Reservation = sequelize.define('Reservation', {
  reservationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Patients',
      key: 'patientID',
    },
  },
  roomID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'ICURoom',
      key: 'roomID',
    },
  },
  reservationStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
  entryTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  exitTime: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  timestamps: true,
});

Reservation.belongsTo(Patient, { foreignKey: 'patientID' });
Reservation.belongsTo(ICURoom, { foreignKey: 'roomID' });

return Reservation;
};