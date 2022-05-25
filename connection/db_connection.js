const mongoose = require("mongoose");

var url =
  "mongodb+srv://dbmain:asdfghjkl@cluster0.ahojo.mongodb.net/movierental?retryWrites=true&w=majority";

  var dbconnection = mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => console.log("Database Connected!!"))
  .catch((err) => console.log(err));

module.exports = dbconnection;


