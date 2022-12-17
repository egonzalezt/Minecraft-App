const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const {roles} = require('./userEnum')
//Schemas

const userSchema  = new Schema({
    email:{
        type:String,
        require:true,
        unique:true,
    },
    nickName:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    roles: {
        type: [String],
        enum: roles,
        default: roles.User,
    },
})

module.exports = mongoose.model("User", userSchema );