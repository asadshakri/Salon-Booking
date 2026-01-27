const express=require("express");
const router=express.Router();
const middleware=require("../middleware/auth");
const staffController=require("../Controller/staffController");

router.get("/get",staffController.getStaffDetails);


module.exports=router;
