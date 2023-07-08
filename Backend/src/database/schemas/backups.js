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
        require:false,
    },
    path:{
        type:String,
        require:false,
    },
    gdriveId:{
        type:String,
        require:false,
    }
},{timestamps: true})

module.exports = mongoose.model("Backups", backupSchema );