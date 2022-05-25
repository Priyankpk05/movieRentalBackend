const { roleModel } = require('../schemas/roles')

module.exports.addNewRole = async (role) =>{

    try {
        const findRole = await roleModel.find({ role : role })
        if(findRole.length > 1) {return false}

        const addRole = await roleModel.create({role : role})
        if(addRole) return true
    } catch (error) {
        console.log("addNewRole",error);
    }
    
}

module.exports.delete_role = async (role) =>{

    try {
        const deleteRole = await roleModel.deleteOne({
            role : role
        })
        if(deleteRole) return true
    } catch (error) {
        console.log("delete_role",error);
    }

}

module.exports.show_roles = async (role) =>{

    try {
        const roles = await roleModel.find()
        if(roles) return true

    } catch (error) {
        console.log("show_roles",error);
    }

}