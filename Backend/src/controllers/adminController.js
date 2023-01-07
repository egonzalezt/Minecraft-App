const fs = require('fs');
var archiver = require('archiver');
const fetch = require('node-fetch');
const deleteMod = require('../database/repositories/mods/deleteMod');
const findModFileNameById = require('../database/repositories/mods/findModFileNameById');
const getModsPaginate = require('../database/repositories/mods/getModsPaginated');
const saveMod = require('../database/repositories/mods/addMod');
const findModByFileName = require('../database/repositories/mods/findModByFileName')
const { modType } = require('../database/schemas/modEnum');

async function createModsFile(req, res) {
    const filePath = `${process.env.ZIPPATH}${process.env.ZIPNAMEWITHEXT}`;
    global.isModsFileAvailable = false;
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, async (err) => {
            if (err) {
                global.isModsFileAvailable = true;
                return res.status(500)
                    .json({ error: true, message: "Internal server error" });
            }
        });
        console.log("File deleted")
    }
    console.log("Creating file")
    var output = fs.createWriteStream(filePath);
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
    archive.directory(`${process.env.CLIENTMODSPATH}`, false);
    archive.finalize().then(() => {
        global.isModsFileAvailable = true;
        return res.status(200).json({ error: false, message: "Mods Compressed successfully" });
    }).catch(() => {
        return res.status(500).json({ error: true, message: "Fail compressing mods" });
    });
}

async function getMods(req, res) {
    var page = req.query.page ? req.query.page : 0;
    var limit = req.query.page ? req.query.limit : 10;
    var result = await getModsPaginate(page, limit);
    res.append('TotalPages', result.totalPages);
    res.append('CurrentPage', result.currentPage);
    res.append('Content-Type', 'application/json')
    return res.status(200).json({ error: false, mods: result.data, total: result.totalMods });
}

async function addMods(req, res) {
    const modExists = await findModByFileName(req.body.fileName);
    if (modExists) {
        return res
            .status(400)
            .json({ error: true, message: "Mod already exists" });
    }
    if (!req.files) {
        return res.status(400)
            .json({ error: true, message: "No file uploaded" });
    }
    const name = req.body.name;
    const fileName = req.body.fileName;
    const version = req.body.version;
    const file = req.files.file;
    const url = req.body.url;
    const client = (req.body.client).toLowerCase() == 'true' ? true : false;
    const server = (req.body.server).toLowerCase() == 'true' ? true : false;
    const type = []

    if (client && server) {
        type.push(modType.Server);
        type.push(modType.Client);
        file.mv(process.env.MODSPATH + fileName)
    } else if (server) {
        type.push(modType.Server);
        file.mv(process.env.MODSPATH + fileName)
    } else {
        type.push(modType.Client);
        file.mv(process.env.CLIENTMODSPATH + fileName)
    }
    var result = await saveMod(name, fileName, version, type, url);
    if (result) {
        return res.status(200)
            .json({ error: false, message: "Mod saved successfully" });
    } else {
        return res.status(500)
            .json({ error: true, message: "Something happens saving the mod" });
    }
}

async function removeMod(req, res) {
    var mods = req.body["mods[]"]
    var failedToDeleteSomeMods = false;
    var modsNotFound = false;
    if (!Array.isArray(mods)) {
        mods = [mods];
    }
    try {
        for (let i = 0; i < mods.length; i++) {
            const modId = mods[i];
            var mod = await findModFileNameById(modId);
            if (mod) {
                let modPath = ""
                if (mod.type.find(data => data === 'server')) {
                    modPath = process.env.MODSPATH
                } else {
                    modPath = process.env.CLIENTMODSPATH
                }
                const modFullPath = modPath + mod.fileName
                if (fs.existsSync(modFullPath)) {
                    fs.unlink(modFullPath, async (err) => {
                        if (err) {
                            failedToDeleteSomeMods = true;
                        } else {
                            await deleteMod(modId);
                        }
                    });
                } else {
                    modsNotFound = true;
                }
            }
        }

        if(modsNotFound){
            return res.status(200)
                .json({ error: false, message: "Some mods could not be removed because .Jar file not found" });
        }
        else if (failedToDeleteSomeMods) {
            return res.status(200)
                .json({ error: false, message: "Some mods could not be removed" });
        } else {
            return res.status(200)
                .json({ error: false, message: "Mod deleted successfully" });
        }
    }
    catch {
        return res.status(500)
            .json({ error: true, message: "Internal server error" });
    }
}

function startServer(req, res) {
    fetch("http://192.168.3.47:5000/start")
        .then(response => response.json())
        .then(data => {
            return res.status(200).json(data);
        })
        .catch(function (err) {
            return res.status(408)
                .json({ error: true, message: "Server is not responding" });
        });
}

function stopServer(req, res) {
    fetch("http://192.168.3.47:5000/stop")
        .then(response => response.json())
        .then(data => {
            return res.status(200).json(data);
        })
        .catch(function (err) {
            return res.status(408)
                .json({ error: true, message: "Server is not responding" });
        });
}

function serverStatus(req, res) {
    fetch("http://192.168.3.47:5000/status")
        .then(response => response.json())
        .then(data => {
            return res.status(200).json(data);
        })
        .catch(function (err) {
            return res.status(408)
                .json({ error: true, message: "Server is not responding" });
        });
}

module.exports = {
    createModsFile,
    getMods,
    removeMod,
    startServer,
    stopServer,
    serverStatus,
    addMods
};