const jwt = require("jsonwebtoken");
const config = process.env;


const verifyToken = (req,res,next) =>{
  
    const token = req.body.token || req.query.token || req.headers.authorization;
    //console.log(req.headers);

    if(!token){
        return  res.status(500).send({message:"A token is required for Authentication!!"});
    }

    try{

        const decoded = jwt.verify(token,config.TOKEN_KEY);
    
        req.user = decoded.user_id;
        req.role = decoded.user_role;
    
        //console.log(role);

    }
    catch(err){
        console.log(err);
        return res.status(500).send({message:"Please login again token is expires"});
    }
    return next();
}

module.exports.verifyToken = verifyToken;