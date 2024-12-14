module.exports = (sequelize, DataTypes) => {
const Hospital = sequelize.define('Hospital', {
  hospitalID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalICURooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
 }, {
  tableName: 'hospitals',
  timestamps: true,
 });

 return Hospital;
};
