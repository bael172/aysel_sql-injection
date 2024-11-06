const sequelize = require("./index")
const {DataTypes, Op} = require("sequelize")

const User = sequelize.define("user",{
    login:{type:DataTypes.STRING, primaryKey:true},
    password:{type:DataTypes.STRING},
    secret:{type:DataTypes.INTEGER}
})

module.exports = {User}