const express=require("express");
const router=express.Router();
const middleware=require("../middleware/auth");

const userController=require("../Controller/userController");

router.post("/add",userController.addUsers);
router.post("/login",userController.loginUser);
router.patch("/updateProfile",middleware.authenticate,userController.updateProfile);
router.get("/profile",middleware.authenticate,userController.getProfile);
router.delete("/deleteUser",middleware.authenticate,userController.deleteUser);
router.patch("/changePassword",middleware.authenticate,userController.changePassword);
module.exports=router;