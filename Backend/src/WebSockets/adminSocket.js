const copyModsAndCreateZipSocket = require('../utils/copyModsAndCreateZipSocket')

async function createModsFile(io) {
    await copyModsAndCreateZipSocket(io)
}

module.exports = {
    createModsFile
};