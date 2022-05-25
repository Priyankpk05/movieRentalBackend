const {usermodel} = require('../schemas/user')


module.exports.isUserExist = async (email) =>{
   const checkEmail =  await usermodel.findOne(email);
    if(checkEmail){
        return checkEmail;
    }
    return false
    // else{

    //     return res.status(500).send({message: "User dosen't exist"});
    // }

}
module.exports.getUserData = async (user) =>{
    const data =  await usermodel.findOne(user);
    if(data){
        return data;
    }
}