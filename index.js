const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PodCollectionRepository = require('./lib/PodCollectionRepository');
const ConnectionService = require('./lib/ConnectionService');

const podCollection = new PodCollectionRepository();
const connection = new ConnectionService(podCollection);

let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({width: 500, height: 150,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
    }});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'ui', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    connection.getPortList().then((res) => {
        setTimeout(() => { mainWindow.webContents.send( 'list', res ); }, 1500);
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

ipcMain.on('selected', (event, arg) => {
    connection.initialize(arg, event);
    connection.getTpodList();
});

ipcMain.on('refrash', (event) => {
    connection.getTpodList();
});

const expressApp = express();
expressApp.use(cors());
expressApp.use(bodyParser.json());
const server = expressApp.listen((process.env.PORT || 3000));

expressApp.get('/:id/:num/:port', (req, res) => {
    const manifestID = String(req.params.id);
    const num = req.params.num;
    const port = req.params.port;
    const oldPod = podCollection.getPod(manifestID, num);
    const message = `/${oldPod.manifest}-${oldPod.id}/${port}`;
    connection.send(message).then((podCollection) => {
        const pod = podCollection.getPod(manifestID, num);
        res.json(pod.port[port].data);
    });
});

expressApp.put('/:id/:num', (req, res) => {
    const manifestID = req.params.id;
    const num = req.params.num;
    const query = req.body;
    const pod = podCollection.getPod(manifestID, num);
    const message = `/${pod.manifest}-${pod.id}/${query.port} ${query.data}`;
    connection.send(message).then((podCollection) => {
        const pod = podCollection.getPod(manifestID, num);
        res.json(pod.port[query.port].data);
    });
});