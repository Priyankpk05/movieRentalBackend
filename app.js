const express = require("express");
const app = express();
const morgan = require('morgan');
const googleLoginRote = express.Router();
const bodyparser = require('body-parser')

app.use(morgan('tiny'));

const session = require("express-session")
const passport = require("passport")

require('./passport')(passport)
const dbconnection = require("./connection/db_connection");

app.use(express.json());
var cors = require('cors')
app.use(cors({ origin: true }));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}))


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    secret: 'SECRET' 
  }));

app.use(passport.initialize());
app.use(passport.session());

const GOOGLE_CLIENT_ID = "46238067789-di6encdblpbrp1looiln63mjdm87m2a3.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GoogleStrategy = require('passport-google-oauth20').Strategy; 

const indexRouter = require('./routers/index.router')
const user_router = require('./routers/user.router')
const admin_router = require('./routers/admin.router');
const { googleLogin }  = require('./controller/googleLogin');
const { googleAuthComplete } = require('./controller/googleLogin')

morgan.token('host', function(req, res) {
  return req.hostname;
});

app.use('/movie_rental',indexRouter)
app.use('/movie_rental/user', user_router)
app.use('/movie_rental/admin', admin_router)

// googleLoginRote.get('/login_complete', googleAuthComplete)

passport.use(
  new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
   
      return done(null, profile)
  })
);

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']

  })
);

app.get('/auth/google/callback',
 passport.authenticate('google',{failureRedirect : '/failed'}),
   googleLogin 

);

  app.get("/failed", (req, res) => {

    res.send("Failed")
  })

  passport.serializeUser((user,done) =>{
    
    done(null,user)
  })

  passport.deserializeUser((user,done) =>{

      done(null,user)
  })

app.listen(3001);
