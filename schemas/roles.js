
const mongoose = require("mongoose");

const options = {
    versionKey: false,
    timestamps: {
      createdAt: true,
      updatedAt: "modifiedAt",
    },
  };

var roleSchema = new mongoose.Schema({

    role :{
        type: String}
}, options)

const roles  = mongoose.model('roles',roleSchema);
module.exports.roleModel = roles;