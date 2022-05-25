
const mongoose = require("mongoose");

const options = {
    versionKey: false,
    timestamps: {
      createdAt: true,
      updatedAt: "modifiedAt",
    },
  };

var movieTypeSchema = new mongoose.Schema({

    movieType :{
        type: String}
}, options)

const movie_types  = mongoose.model('movieType',movieTypeSchema);
module.exports.movieType = movie_types;