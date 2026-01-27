
    const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const services=require("../models/service");
const serviceAvail=require("../models/serviceAvail");
const StaffAvailability=require("../models/staffAvail");
const Staff=require("../models/staff");
function generateToken(id) {
    return jwt.sign({ userId: id }, process.env.TOKEN);
  }
  const loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if(email!==process.env.ADMIN_EMAIL){
        res.status(401).json({ message: "Not authorized! Invalid admin email" });
        return;
      }
     
      bcrypt.compare(password, process.env.ADMIN_PASSWORD, (err, result) => {
        if (err) {
          throw new Error("Something went wrong");
        }
        if (result == true) {
          res
            .status(200)
            .json({
              message: "Admin login successful",
              token: generateToken(process.env.ADMIN_ID),
              email: email,
            });
          return;
        } else {
          res
            .status(401)
            .json({ message: "User not authorized! Password incorrect" });
          return;
        }
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


  const addSalonService=async(req,res)=>{
    try{
        const{serviceName,serviceDesc,serviceDuration,servicePrice}=req.body;
       /* if(req.user.id!==process.env.ADMIN_ID){
            res.status(401).json({message:"Not authorized! Admins only"});
            return;
        }*/
        const newService=await services.create({serviceName,serviceDescription:serviceDesc,serviceDuration,servicePrice});
        res.status(201).json({message: "Service added successfully",
            serviceId: newService.id});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
  }


  const setServiceAvailability = async (req, res) => {
    try {
      const { serviceId, days } = req.body;

      //day is like 'Monday', 'Tuesday' etc.
      //no time is there

      const slots= days.map(dayItem=>({
        day:dayItem,
        serviceId:serviceId
      })
      )

      await serviceAvail.bulkCreate(slots);
  
      res.status(201).json({ message: "Slots added successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


  const addStaffDetails=async(req,res)=>{

    try{
    const { name, email, phone, specialization, services, availability } = req.body;

  const staff = await Staff.create({
    name,
    email,
    phone,
    specialization
  });

  // assign services
  if (services.length) {
    await staff.setServices(services); // service IDs
  }

  // availability
  if (availability.length) {
    const slots = availability.map(a => ({
      time: a.time,
      staffId: staff.id
    }));
    await StaffAvailability.bulkCreate(slots);
  }

  res.status(201).json({ message: "Staff added", staffId: staff.id });
}
catch(err){
    res.status(500).json({ message: err.message });
}
  }


    module.exports={loginAdmin
,addSalonService,
setServiceAvailability,
addStaffDetails
    };