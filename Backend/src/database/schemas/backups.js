const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Schemas

const backupSchema  = new Schema({
    fileName:{
        type:String,
        require:true,
    },
    filePath:{
        type:String,
        require:true,
    },
    path:{
        type:String,
        require:true,
    },
},{timestamps: true})

module.exports = mongoose.model("Backups", backupSchema );