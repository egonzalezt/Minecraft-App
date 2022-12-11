const file_system = require('fs');
var archiver = require('archiver');
const fetch = require('node-fetch');

function createModsFile(req, res) {
    try {
        var output = file_system.createWriteStream(`${process.env.ZIPPATH}${process.env.ZIPNAMEWITHEXT}`);
        var archive = archiver('zip');
        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });
        console.log(`file created on ${process.env.ZIPPATH}${process.env.ZIPNAMEWITHEXT}`);

        archive.on('error', function (err) {
            throw err;
        });

        archive.pipe(output);

        // append files from a sub-directory, putting its contents at the root of archive
        archive.directory(`${process.env.MODSPATH}`, false);
        archive.finalize().then(result => {
            res.status(200).json({ error: false, message: "Mods Compressed successfully" });
        });
    } catch (err) {
        res.status(500).json({ error: true, message: "Internal Server Error" });
        console.log(err)
    }
}


function getMods(req, res) {
    file_system.readdir(process.env.MODSPATH, function (err, files) {
        //handling error
        if (err) {
            res.status(500).json({ error: true, message: "Internal Server Error" });
        } 
        res.status(200).json({ error: false, message: "Mods obtained successfully", mods: files});
    });
}

function getMods(req, res) {
    file_system.readdir(process.env.MODSPATH, function (err, files) {
        //handling error
        if (err) {
            res.status(500).json({ error: true, message: "Internal Server Error" });
        } 
        res.status(200).json({ error: false, message: "Mods obtained successfully", mods: files});
    });
}

function deleteMod(req, res){
    var fileName = req.params.name;
    if(file_system.existsSync(process.env.MODSPATH + fileName))
    {
        file_system.unlink(process.env.MODSPATH + fileName, (err) => {
            if (err) {
                res.status(500).json({ error: true, message: "Internal server error"});
            }
        
            res.status(200).json({ error: false, message: "Mod deleted successfully"});
        });
    }else{
        res.status(404).json({ error: false, message: "Mod not found, please check the mod spell", mods: files});

    }
}

function startServer(req, res){
    fetch("http://192.168.3.47:5000/start")
    .then(response=>response.json())
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(function (err) {
        res.status(408).json({ error: true, message: "Server is not responding"});
    });
}

function stopServer(req, res){
    fetch("http://192.168.3.47:5000/stop")
    .then(response=>response.json())
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(function (err) {
        res.status(408).json({ error: true, message: "Server is not responding"});
    });
}

function serverStatus(req, res){
    fetch("http://192.168.3.47:5000/status")
    .then(response=>response.json())
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(function (err) {
        res.status(408).json({ error: true, message: "Server is not responding"});
    });
}

module.exports = {
    createModsFile,
    getMods,
    deleteMod,
    startServer,
    stopServer,
    serverStatus
};