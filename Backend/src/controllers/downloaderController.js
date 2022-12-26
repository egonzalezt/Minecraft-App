const file_system = require('fs');

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

module.exports = {
    downloadModsToUser
};