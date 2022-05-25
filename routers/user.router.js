const express = require('express')
const user_router = express.Router();
const {verifyToken} = require("../middleware/verifyToken");



const { show_movie, rent_movie, rentedMovies,
     returnMovie, edit_profile,returnedHistory, filterWithDate} = require('../controller/user');


user_router.get('/show_movies', verifyToken,show_movie);
user_router.post('/rent_movies',verifyToken, rent_movie);
user_router.get('/rented_movies',verifyToken,  rentedMovies);
user_router.get('/returnMovie',verifyToken,returnMovie)
user_router.post('/editProfile',verifyToken,edit_profile)
user_router.get('/returnedHistory',verifyToken,returnedHistory)
user_router.post('/filteredMovieWithDate',verifyToken,filterWithDate)





module.exports = user_router;