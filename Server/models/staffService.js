const {DataTypes}= require("sequelize");
const sequelize= require("../utils/db-connection");

const StaffService = sequelize.define("StaffService", {});

module.exports = StaffService;
