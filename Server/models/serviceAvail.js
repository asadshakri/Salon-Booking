const {DataTypes}= require("sequelize");
const sequelize= require("../utils/db-connection");

const ServiceAvail = sequelize.define("ServiceAvail", {
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
      day: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    });

module.exports = ServiceAvail;