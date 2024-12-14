const Hospital = require('./Hospital'); 
const Patient = require('./Patient');


module.exports = (sequelize, DataTypes) => {
const ICURoom = sequelize.define('ICURoom', {
  roomID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  hospitalID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Hospital', 
      key: 'hospitalID',
    },
  },
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  occupancyStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  patientID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Patient',
      key: 'patientID'
    }
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
 }, {
  tableName:'icuroom',
  timestamps: true,
});

ICURoom.belongsTo(Hospital, { foreignKey: 'hospitalID' });
ICURoom.belongsTo(Patient, { foreignKey: 'patientID', allowNull: true });

return ICURoom;
};
