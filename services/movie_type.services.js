const { movieType } = require('../schemas/movie_types')

module.exports.addMovieType = async (movie_type) =>{

    try {
        
        const findType = await movieType.find({ movieType : movie_type })
        if(findType.length > 1) {return false}

        const addMovieType = await movieType.create({movieType : movie_type})
        if(addMovieType) return true
    } catch (error) {
        console.log("addMovieType",error);
    }
}

module.exports.deleteMovieType = async (movie_type) =>{

    try {
        const deleteMovieType = await movieType.deleteOne ({movieType : movie_type})
        if(deleteMovieType) return true
    } catch (error) {
        console.log("deleteMovieType",error);
    }
}