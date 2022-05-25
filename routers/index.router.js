const express = require('express')
const { signup } = require("../controller/register");
const { login } = require("../controller/login");
const { googleAuthComplete } = require('../controller/googleLogin')

var indexRouter = express.Router();

indexRouter.post('/register_user', signup);
indexRouter.post('/login_user',login );
indexRouter.get('/login_complete',googleAuthComplete)

module.exports = indexRouter 