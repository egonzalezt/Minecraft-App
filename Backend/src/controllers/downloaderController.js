const file_system = require('fs');
const findModFileNameById = require('../database/repositories/mods/findModFileNameById')

function downloadModsToUser(req, res) {
    var status = global.isModsFileAvailable;
    if(status){
        const filePath = `${process.env.ZIPPATH}${process.env.ZIPNAMEWITHEXT}`;
        if(file_system.existsSync(filePath)){
            console.log(`Getting file from: ${filePath}`)
            return res.download(filePath, function (err) {
                if (err) {
                    console.log(err);
                }
            }) 
        }else{
            return res.status(410).json({ error: false, message: "Mods file is currently unavailable try again later" });
        }
    }
    else{
        return res.status(410).json({ error: false, message: "Mods file is currently unavailable try again later" });
    }
}

async function downloadModToUser(req, res) {
    var modId = req.params.id;
    const mod = await findModFileNameById(modId)
    if(mod){
        var modType = mod.type;
        var filePath = ``;
        if(modType.includes('server')){
            filePath = `${process.env.MODSPATH}${mod.fileName}`;
        }else{
            filePath = `${process.env.CLIENTMODSPATH}${mod.fileName}`;
        }

        if(file_system.existsSync(filePath)){
            console.log(`Getting file from: ${filePath}`)
            return res.download(filePath, function (err) {
                if (err) {
                    console.log(err);
                }
            }) 
        }else{
            return res.status(410).json({ error: false, message: "Mod file is currently unavailable try again later" });
        }
    }
}

module.exports = {
    downloadModsToUser,
    downloadModToUser
};