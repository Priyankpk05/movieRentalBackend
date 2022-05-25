const { returned_movie } = require('../schemas/returned_movie')


module.exports.userReturnedMovies = async ( user_id ) =>{

    try{

        const allData = await returned_movie.find({user_id : user_id}).populate('user_id','name email role').populate('movie_id','moviename movie_type price');
        result = allData.reduce(function (r, a) {
        r[a.user_id._id] = r[a.user_id._id] || [];
        r[a.user_id._id].push(a);
        return r;
        }, Object.create(null));
        
    return allData;

        
    }catch(err){
        console.log("userReturnedMovies :",err);
    }
}

module.exports.createHistory = async ( movie_id, user_id ) =>{

    try {

        const storeData = await returned_movie.create({
            user_id: user_id,
            movie_id: movie_id
        })
        if(storeData){
            return true
        }
        
    } catch (error) {
        console.log("createHistory",error);
    }
   
}