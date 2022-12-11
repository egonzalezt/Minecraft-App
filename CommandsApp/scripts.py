from subprocess import Popen
import os
import signal
import json
import psutil
from exceptions import ServerNotRunning

def getPid():
    with open('process.json') as json_file:
        data = json.load(json_file)
        if("pid" in data):
            return data["pid"]
        else:
            raise ServerNotRunning("Server pid not found, please run the server")

def startMinecraftServer():
    cmd = "notepad.exe"
    p = Popen(cmd.split())
    dictionary = {
        "pid":p.pid
    }
    json_object = json.dumps(dictionary, indent=4)
 
    # Writing to sample.json
    with open("process.json", "w") as outfile:
        outfile.write(json_object)

    return p.pid

def deactivateServer():
    try:
        pid = getPid()
        os.kill(pid, signal.SIGILL)
        return pid
    except ServerNotRunning as error:
        return error.value

def status():
    try:
        pid = getPid()
        if psutil.pid_exists(pid):
            return True
        else:
            return False
    except ServerNotRunning as error:
        return False
   