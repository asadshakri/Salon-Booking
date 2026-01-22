const services= require("../models/service");
const serviceAvail=require("../models/serviceAvail");


const getServices=async(req,res)=>{
    try{
        const allServices=await services.findAll({
          include: serviceAvail
        });
        res.status(200).json({services:allServices});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

module.exports={getServices};