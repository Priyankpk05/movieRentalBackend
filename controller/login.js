var express = require("express")
const jwt = require("jsonwebtoken");
const {usermodel} = require('../schemas/user')
var router = express.Router();
const bcrypt = require("bcrypt") 
require("dotenv").config();

const { isUserExist, getUserData } = require('../services/login.services')


module.exports.login = async (req,res)=>{

  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    try{
        const {email,password} = req.body;
        
        if(!email){

            return res.status(500).send({message:"Please Enter Email"})
        }else if(!email.match(regex)){
          return res.status(500).send({message:"Please enter email in a valid formate"})
      }
        else if(!password){

          return res.status(500).send({message:"Please Enter Password"})
      }
      
        const user = await isUserExist({email});
        
        if(!user) return res.status(500).send({message: "User dosen't exist"})
        const userData = await getUserData(user);

        if (user && (await bcrypt.compare(password, userData.password))) {
            // Create token
            
            const token = jwt.sign(
              { user_id: user._id, user_role: user.role },
              process.env.TOKEN_KEY,
              { 
                expiresIn: "1 day",
              }
            );
      
            // save user token
            user.token = token;
            res.status(200).send({message:"Sucessfuly login", _id: user._id, userdata:email, role:userData.role, token:user.token, coins: userData.coins });
          }
        else{
            res.status(500).send({message:"Invalid Credentials"});
        }
        } catch (err) {
          console.log(err);
        }
      };