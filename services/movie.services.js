const { movieModel } = require("../schemas/movie");
const { usermodel } = require("../schemas/user");
const moment = require("moment")

const imageUpload = require('../middleware/imageUpload')

module.exports.isMovieExist = async (movieName) =>{
    
    const oldMovie = await movieModel.findOne({moviename : movieName});
    
    if(oldMovie){
        return true;
    }
}

module.exports.showMovies = async () =>{

    const allMovies = await movieModel.find({})
    if(allMovies) return allMovies;
   
}

module.exports.isMovieQuantity = async ( movieID ) =>{
    
    const checkQuantity =  await movieModel.find({ _id : movieID })
    console.log("checkQuantity",checkQuantity);
    if(checkQuantity.movie_Qty == 0 ){
        return false
    }

}

module.exports.updateMovieQuantity = async ( movieID ) =>{

    try{
        const updateQty = await movieModel.updateOne(
            { _id : movieID},
            { $inc : { movie_Qty : -1 } },
            { new: true }
        );
    }catch(err){
        return err
    }
}

module.exports.addMovie = async ( movieData ) =>{
    try{
        const add = await movieModel.create(movieData)
    
    if(add){
        return true;
    }

    }catch(err){
        console.log("addMovie",err);
    }
    
}

module.exports.updatMovie = async (_id,moviename, movie_type, movie_release_date, movie_Qty,price) =>{

    try{
        const update = await movieModel
    .findOneAndUpdate({"_id" : _id },
    { "$set": { "moviename": moviename , 
                "movie_type" : movie_type, 
                "movie_release_date" : movie_release_date , 
                "movie_Qty" : movie_Qty,
                "price": price
            }
        }      )
    if(update){
        return true;
    }

    }catch(err){
        console.log("updatMovie",err);
    }
    
}

module.exports.deleteMovie = async (_id,moviename, movie_type, movie_release_date, movie_Qty,price) =>{
    try{
        const deleteMovie = await movieModel
        .findOneAndUpdate({"_id" : _id,},
        { "$set": { "movie_Qty" : 0,
                    // "moviename": moviename , 
                    // "movie_type" : movie_type, 
                    // "movie_release_date" : movie_release_date , 
                    // "price": price
                }
            }      )
        if(deleteMovie){
            return true;
        }
    }catch(err){
        console.log("deleteMovie",err);
    }
    //const deleteMovie = await movieModel.deleteOne({ moviename: movieName })
    
}

module.exports.updateMovieQuantityOnReturn = async ( movie_id, user_id ) =>{

    try{

        const returnedMovie = await movieModel.updateOne(
            { "_id" : movie_id },
            { $inc : { movie_Qty : +1 }},
        )
        return true

    }catch(err){
        console.log("returnedMovie",err);
    }
 }


 module.exports.filterMovieWithTwoDate = async (search,startDate, endDate,page,limit,skip) =>{

    try {
        if(startDate == "" || "undefined" && endDate == "" || "undefined"){
            if(search != ""){
                const result = await movieModel.find({moviename: {"$regex": search}})
                .sort({ _id: 1})
                .skip(skip)
                .limit(limit)
                .exec();
            }else{
                const result = await movieModel.find()
            }
        }
        const filteredData = await movieModel.find({ 
            movie_release_date: {
                  $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
                  $lt: new Date(new Date(endDate).setHours(23, 59, 59))
                   },moviename: { $regex:search, $options: "i" },
            }).sort({ _id: 1 })
            .limit(limit)
            .skip(skip)
            .exec();
          
            console.log("filteredData",filteredData);
        return filteredData
    } catch (error) {
        
        console.log("filterMovieWithTwoDate",error);
    }
    
 }

// module.exports.showMovie = async () =>{

//     const allMovie = await movieModel.find();
//     return alldata;

// }

// module.exports.rentedMoviesByUser = async (r) =>{

//     const allData = await rent_movie_model.find({}).populate('user_id','name email role').populate('movie_id','moviename movie_type');
//       result = allData.reduce(function (r, a) {
//         r[a.user_id._id] = r[a.user_id._id] || [];
//         r[a.user_id._id].push(a);
//         return r;
//     }, Object.create(null));
//     return allData;
// }

// module.exports.showUsers = async () =>{
//     const allUserData =  await usermodel.find({});
//     console.log("DATA", allUserData);
//     if(allUserData) return allUserData;

// }

// module.exports.userData = async (user)=>{

//     const userProfileData = await usermodel.findOne({"_id" : user});
//     return userProfileData;
// }
