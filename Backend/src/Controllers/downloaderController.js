function downloadModsToUser(req, res) {
    try {
        console.log(`Getting file from: ${process.env.ZIPPATH}${process.env.ZIPNAMEWITHEXT}`)
        res.download(`${process.env.ZIPPATH}${process.env.ZIPNAMEWITHEXT}`, function(err) {
            if(err) {
                console.log(err);
            }
        })
    } catch (err) {
        res.status(500).json({ error: true, message: "Internal Server Error" });
        console.log(err)
    }
}

module.exports = {
    downloadModsToUser
};