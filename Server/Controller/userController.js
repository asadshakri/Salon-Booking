const users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Op } = require("sequelize");
const uuids = require("uuid");



const addUsers = async (req, res) => {
    try {
      const { name, email, phone, password, address } = req.body;
  
      const existingUser = await users.findOne({
        where: {
          
          [Op.or]: [{ email: email }, { phone: phone }],
        },
      });
  
      if (existingUser) {
        return res.status(409).json({ message: "User already registered" });
      }
  
      const saltrounds = 10;
      bcrypt.hash(password, saltrounds, async (err, hash) => {
        if (err) console.log(err);
  
        await users.create({ name, email, phone, password: hash, address });
        console.log("User successfully added");
        res.status(201).json({ message: "user added successfully" });
      });
    } catch (err) {
      console.log("Error in adding user");
      res.status(500).json({ message: err.message });
    }
  };
  
  function generateToken(id) {
    return jwt.sign({ userId: id }, process.env.TOKEN);
  }
  const loginUser = async (req, res) => {
    try {
      const { emailOrPhone, password } = req.body;
      const existingUser = await users.findOne({
        where: {
          [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        },
      });
      if (!existingUser) {
        res.status(404).json({ message: "User not found! Create an account" });
        return;
      }
      bcrypt.compare(password, existingUser.password, (err, result) => {
        if (err) {
          throw new Error("Something went wrong");
        }
        if (result == true) {
          res
            .status(200)
            .json({
              message: "User login successful",
              token: generateToken(existingUser.id),
              email: existingUser.email,
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

  const updateProfile=async(req,res)=>{
    try{
        const {name,email,phone,address}=req.body;
        const userId=req.user.id;
        await users.update({name,email,phone,address},{where:{id:userId}});
        res.status(200).json({message:"Profile updated successfully"});
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
  }

  const getProfile=async(req,res)=>{
    try{
        const userId=req.user.id;
        const userDetails=await users.findByPk(userId);
        res.status(200).json({name:userDetails.name,email:userDetails.email,phone:userDetails.phone,address:userDetails.address});
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
  }

  const deleteUser=async(req,res)=>{
    try{
        const userId=req.user.id;
        await users.destroy({where:{id:userId}});
        res.status(200).json({message:"User deleted successfully"});
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
  }

const changePassword=async(req,res)=>{
    try{
        const {oldPassword,newPassword}=req.body;
        const userId=req.user.id;
        const userDetails=await users.findByPk(userId);
        bcrypt.compare(oldPassword, userDetails.password, (err, result) => {
            if (err) {
              throw new Error("Something went wrong");
            }
            if (result == true) {
                const saltrounds = 10;
                bcrypt.hash(newPassword, saltrounds, async (err, hash) => {
                    if (err) console.log(err);
              
                    await users.update({password:hash},{where:{id:userId}});
                    console.log("Password successfully changed");
                    res.status(200).json({ message: "Password changed successfully" });
                  });
              
              return;
            } else {
              res
                .status(401)
                .json({ message: "Old Password incorrect" });
              return;
            }
          });
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
  }


module.exports = { addUsers,
   loginUser,
   updateProfile,
   getProfile,
   deleteUser
   ,changePassword };
  