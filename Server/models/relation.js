const services=require("./service");
const serviceAvail=require("./serviceAvail");
const Staff=require("./staff");
const StaffService=require("./staffService");
const StaffAvailability=require("./staffAvail");
const Appointment=require("./appointment");

services.hasMany(serviceAvail, { foreignKey: "serviceId" });
serviceAvail.belongsTo(services, { foreignKey: "serviceId" });

Staff.belongsToMany(services, { through: StaffService });
services.belongsToMany(Staff, { through: StaffService });

Staff.hasMany(StaffAvailability, {
    foreignKey: "staffId",
    as: "StaffAvails"
  });
  
  StaffAvailability.belongsTo(Staff, {
    foreignKey: "staffId"
  });

Staff.hasMany(Appointment);
Appointment.belongsTo(Staff);

services.hasMany(Appointment);
Appointment.belongsTo(services);

module.exports={services,serviceAvail,Staff,StaffService,StaffAvailability,Appointment};