const express = require("express");
const { movieModel } = require("../schemas/movie");
const { usermodel } = require("../schemas/user");
const { rent_movie_model } = require("../schemas/rent_movie");

const { showMovies, isMovieQuantity, updateMovieQuantity
,updateMovieQuantityOnReturn, filterMovieWithTwoDate } = require('../services/movie.services')

const { updateRentData, userRentedMovies, createRentData,
  deleteRentDataOnReturn } = require('../services/rentMovie.services')

const { updateCoins, checkUserCoin, updateUserProfile, updateCoinsOnReturn } = require('../services/user.services')

const { userReturnedMovies, createHistory } = require('../services/returnedMovie.services')

module.exports.show_movie = async function (req, res) {

  const role = req.role;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const search = req.query.search
  const startDate = req.query.startDate
  const endDate = req.query.endDate

  if (role == "Admin" || role == "User") {
    try {
  
      const totalMovie = await movieModel.countDocuments({});
      
    if( search != null && search.length >1 ){
      console.log("SEARCH..");
      if(  startDate != ""  && endDate != "" ){

        const data = await movieModel.find({ 
          movie_release_date: {
                $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
                 },moviename: { $regex:search, $options: "i" },
          })
          .sort({ _id: 1 })
          .limit(limit)
          .skip(skip)
          .exec();

        const count = data.length
        return res.send({ data : data, totalMovie : count }); 
      }
      else{

        const data = await movieModel.find({moviename: { $regex:search, $options: "i" }})
        .sort({ _id: 1 })
          .limit(limit)
          .skip(skip)
          .exec();

        const count = data.length
        return res.send({ data : data, totalMovie : count });
      }
    }
    else if( startDate != "" && undefined  &&  endDate != "" && undefined ){
      console.log("startDate",startDate);

      console.log("HERE 1");
      const data = await movieModel.find({ 
        movie_release_date: {
              $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
              $lt: new Date(new Date(endDate).setHours(23, 59, 59))
               },moviename: { $regex:search, $options: "i" },
        })
        .sort({ _id: 1 })
        .limit(limit)
        .skip(skip)
        .exec()

      const count = data.length
      return res.send({ data : data, totalMovie : count });

      
    }
    else if( startDate === "" || "undefined" && endDate === "" || "undefined" && search === "" || "undefined"  ){

      console.log("HERE==");
      const data = await movieModel.find()
        .sort({ _id: 1 })
        .limit(limit)
        .skip(skip)
        .exec();
      return res.send({ data : data, totalMovie : totalMovie });
    }

    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  } else {
    return res.status(500).send({
      status: "error",
    });
  }
};

module.exports.rent_movie = async function (req, res) {
  const role = req.role;
  const user = req.user;
  const price = req.query.price;
  
  if (role == "Admin" || role == "User") {

    const { movie_id, user_id } = req.body;

    try {

      const checkMovieQuantity = await isMovieQuantity( movie_id )
     
      if(checkMovieQuantity == false) return res.status(500).send({message : "Movie quantity is not available"})

      
      const availableCoin = await checkUserCoin(user_id,price)
      if(availableCoin == false) return res.status(500).send({message : "You don't have enough coins to rent this movie"})
      
      const updateData = await updateRentData( user_id, movie_id )

      if( updateData ) {
        return res
        .status(500)
        .send({ message : "You have already rented this movie" })
      }
      
      const rentData = await createRentData( user_id, movie_id )

      await updateMovieQuantity( movie_id );
      if( rentData ){

        const updateCoinData = await updateCoins(user_id,price);

        return res
        .status(200)
        .send({ message : "Rent Successful", coins : updateCoinData })
      }

      
     
      // movieModel.findOne( { rent_movie_Qty: rent_movie_Qty }, function (err, count) {

      //     if (count < 0) {
      //       return res.status(500).send({message:"Movie quantity is not available"});
      //     }
      //   }
      // );

      // movieQty = await movieModel.findOne({ _id: movie_id });

      // remaining_movie = movieQty.rent_movie_Qty - rent_movie_Qty;

      // if (remaining_movie < 0) {
      //   return res.status(500).send({ message: "Sorry movie quantity is not available" });
      // }

      

    } catch (err) {
      console.log(err);
      return res.send({ status: "error", message: "Error" });
    }
  } else { 
    return res.status(500).send({ message: "Only User and Admin rent movie" });
  }
};

module.exports.rentedMovies = async (req,res) =>{

  const user = req.user
  const role = req.role
  
  
  if(role == "User"){

    const allData = await userRentedMovies(user)

    
      return res.status(200).send(allData)
  }
};

module.exports.returnMovie = async (req, res) =>{

  
  const { movie_id, user_id, createdAt, price } = req.query;
  var todayDate = new Date().toISOString().split('T')[0];
  
  const returnMovie = await updateMovieQuantityOnReturn( movie_id, user_id )
  const saveHistory = await createHistory( movie_id, user_id )
  const removeReturnMovie = await deleteRentDataOnReturn( movie_id, user_id )
  const updateWallet = await updateCoinsOnReturn( createdAt, todayDate, price, user_id )
   
  if(returnMovie && removeReturnMovie && saveHistory && updateWallet ){
      return res.status(200).send({ message : "Return Successfull"})
    }
}

module.exports.edit_profile = async ( req, res ) =>{

  try{

    const { _id, name, email,coins} = req.body
    console.log(req.body);
    // const chechUserEmail = await isUserExist(email);
    
    // if(chechUserEmail == true){
    //   return res.status(500).send({ message : "User already exist with this email" })
    // }

    const editProfile = await updateUserProfile( _id, name, email,coins)
  
    if(editProfile == true){
      return res.status(200).send({ message : "Profile Update Successfully" });
    }
  }catch(err){
    console.log("editProfile",err);
  }
  

}

module.exports.returnedHistory = async (req, res) =>{

  const user_id = req.query.user_id;
  const returnedMovies = await userReturnedMovies(user_id )

  return res.status(200).send(returnedMovies)
}

module.exports.filterWithDate  = async (req,res) =>{

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  const search = req.query.search

  const startDate = req.body
  const sDate = startDate.startDate
  const endDate =  req.body;
  const eDate = endDate.endDate
  

  const filterMovie = await filterMovieWithTwoDate( search , sDate, eDate )

  if(filterMovie != null){
    return res.status(200).send(filterMovie);
  }

  if(filterMovie == null){
    return res.status(500).send({ message : "No Result found" });
  }
}

