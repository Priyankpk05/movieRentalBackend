const express = require("express");

const { roleModel } = require('../schemas/roles')
const { movieType } = require('../schemas/movie_types')

const { isMovieExist, addMovie, updatMovie, deleteMovie, showMovie,
  updateMovieQuantityOnReturn } = require('../services/movie.services')

const { showUsers, userData, updateUser, removeUser} = require('../services/user.services')

const { rentedMoviesByUser, deleteFetchedMovie,
  singleMovieRentDetail, userRentData } = require('../services/rentMovie.services');

  const { isUserExist } = require('../services/register.services')

  const { addNewRole, delete_role, show_roles } = require('../services/roles.services');
const { addMovieType, deleteMovieType } = require("../services/movie_type.services");

module.exports.fileUpload = async (req,res) =>{
  console.log("req.body",req.body);
  const image = req.body
  console.log("file",req.file);

}

module.exports.add_movie = async (req, res) => {

  const role = req.role;

  if (role == "Admin") {
    try {
      
      const movieData =  { moviename, movie_type, movie_release_date, movie_Qty, price } = req.body;    //add movie
      
      console.log(req.body);
      console.log("file",req.file);
      movieData.img=req.file.path
     
      var today = new Date().toISOString().split('T')[0];
  
      if (!moviename) {
        return res.
        status(500)
        .send({ message: "Movie name is required!!" });
      } else if (!movie_type) {
        return res
        .status(500)
        .send({ message: "Movie type is invalid!!" });
      } else if (!movie_release_date || movie_release_date > today)  {
        return res
          .status(500)
          .send({ message: "Movie release date is invalid!!" });
      } else if (!movie_Qty) {
        return res
          .status(500)
          .send({ message: "Movie Quantity is required!!" });
      } else if (movie_Qty < 0) {
        return res
          .status(500)
          .send({ message: "Movie Quantity should be 1 or more than 1" });
      }

      const oldMovie = await isMovieExist(moviename);
      
      if (oldMovie) {
        return res
          .status(500)
          .send({ message: "Movie already exixst in DataBase!!" });
      }
  
       await addMovie(movieData );

      return res.status(200).send({ message: "Movie Added Succesfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.mesage);
    }
  } else {
    return res.status(500).send({
      message: "You don't have enough permission to do this operation!!",
    });
  }
};

module.exports.update_movie = async (req, res) => {
  //update movie
  
  const role = req.role;
  const { _id,moviename, movie_type, movie_release_date, movie_Qty,price } = req.body;
  if (role == "Admin") {
    
    try {
   
          const result = await updatMovie( _id,moviename, movie_type, movie_release_date, movie_Qty,price )
        .then(async (err, new_movie) => {
          if (err) {
            console.log(err);
          }
          if (new_movie) {
            return res.status(200).send({ data: new_movie });
          } else {
            return res
              .status(200)
              .send({ message: "Movie update successfully" });

          }
        });
       
    } catch (err) {
      console.log(err);
      res.status(406).send(err.mesage);
    }
  } else {
    res.send("You don't have enough permission to do this operation!!");
  }
};

module.exports.delete_movie = async function (req, res) {
  //delete movie
  const role = req.role;

  if (role == "Admin") {
    try {
      const { _id,moviename, movie_type, movie_release_date, movie_Qty } = req.body;
      console.log("DELETE :",req.body);
      // new_movie_name = await movieModel
      //   .deleteOne({ moviename: moviename })
       const movie = await deleteMovie(_id,moviename, movie_type, movie_release_date, movie_Qty)
        if(movie) return res
            .status(200)
            .send({ message: "Movie is deleted successfully" });
       
    } catch (err) {
      console.log(err);
      res.send(err.mesage);
    }
  } else {
    res.send("You don't have enough permission to do this operation!!");
  }
};

module.exports.show_movie = async function (req, res) {
  const role = req.role;
  if (role == "Admin" && role == "User") {
    try {
      // pagination
      var page = req.query.page ? req.query.page : 1;
      var limit = parseInt(req.query.limit);
      var skip = page * limit - limit;

      var query = { $and: [] };
      var subQuery = { $or: [] };
      if (req.query.search) {
        subQuery["$or"].push({
          moviename: { $regex: req.query.search, $options: "i" },
        });
        subQuery["$or"].push({
          movie_type: { $regex: req.query.search, $options: "i" },
        });
        if (req.query.movie_relase_date) {
          subQuery["$or"].push({
            movie_relase_date: {
              $regex: req.query.movie_relase_date,
              $options: "i",
            },
          });
        }
      }
      if (
        typeof subQuery !== "undefined" &&
        Object.keys(subQuery).length > 0 &&
        subQuery["$or"].length > 0
      ) {
        query["$and"].push(subQuery);
      }

      //const data = await movieModel.find()
      const data = await showMovie(); TODO: 
        // .sort("-createdAt")
        // .skip(skip)
        // .limit(limit);
      //    .exec(function(err,data) {
      //      if(err){
      //        return res.send(err);
      //      }

      //     return res.send(data);
      //    });
      return res.status(200).send({ data });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  } else {
    return res.status(500).send({
      status: "error",
      message: "Only user and Admin can see the movie list",
    });
  }
};

module.exports.rented_movie_by_user = async function (req, res) {
  const role = req.role;
  if (role == "Admin") {
    try {
      
      // const allData = await usermodel.aggregate([
      //   {
      //     $lookup: {
      //       from: "movies_renteds",
      //       localField: "_id",
      //       foreignField: "user_id",
      //       as: "rents",
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "movies",
      //       localField: "rents.movie_id",
      //       foreignField: "_id",
      //       as: "data",
      //       },
      //     },
          
      //     { "$project": { 
      //       _id:1,
      //       name:1,
      //       email:1,
      //       role:1,
      //       rents:'$rents'
      //     }}
      //     // // //  "rents": {"moviename": 1,  }, ,  }
      //     // }, 
      //     // {
      //     //   "$project": { "dataX": {} }
      //     // }
      //   ]);

    //   const allData = await rent_movie_model.find({}).populate('user_id','name email role').populate('movie_id','moviename movie_type');
    //   result = allData.reduce(function (r, a) {
    //     r[a.user_id._id] = r[a.user_id._id] || [];
    //     r[a.user_id._id].push(a);
    //     return r;
    // }, Object.create(null));
    const allData = await rentedMoviesByUser();
    //   let aggregationQuery = [];
    //   aggregationQuery.push({
    //     $lookup: {
    //         from: 'movies_renteds',
    //         let: {
    //             "user_id": "$_id"
    //         },
    //         pipeline: [{
    //             $match: {
    //                 $expr: {
    //                     $and: [{
    //                         $eq: ["$user_id", "$$user_id"]
    //                     }]
    //                 }
    //             }
    //         }, {
    //             $lookup: {
    //                 from: 'movies',
    //                 let: {
    //                     "movie_id": "$movies_renteds.movie_id"
    //                 },
    //                 pipeline: [{
    //                     $match: {
    //                         $expr: {
    //                             $and: [{
    //                                 $eq: ["$movie_id", "$$movie_id"]
    //                             }]
    //                         }
    //                     }
    //                 }, {
    //                     $project: {
    //                         _id: 0,
    //                         moviename: 1,
    //                         movie_type: 1,
    //                     }
    //                 }],
    //                 as: 'movie'
    //             }
    //         }, {
    //             $unwind: {
    //                 path: '$movie',
    //                 preserveNullAndEmptyArrays: true
    //             }
    //         }, {
    //             $project: {
    //               rent_movie_Qty: 1,
    //               moviename: '$movie.moviename',
    //               movie_type: '$movie.movie_type',
    //             }
    //         }],
    //         as: 'movies_renteds'
    //     }
    // });
    // aggregationQuery.push({
    //   $project: {
    //     name:1,
    //     email:1,
    //     role:1,
    //     movies_renteds:'$movies_renteds'
    //   }
    // });  
    // const allData = await usermodel.aggregate(aggregationQuery);
     // console.log(JSON.stringify(allData));
      return res.send(allData);
      // let array = [];

      // allData.forEach(function (data) {
      //   // console.log(data.movie_Qty);
      //   // console.log(allData);
      //   let resObj = {};

      //   resObj.Name = data.user_id.name;
      //   resObj.Email = data.user_id.email;
      //   resObj.Name = data.user_id.name;
      //   resObj.Role = data.user_id.role;
      //   resObj.MovieName = data.movie_id.moviename;
      //   resObj.Movie_Type = data.movie_id.movie_type;
      //   resObj.Movie_Release_Date = data.movie_id.movie_relase_date;
      //   resObj.Movie_Rented = data.movie_Qty;

      //   array.push(resObj);
      // });

      // res.send(array);
    } catch (err) {
      res.send(err);
      console.log(err);
    }
  } else {
    res
      .status(500)
      .send({ message: "You don't have enough to perform this operation!!" });
  }
};

module.exports.show_user = async (req, res) => {
  const role = req.role;
  if (role == "Admin") {

    const allUser = await showUsers()
    if(allUser) return res.send(allUser)
    // usermodel.find({}, function (err, alldata) {
    //   if (err) {
    //     console.log(err);
    //     res.send(err);
    //   } else {
    //     res.send(alldata);
    //   }
    // });
  } else {
    return res
      .status(500)
      .send("You don't have enough permission to do this operation!!");
  }
};

module.exports.user_profile = async (req, res) => {

  
  const user = req.user;
  const role = req.role;
  if(role == "Admin" || role == "User"){

    const userProfileData = await userData(user)
    //const userData = await usermodel.findOne({"_id" : user});
    return res.status(200).send(userProfileData)
  }
};

module.exports.edit_user = async ( req, res ) =>{

  try{

    

    const { _id, name, email, password, role, coins } = req.body
    
    // const chechUserEmail = await isUserExist(email);
    
    // if(chechUserEmail == true){
    //   return res.status(500).send({ message : "User already exist with this email" })
    // }

    const editUser = await updateUser( _id, name, email, password, role, coins )
  
    if(editUser == true){
      return res.status(200).send({ message : "User Update Successfully" });
    }
  }catch(err){
    console.log("editUser",err);
  }
  

}

module.exports.deleteUser = async ( req, res ) =>{

  // const { _id, name, email, password, role, coins } = req.body
  const  _id = req.body

  try{
    const editUser = await removeUser( _id )

    if(editUser == true){
      return res.status(200).send({ message : "User Deleted Successfully" });
    }
  }catch(err){
    console.log("deleteUser :",err);
  }

}

module.exports.fetchRentedMovie = async (req, res) =>{

  const { movie_id, user_id } = req.query;
    console.log("movie_id",movie_id);
    console.log("user_id",user_id);

   try {

    const fetchMovieAndRemove = await deleteFetchedMovie( movie_id, user_id )
    const updateOnFetch = await updateMovieQuantityOnReturn(movie_id,user_id)
    if(fetchMovieAndRemove == true) return res.status(200).send({ message : "Fetch Successful" })
    
    console.log("updateOnFetch",updateOnFetch);
   } catch (error) {
     console.log("fetchRentedMovie",err);
   }
  
}

module.exports.rentDetail = async (req, res) =>{

  try{

    const movie_id = req.query.movie_id;
  
    const userDetails = await singleMovieRentDetail(movie_id);
  
  return res.status(200).send({ userData : userDetails });
  }catch(err){
    console.log("rentDetail :",err);
  }
  
}

module.exports.userRentDetail = async (req, res) =>{

  try{
    const user_id = req.query.user_id;

    const userRentedMovie = await userRentData(user_id);

    return res.status(200).send({ userData : userRentedMovie });


  }catch(err){
    console.log("userRentDetail :",err);
  }

}

module.exports.addRole = async (req,res) =>{

  try {
    const {role} = req.body;
    if (!role) {
      return res.
      status(500)
      .send({ message: "Role is required!!" });
    }
   const newRole = await addNewRole(role)

   if(newRole == true){
     return res.status(200).send({ message : "New Role Added Successfully" })
   }
   if(newRole == false){
    return res.status(500).send({ message : "Role is Already exist" })
   }
    
  } catch (error) {
    console.log("addRole",error);
  }
   

}

module.exports.deleteRole = async(req,res) =>{

  try {
    
    const role = req.query.role
    console.log(req.query.role);
    const deleteRole = await delete_role(role)

    if(deleteRole == true){
      return res.status(200).send({ message : "Role Deleted Successfully" })
    }
  } catch (error) {
    console.log("deleteRole",error);
  }
  

}

module.exports.showRoles = async (req,res) =>{

  try {
    const roles = await roleModel.find()

    return res.status(200).send({ roles})
    
  } catch (error) {
    console.log("showRoles",error);
  }
  

}

module.exports.addNewMovieType = async (req,res) =>{

  try {
    const {movie_type} = req.body;
    console.log("movie_type", movie_type);
    if (!movie_type) {
      return res.
      status(500)
      .send({ message: "Movie Type is required!!" });
    }
   const newMovieType = await addMovieType(movie_type)

   if(newMovieType == true){
     return res.status(200).send({ message : "New Movie Type Added Successfully" })
   }
   if(newMovieType == false){
    return res.status(500).send({ message : "Movie Typeis Already exist" })

   }
    
  } catch (error) {
    console.log("addNewMovieType",error);
  }
}

module.exports.deleteMovieType = async (req,res) =>{

  try {
    const movie_type = req.query.type;
    console.log(req.query.type);
   const deleteType = await deleteMovieType(movie_type)

   if(deleteType == true){
     return res.status(200).send({ message : "Delete Successfully" })
   }
    
  } catch (error) {
    console.log("deleteNewMovieType",error);
  }
}

module.exports.showMovieTypes = async (req,res) =>{

  try {
    const types = await movieType.find()

    return res.status(200).send({ allMovieTypes : types})
    
  } catch (error) {
    console.log("showRoles",error);
  }
  

}

