const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');

const Switch = sequelize.define('Switch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'switch',
  timestamps: false,
});

module.exports = Switch;