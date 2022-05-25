const {usermodel} = require('../schemas/user')

module.exports.isUserExist = async (email) => {
    console.log("CHECK EMAIL :",email);
    const oldUser = await usermodel.findOne({email});
        if(oldUser){
            return true
        }
    return false
}