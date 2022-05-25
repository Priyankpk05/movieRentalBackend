const mongoose = require("mongoose");

const options = {
    versionKey: false,
    timestamps: {
      createdAt: true,
      updatedAt: "modifiedAt",
    },
  };

const movieSchema = mongoose.Schema({
    moviename:{
        type: String,
        unique: true,
        require: true,
    },
    movie_type:{
        type:String,
        require: true  
    },
    movie_release_date:{
        type:Date,
        require: true
    },
    movie_Qty:{
        type:Number,
        require: true
    },
    price:{
        type:Number,
        require: true
    },
    img:{
        type:String
    }
},options);

const movie = mongoose.model('movie',movieSchema);
module.exports.movieModel = movie; 