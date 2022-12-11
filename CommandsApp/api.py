from flask import Flask, jsonify
from scripts import startMinecraftServer, deactivateServer, status
app = Flask(__name__)

@app.route('/start')
def activate():
    try:
        if(status()):
            json = jsonify(
                message = "Server is already running",
                status = "running",
                errors = False
            )
            return json, 200
        else:
            pid = startMinecraftServer()
            json = jsonify(
                message = "Server is running successfully",
                status = "running",
                pid = pid,
                errors = False
            )
            return json, 200
    except:
        json = jsonify(
            message = "Internal Server Error Failed starting the process",
            status = "failed",
            errors = True
        )
        return json, 500
@app.route('/stop')
def deactivate():
    try:
        if(status()):
            pid = deactivateServer()
            if(type(pid) == str):
                json = jsonify(
                message = pid,
                status = "not-running",
                errors = False
                )
                return json, 200
            else:
                json = jsonify(
                    message = "Server stopped successfully",
                    status = "killed",
                    pid = pid,
                    errors = False
                )
                return json, 200
        else:
            json = jsonify(
                message = "Server is already stopped",
                status = "not-running",
                errors = False
            )
            return json, 200
    except:
        json = jsonify(
            message = "Internal Server Error Failed stopping the process",
            status = "failed",
            errors = True
        )
        return json, 500
@app.route('/status')
def serverStatus():
    json = jsonify(
        errors = False,
        running = status()
    )
    return json, 200
if __name__ == "__main__":
    app.run(host='0.0.0.0')