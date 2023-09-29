const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const {resourceType} = require('./resourcesEnum')
const {categoryType} = require('./categoryEnum')
//Schemas

const modsSchema  = new Schema({
    name:{
        type:String,
        require:true
    },
    fileName:{
        type:String,
        require:true,
        unique:true
    },
    version:{
        type:String,
        require:true
    },
    url:{
        type:String
    },
    type: {
        type: [String],
        enum: resourceType
    },
    category: {
        type: String,
        enum: categoryType
    }
},{timestamps: true})

module.exports = mongoose.model("Resources", modsSchema );