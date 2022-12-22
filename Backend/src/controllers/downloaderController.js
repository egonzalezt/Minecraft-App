function downloadModsToUser(req, res) {
    console.log(`Getting file from: ${process.env.ZIPPATH}${process.env.ZIPNAMEWITHEXT}`)
    return res.download(`${process.env.ZIPPATH}${process.env.ZIPNAMEWITHEXT}`, function (err) {
        if (err) {
            console.log(err);
        }
    })
}

module.exports = {
    downloadModsToUser
};