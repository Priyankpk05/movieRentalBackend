const mongoose = require("mongoose");

const options = {
    versionKey: false,
    timestamps: {
      createdAt: true,
      updatedAt: "modifiedAt",
    },
  };

var rent_schema = mongoose.Schema({

    user_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        require: true
    },
    movie_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "movie",
        require: true
    },
    rent_movie_Qty:{
        type : Number,
        require: true
    }

},options);
const rent_movie_model  = mongoose.model('movies_rented',rent_schema);
module.exports.rent_movie_model = rent_movie_model;