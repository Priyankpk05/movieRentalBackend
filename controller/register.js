var express = require("express")
const {usermodel} = require('../schemas/user')
const { isUserExist } = require('../services/register.services')
var router = express.Router();

const bcrypt = require("bcrypt") 
require("dotenv").config();
///^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.
module.exports.signup = async (req,res)=>{
    try{
        const {name,email,password,role} = req.body;
        console.log("req.body",req.body);
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
         if(!(name)){
            return res.send({message:"Name is required!!"})
        }else if(!(email)){
            return res.send({message:"Email is required!!"})
        }else if(!(password)){
            return res.send({message:"Password is required!!"})
        }
        else if(!role == "admin" || !role == "user" ){
            return res.send({message:"Role is either 'admin' or 'user'"})
        }
        if(!email.match(regex)){
            return res.status(500).send({message:"Please enter email in a valid formate"})
        }
        const oldUser = await isUserExist(email)
        if (oldUser) return res.status(500).send({message: "User Already Exist"})

        encryptedPassword = await bcrypt.hash(password,10);
        const userdata = await usermodel.create({
            name,
            email,
            password : encryptedPassword,
            role
        });

        return res.status(200).send({message:"Registered Successfully",data: userdata})
    }
    catch(err){

        return res.status(500).send({status:"error", message:err.message})
    }
};
