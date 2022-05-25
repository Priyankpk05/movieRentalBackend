const { rent_movie_model } = require("../schemas/rent_movie");

module.exports.rentedMoviesByUser = async (r) =>{

    const allData = await rent_movie_model.find({}).populate('user_id','name email role').populate('movie_id','moviename movie_type price');
      result = allData.reduce(function (r, a) {
        r[a.user_id._id] = r[a.user_id._id] || [];
        r[a.user_id._id].push(a);
        return r;
    }, Object.create(null));
    return allData;
}

module.exports.userRentedMovies = async (user) =>{

    const allData = await rent_movie_model.find({user_id : user}).populate('user_id','name email role').populate('movie_id','moviename movie_type price');
        result = allData.reduce(function (r, a) {
          r[a.user_id._id] = r[a.user_id._id] || [];
          r[a.user_id._id].push(a);
          return r;
      }, Object.create(null));

      return allData;
}

module.exports.updateRentData = async ( user, movie_id ) =>{

    try{

        const findMovieAndUser = await rent_movie_model.findOne(
            { user_id : user , movie_id : movie_id }
        )
        if(findMovieAndUser) return true ;

        
    }catch(err){
        return err;
    }

}

module.exports.createRentData = async( user, movie_id ) =>{

    try{

        const rent = await rent_movie_model.create(
            { user_id : user , movie_id : movie_id }
            // { $inc: { rent_movie_Qty : rent_movie_Qty } },
            // { upsert:true }
        );
        if( rent ) return true
    }catch(err){
        console.log("RENT ERROR :",err);
        return err;
    }
}

module.exports.deleteRentDataOnReturn = async ( movie_id, user_id ) =>{

    try{
        const removeData = await rent_movie_model.deleteOne(
            { user_id : user_id, movie_id :movie_id }
        )
       
        return true
    }catch(err){
        console.log("deleteRentDataOnReturn",err);
    } 
}

module.exports.deleteFetchedMovie = async ( movie_id, user_id ) =>{

    console.log("movie_id===",movie_id);
    console.log("user_id====",user_id);
    
    try{
        const fetch = await rent_movie_model.deleteOne(
            { user_id : user_id, movie_id :movie_id }
        )
        console.log("fetch",fetch);
        return true
    }catch(err){
        console.log("deleteFetchedMovie",err);
    }
}

module.exports.singleMovieRentDetail = async (movie_id) =>{

    try{

        const allData = await rent_movie_model.find({movie_id : movie_id}).populate('user_id','name email role').populate('movie_id','moviename movie_type price');
        result = allData.reduce(function (r, a) {
        r[a.user_id._id] = r[a.user_id._id] || [];
        r[a.user_id._id].push(a);
        return r;
        }, Object.create(null));
        

    return allData;


    }catch(err){
        console.log("singleMovieRentDetail",err);
    }
}

module.exports.userRentData = async ( user_id ) =>{

    try{

        const allData = await rent_movie_model.find({user_id : user_id}).populate('user_id','name email role').populate('movie_id','moviename movie_type price');
        result = allData.reduce(function (r, a) {
        r[a.user_id._id] = r[a.user_id._id] || [];
        r[a.user_id._id].push(a);
        return r;
        }, Object.create(null));

    return allData;

        
    }catch(err){
        console.log("userRentData :",err);
    }
}