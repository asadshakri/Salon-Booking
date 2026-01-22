const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");


const services= sequelize.define("services", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    serviceDescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    serviceDuration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    servicePrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
    });

module.exports = services;