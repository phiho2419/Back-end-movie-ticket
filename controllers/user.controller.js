const { User } = require("../models")

const createUser = (newUser) => {
    return User.create(newUser);
}

const getUserList = () => {
    return User.findAll()
}

const getUserById = (id) => {
    return User.findOne( { where: { id } })
}

const getUserByAccount = (taiKhoan) => {
    return User.findOne( { where: { taiKhoan } })
}

const updateUserById = (id, data) => {
    return User.update(data, { where: { id } })
}

const deleteUserById = (id) => {
    return User.destroy( { where: { id } })
}


module.exports = {
    createUser,
    getUserList,
    getUserById,
    updateUserById,
    deleteUserById,
    getUserByAccount
}