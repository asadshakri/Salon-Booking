const service= require("../models/service");
const serviceAvail=require("../models/serviceAvail");


const getServices=async (req, res) => {
    try {
      const services = await service.findAll()
      res.status(200).json({ services });
      }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  

module.exports={getServices};