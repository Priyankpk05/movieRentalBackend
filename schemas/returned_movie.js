const mongoose = require("mongoose");

const options = {
    versionKey: false,
    timestamps: {
      createdAt: true,
      updatedAt: "modifiedAt",
    },
  };

var returned_movie_schema = mongoose.Schema({

    user_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        require: true
    },
    movie_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "movie",
        require: true
    }

},options);
const returned_movie  = mongoose.model('returned_movie',returned_movie_schema);
module.exports.returned_movie = returned_movie;