const express=require("express");
const router=express.Router();
const middleware=require("../middleware/auth");

const adminController=require("../Controller/adminController");

router.post("/login",adminController.loginAdmin);
router.post("/salon/service",middleware.authenticate,adminController.addSalonService);
router.post("/salon/serviceAvailability",middleware.authenticate,adminController.setServiceAvailability);
router.post("/post",adminController.addStaffDetails);
module.exports=router;