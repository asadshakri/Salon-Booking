const {DataTypes} = require('sequelize');
const sequelize = require('../utils/db-connection');

const StaffAvail = sequelize.define('StaffAvail', {
  
    time:{
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = StaffAvail;