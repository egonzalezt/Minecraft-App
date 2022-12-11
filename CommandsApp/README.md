# Commands App

This application is developed on Python using Flash, the main objective of this app is to execute bash commands to start, delete or get the current status of the Minecraft Server.

## Setup 

Install python on your machine and run 

```bash
python -m pip3 install -U -r requirements.txt
```

## Run the application

The application will run on localhost:5000

```bash
python3 app.py
```

## How It Works

This application run bash process in this case the command to execute your minecraft server this app will return the process PID and stores on a file called `process.json` this file is required for stop and get the current status of your application

## Endpoints

### /start

This will run a process in this case your command to run the minecraft server, this command returns the PID of your new process

### /stop

This will stop your application by it's PID

### /status 

This will check is your application is running or is down

