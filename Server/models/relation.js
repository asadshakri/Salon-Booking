const service=require("./service");
const serviceAvail=require("./serviceAvail");


services.hasMany(ServiceAvailability, { foreignKey: "serviceId" });
ServiceAvailability.belongsTo(services, { foreignKey: "serviceId" });

module.exports={services,ServiceAvailability};