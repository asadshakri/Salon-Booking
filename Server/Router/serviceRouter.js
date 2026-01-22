const express=require("express");
const router=express.Router();
const middleware=require("../middleware/auth");

const serviceController=require("../Controller/serviceController");

router.get("/services",serviceController.getServices);

module.exports=router;
