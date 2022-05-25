const { usermodel } = require("../schemas/user");
const bcrypt = require("bcrypt") 


module.exports.isUserExist = async (email) =>{

    const checkEmail =  await usermodel.findOne(email);
     if(checkEmail != 0){
         return true;
     }
     return false
 
 }

module.exports.showUsers = async () =>{
    const allUserData =  await usermodel.find({});
    if(allUserData) return allUserData;

}

module.exports.userData = async (user)=>{

    const userProfileData = await usermodel.findOne({"_id" : user});
    return userProfileData;
}

module.exports.updateCoins = async (user_id,price) =>{

     const coins = await usermodel.findOneAndUpdate(
        { "_id" : user_id},
        { $inc : { coins : -price }}
        
     )
    console.log("updateCoins",coins.coins);
     return coins.coins;
}

module.exports.updateCoinsOnReturn = async (createdAt, todayDate, price, user_id) =>{

    try {

    const date1 = new Date(createdAt);
    const date2 = new Date(todayDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const totalDays = diffDays - 1
    const deduct = totalDays * parseInt(price)

    const coins = await usermodel.findOneAndUpdate(
        { "_id" : user_id},
        { $inc : { coins : -deduct }}
        
    )
    if(coins) return true 
    } catch (error) {
        console.log("updateCoinsOnReturn",error);
    }
    
}

module.exports.checkUserCoin = async (user_id, price) =>{

    const userCoin = await usermodel.findOne({ _id: user_id })
    if( !userCoin.coins >= price ) return false;
}

module.exports.updateUser = async ( _id, name, email, password, role, coins ) =>{

encryptedPassword = await bcrypt.hash(password,10);
    try{

        const user = await usermodel.findOneAndUpdate(
            { "_id" : _id},
            { "$set" : {
                "name" : name,
                "email": email,
                "password" : encryptedPassword,
                "role" : role,
                "coins" : coins
            }}
        )
        return true
        console.log("user",user);
    }catch(err){
        console.log("updateUser : ",err);
    }
    
}

module.exports.removeUser = async ( _id ) =>{

   
    try{
       
        const user = await usermodel.findOneAndDelete(
            { "_id" : _id},
            // { "$set" : {
            //     "name" : name,
            //     "email": email,
            //     "password" : password,
            //     "role" : role,
            //     "coins": coins
            // }}
        )
        return true
    }catch(err){
        console.log("deleteUser :",err);
    }

}

module.exports.updateUserProfile = async ( _id, name, email, coins )=>{

    // encryptedPassword = await bcrypt.hash(password,10);
    try{

        const user = await usermodel.findOneAndUpdate(
            { "_id" : _id},
            { "$set" : {
                "name" : name,
                "email": email,
                "coins" : coins
            }}
        )
        return true
    }catch(err){
        console.log("updateUserProfile : ",err);
    }

}

 // module.exports.showMovies = async () =>{

//     const allMovies = await movieModel.find({})
//     if(allMovies) return allMovies;
   
// }

// module.exports.isMovieQuantity = async ( movieID, movieQty) =>{

//     const checkQuantity =  await movieModel.findOne({ _id : movieID, movieQty : movieQty })
//     if(checkQuantity.movie_Qty <= 0 || checkQuantity.movie_Qty < movieQty ){
//         return false
//     }

// }

// module.exports.updateMovieQuantity = async (movieID,rentMovieQty) =>{

//     try{
//         const updateQty = await movieModel.updateOne(
//             { _id : movieID},
//             { $inc : { movie_Qty : -rentMovieQty } },
//             { new: true }
//         );
//     }catch(err){
//         return err
//     }
// }

// module.exports.updateRentData = async ( user, movie_id, rent_movie_Qty ) =>{

//     try{
//         const updateData = await rent_movie_model.updateOne(
//             { user_id : user , movie_id : movie_id },
//             { $inc: { rent_movie_Qty : rent_movie_Qty } },
//             { upsert:true }
//         );
//         return updateData
//     }catch(err){
//         return err;
//     }

// }

// module.exports.userRentedMovies = async (user) =>{

//     const allData = await rent_movie_model.find({user_id : user}).populate('user_id','name email role').populate('movie_id','moviename movie_type');
//         result = allData.reduce(function (r, a) {
//           r[a.user_id._id] = r[a.user_id._id] || [];
//           r[a.user_id._id].push(a);
//           return r;
//       }, Object.create(null));

//       return allData;
// }

