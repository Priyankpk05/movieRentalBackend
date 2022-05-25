
const passport = require("passport")
const { usermodel } = require('./schemas/user')
const jwt = require("jsonwebtoken");
require("dotenv").config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { restart } = require("nodemon");

const GOOGLE_CLIENT_ID = "46238067789-di6encdblpbrp1looiln63mjdm87m2a3.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

module.exports = function (passport, next) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        passReqToCallback   : true
      }, 
      async function(request, accessToken, refreshToken, profile, done) {
        console.log("URL " + request.url);
        console.log("TOKEN a ", accessToken);
        console.log("TOKEN r ", refreshToken);
        //console.log("PROFILE ", profile);
        const googleUser = {
          displayName : profile.displayName,
          email : profile.emails[0].value,
          google_id : profile.id
        }
        

        try {
          const chechkGoogleUser = await usermodel.find({google_id:googleUser.google_id});
          if(chechkGoogleUser){

            const token = await jwt.sign(
              { user_id : chechkGoogleUser._id, user_role : chechkGoogleUser.role  },
              process.env.TOKEN_KEY,
              {expiresIn: "1 day",}
            )
            console.log("Signed JWT: ", token);
            request.token = token;
            return done(request)
          }else{
//////////////
            const storeData = await usermodel.create({
              name : googleUser.displayName,
              email : googleUser.email,
              google_id : googleUser.google_id
            })
        
            const token = jwt.sign(
              { user_id : storeData._id, user_role : storeData.role  },
              process.env.TOKEN_KEY,
              {
                expiresIn: "1 day",
              }
            )
            console.log("STORED DATA",storeData);
            request.token = token;
            return done(request)
          }
        }catch(err){
          console.log("GOOGLE PASSPORT : ", err);
        }  
      }
    )
  );

  
}

