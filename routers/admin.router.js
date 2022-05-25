const express = require('express')
const admin_router = express.Router();

const {verifyToken} = require("../middleware/verifyToken");
const {uploadImage}  = require('../middleware/imageUpload')

const {
    add_movie,
    update_movie,
    delete_movie,
    show_movie,
    rented_movie_by_user,
    show_user,
    user_profile,
    edit_user,
    deleteUser,
    fetchRentedMovie,
    rentDetail,
    userRentDetail,
    addRole,
    deleteRole,
    showRoles,
    addNewMovieType,
    deleteMovieType,
    showMovieTypes,
    fileUpload
} = require('../controller/admin')

admin_router.post('/add_movie', [verifyToken,uploadImage], add_movie)
admin_router.post('/update_movie', verifyToken, update_movie)
admin_router.post('/delete_movie', verifyToken, delete_movie)
admin_router.get('/show_movie', verifyToken, show_movie)
admin_router.get('/rented_movie_by_user', verifyToken, rented_movie_by_user)
admin_router.get('/show_user', verifyToken, show_user)
admin_router.get('/user_profile', verifyToken, user_profile)
admin_router.post('/edit_user', verifyToken, edit_user)
admin_router.post('/delete_user', verifyToken, deleteUser)
admin_router.get('/fetch_movie', verifyToken, fetchRentedMovie)
admin_router.get('/movie_rent_detail', verifyToken, rentDetail)
admin_router.post('/add_new_role', verifyToken, addRole)
admin_router.post('/delete_role', verifyToken, deleteRole)
admin_router.get('/show_roles', verifyToken, showRoles)

admin_router.post('/add_new_movie_type', verifyToken, addNewMovieType)
admin_router.post('/delete_movie_type', verifyToken, deleteMovieType)
admin_router.get('/show_movie_types', verifyToken, showMovieTypes)
admin_router.post('/uploadImage',[verifyToken,uploadImage],fileUpload)

module.exports = admin_router;