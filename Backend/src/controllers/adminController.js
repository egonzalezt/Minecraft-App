const file_system = require('fs');
var archiver = require('archiver');
const fetch = require('node-fetch');
const deleteMod = require('../database/repositories/mods/deleteMod');
const findModFileNameById = require('../database/repositories/mods/findModFileNameById');
const getModsPaginate = require('../database/repositories/mods/getModsPaginated');
const saveMod = require('../database/repositories/mods/addMod');
const findModByFileName = require('../database/repositories/mods/findModByFileName')
const {modType} = require('../database/schemas/modEnum')

function createModsFile(req, res) {
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
    archive.directory(`${process.env.CLIENTMODSPATH}`, false);
    archive.finalize().then(() => {
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
    var result = await saveMod(name, fileName, version, type);
    if (result) {
        return res.status(200)
            .json({ error: false, message: "Mod saved successfully" });
    } else {
        return res.status(500)
            .json({ error: true, message: "Something happens saving the mod" });
    }
}

async function removeMod(req, res) {
    var id = req.params.id;
    var mod = await findModFileNameById(id);
    let modPath = ""
    if(mod.type.find(data => data === 'server')){
        modPath = process.env.MODSPATH
    }else{
        modPath = process.env.CLIENTMODSPATH
    }
    if (file_system.existsSync(modPath + mod.fileName)) {
        await file_system.unlink(modPath + mod.fileName, async (err) => {
            if (err) {
                return res.status(500)
                    .json({ error: true, message: "Internal server error" });
            } else {
                await deleteMod(id);
                return res.status(200)
                    .json({ error: false, message: "Mod deleted successfully" });
            }
        });
    } else {
        return res.status(404).json({ error: false, message: "Mod not found, please check the mod spell"});
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