# Backend

The backend application is designed to manage minecraft mods and send to python app the commands to run the application, stop or get the current process.

## Install 

To install this application you need to install docker.

## Run 

Before running your application if you are working on linux you need to give the propertly permissions to docker to read and write the zip folder where the mods packs are going to be allocated

```bash
sudo chmod a+rwx <zipfile location>
```

The application will run on LocalHost:3000 Execute 

```bash
docker compose up
```

## How it works 

This application binds a docker volume to the minecraft mods server and creates a .zip file to download the mods
