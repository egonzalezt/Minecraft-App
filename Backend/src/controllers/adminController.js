const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const mime = require('mime');
const deleteMod = require('../database/repositories/mods/deleteMod');
const findModFileNameById = require('../database/repositories/mods/findModFileNameById');
const getModsPaginate = require('../database/repositories/mods/getModsPaginated');
const saveMod = require('../database/repositories/mods/addMod');
const findModByFileName = require('../database/repositories/mods/findModByFileName')
const { resourceType } = require('../database/schemas/resourcesEnum');
const copyModsAndCreateZip = require('../utils/copyModsAndCreateZip')
const findModsByFileNames = require('../database/repositories/mods/findModsByFileNames')
async function createModsFile(req, res) {
    await copyModsAndCreateZip(req, res)
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

async function validateIfModExist(req, res) {
    const modFileName = req.query.name;
    const modExists = await findModByFileName(modFileName);
    if (modExists) {
        return res
            .status(200)
            .json({ error: false, message: "Mod already exists", found: true });
    }
    return res
        .status(200)
        .json({ error: false, message: "Mod not found", found: false });
}

async function validateIfModsExist(req, res) {
    const mods = req.body.mods;
    if (!Array.isArray(mods)) {
        return res.status(400).json({ error: true, message: "Mods should be an array of strings" });
    }

    // Validate each mod string
    for (const mod of mods) {
        if (typeof mod !== "string" || !mod.endsWith(".jar")) {
            return res.status(400).json({ error: true, message: "Mods should be strings ending with '.jar'" });
        }
    }

    const modExists = await findModsByFileNames(mods);
    return res
        .status(200)
        .json({ error: false, message: "Mods successfully found in the database", mods: modExists });
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
    const category = req.body.category
    const client = (req.body.client).toLowerCase() == 'true' ? true : false;
    const server = (req.body.server).toLowerCase() == 'true' ? true : false;
    const type = []
    try {
        if (client && server) {
            type.push(resourceType.Server);
            type.push(resourceType.Client);
            file.mv(process.env.MODSPATH + fileName)
        } else if (server) {
            type.push(resourceType.Server);
            file.mv(process.env.MODSPATH + fileName)
        } else {
            type.push(resourceType.Client);
            file.mv(process.env.CLIENTMODSPATH + fileName)
        }
    } catch (e) {
        console.log(e)
        return res.status(500)
            .json({ error: true, message: "Error saving the mod" });
    }

    var result = await saveMod(name, fileName, version, type, url, category);
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
                            await deleteMod(modId);
                        } else {
                            await deleteMod(modId);
                        }
                    });
                } else {
                    modsNotFound = true;
                }
            }
        }

        if (modsNotFound) {
            return res.status(200)
                .json({ error: false, message: "Some Resources are not found, It was manually removed" });
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

function editProperties(req, res) {
    const filePath = process.env.SERVERPROPERTIES;
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('server.properties file not found:', err);
            return res.status(404).json({ error: 'server.properties file not found' });
        }

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading server.properties:', err);
                return res.status(500).json({ error: 'Failed to read server.properties' });
            }
            res.send(data);
        });
    });
}

function updateProperties(req, res) {
    const filePath = process.env.SERVERPROPERTIES;
    const { properties } = req.body;

    const resultOfValidation = validateProperties(properties)
    if (resultOfValidation) {
        return res.status(400).json({ error: 'Invalid data structure' });
    }

    fs.writeFile(filePath, properties, 'utf8', (err) => {
        if (err) {
            console.error('Error saving server.properties:', err);
            return res.status(500).json({ error: 'Failed to save server.properties' });
        }

        return res.json({ message: 'Server properties updated successfully' });
    });
}

function validateProperties(properties) {
    const regex = /^\w+=(?:\w*)?$/gm;
    const lines = properties.split('\n');

    for (const line of lines) {
        if (!regex.test(line)) {
            return false;
        }
    }

    return true;
}

function getServerModsConfig(req, res) {
    const directoryPath = process.env.MODCONFIGURATION;

    const readDirectory = (dirPath) => {
        try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });

            const directoryContents = {};

            for (const entry of entries) {
                const entryPath = path.join(dirPath, entry.name);
                const relativePath = path.relative(directoryPath, entryPath);

                if (entry.isDirectory()) {
                    const subEntries = readDirectory(entryPath);
                    directoryContents[entry.name] = subEntries;
                } else if (entry.isFile()) {
                    directoryContents[entry.name] = { isFile: true, path: relativePath, name: entry.name };
                }
            }

            return directoryContents;
        } catch (err) {
            console.error('Error reading directory:', err);
            throw err;
        }
    };

    try {
        const directoryContents = readDirectory(directoryPath);
        res.status(200).json(directoryContents);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


function getModConfigFile(req, res) {
    const directoryPath = path.resolve(process.env.MODCONFIGURATION);
    const fileName = req.query.filename;

    if (!isValidFileFormat(fileName)) {
        res.status(400).json({ error: false, message: "Invalid file format" });
        return;
    }

    const filePath = path.join(directoryPath, fileName);
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        const fileMimeType = mime.getType(filePath);
        res.setHeader('Content-Type', fileMimeType);
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: true, message: "File not found" });
    }
}

function updateModProperties(req, res) {
    const { name,properties } = req.body;
    const basePath = path.resolve(process.env.MODCONFIGURATION);
    const filePath = path.join(basePath, req.body.path);

    if (!isValidFileFormat(name)) {
        res.status(400).json({ error: false, message: "Invalid file format" });
        return;
    }

    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: false, message: "File not found" });
        return;
    }

    fs.writeFile(filePath, properties, 'utf8', (err) => {
        if (err) {
            console.error(`Error saving ${name}:`, err);
            return res.status(500).json({ error: `Failed to save ${name}` });
        }

        return res.json({ message: `${name} updated successfully` });
    });
}

function isValidFileFormat(filename) {
    const allowedFormats = ['.json5','.jsonc','.json','.txt','.toml','.xml','.yml','.properties'];
    const extname = path.extname(filename);
    return allowedFormats.includes(extname);
}

module.exports = {
    createModsFile,
    getMods,
    removeMod,
    startServer,
    stopServer,
    serverStatus,
    addMods,
    validateIfModExist,
    validateIfModsExist,
    editProperties,
    updateProperties,
    getServerModsConfig,
    getModConfigFile,
    updateModProperties
};