
const mongoose = require("mongoose");
const validator = require('validator');

const options = {
    versionKey: false,
    timestamps: {
      createdAt: true,
      updatedAt: "modifiedAt",
    },
  };

var userSchema = new mongoose.Schema({

    name :{
        type: String
    },
    email :{
        type: String,
        unique: true,
        require: true,
        validate: [validator.isEmail, 'Enter a valid email address.']
       // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        ///^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        
    },
    password :{
        type: String
    },
    google_id :{
        type: String
    },
    role:{
        type:String,
         //enum:["user","admin","employee"],
        default:"User",
        
    },
    coins:{ 
        type: Number, 
        default: 1000 
    },
}, options)

const user  = mongoose.model('users',userSchema);
module.exports.usermodel = user;