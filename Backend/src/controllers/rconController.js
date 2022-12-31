const Rcon = require('rcon');

function runCommand(req, res) {
    console.log("start command processing")
    console.log(req.headers["command"])
    const command = req.headers["command"];
    if (command) {
        const host = process.env.RCONHOST
        const password = process.env.RCONPASSWORD;
        const port = process.env.RCONPORT;
        var conn = new Rcon(host, port, password);
        var response = "Se ejecuto de forma exitosa"
        var error = false;
        conn.on('auth', function () {
            console.log("Authenticated");
            console.log(`Sending command: ${command}`)
            conn.send(command);
        }).on('response', function (str) {
            if(str.length > 1){
                response = str;
            }
            conn.disconnect();
        }).on('error', function (err) {
            response = err;
            error = true;
            conn.disconnect();
        }).on('end', function () {
            console.log("Connection closed");
            if(error){
                return res.status(500).json({ error: true, message: response, command: command }); 
            }else{
                return res.status(200).json({ error: false, message: response, command: command });
            }
        });

        conn.connect();
    }
}

module.exports = {
    runCommand,
};