const fs = require('fs');
var archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const saveBackup = require('../database/repositories/backups/addBackup')
const findBackupFileById = require('../database/repositories/backups/findBackupFileById');
const getBackupsPaginated = require('../database/repositories/backups/getBackupsPaginated');
const deleteBackupById = require('../database/repositories/backups/deleteBackup')

async function createBackup(req, res) {
    const backupId = uuidv4();
    const backupPath = `${process.env.BACKUPPATH}${backupId}`;
    if (!fs.existsSync(backupPath)){
        fs.mkdirSync(backupPath);
    }
    const date = generateDate();
    const fileName = `backup_${date[0]}.zip`
    const filePath = `${backupPath}/${fileName}`
    var output = fs.createWriteStream(filePath);
    var archive = archiver('zip');
    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });
    console.log(`file created on ${filePath}`);

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory(`${process.env.WORLDPATH}`, false);
    archive.finalize().then(() => {
        saveBackup(fileName,filePath,backupPath).then(()=>{
            return res.status(200).json({ error: false, message: "Backup created successfully" });
        }).catch(() => {
            return res.status(500).json({ error: true, message: "Fail creating backup" });
        });
    }).catch(() => {
        return res.status(500).json({ error: true, message: "Fail creating backup" });
    });
}

async function downloadBackup(req, res) {
    var id = req.params.id;
    const backup = await findBackupFileById(id)
    if(backup){
        var filePath = backup.filePath;
        if(fs.existsSync(filePath)){
            console.log(`Getting file from: ${filePath}`)
            return res.download(filePath, function (err) {
                if (err) {
                    console.log(err);
                }
            }) 
        }else{
            return res.status(410).json({ error: false, message: "Backup file is currently unavailable try again later" });
        }
    }
}

async function getBackups(req, res) {
    var page = req.query.page ? req.query.page : 0;
    var limit = req.query.page ? req.query.limit : 10;
    var result = await getBackupsPaginated(page, limit);
    res.append('TotalPages', result.totalPages);
    res.append('CurrentPage', result.currentPage);
    res.append('Content-Type', 'application/json')
    return res.status(200).json({ error: false, backups: result.data, total: result.totalBackups });
}

function generateDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();  

    return [`${mm}_${dd}_${yyyy}`,today]
}

async function removeBackup(req, res) {
    var backups = req.body["backups[]"]
    var failedToDeleteSomeBackups = false;
    var backupsNotFound = false;
    if (!Array.isArray(backups)) {
        backups = [backups];
    }
    try {
        for (let i = 0; i < backups.length; i++) {
            const backupId = backups[i];
            var backup = await findBackupFileById(backupId);
            if (backup) {
                backupPath = backup.filePath;
                if (fs.existsSync(backupPath)) {
                    absolutePath = backup.path;
                    console.log(`removing backup from: ${backupPath}`);
                    fs.rm(absolutePath, { recursive: true, force: true },async err => {
                        if (err) {
                            failedToDeleteSomeBackups = true;
                        } else {
                            await deleteBackupById(backupId);
                        }
                      })
                } else {
                    backupsNotFound = true;
                }
            }
        }

        if(backupsNotFound){
            return res.status(200)
                .json({ error: false, message: "Some backups could not be removed because .Jar file not found" });
        }
        else if (failedToDeleteSomeBackups) {
            return res.status(200)
                .json({ error: false, message: "Some backups could not be removed" });
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

module.exports = {
    createBackup,
    downloadBackup,
    getBackups,
    removeBackup
};