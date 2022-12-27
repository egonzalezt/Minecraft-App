const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const {modType} = require('./modEnum')

//Schemas

const modsSchema  = new Schema({
    name:{
        type:String,
        require:true,
    },
    fileName:{
        type:String,
        require:true,
        unique:true
    },
    version:{
        type:String,
        require:true,
    },
    url:{
        type:String,
    },
    type: {
        type: [String],
        enum: modType,
    }
})

module.exports = mongoose.model("Mods", modsSchema );