import WebSocketManager from './webSocketManager.js';
import InGameActionHandler from './inGameActionHandler.js';
import Board from './board.js';

const canvas = document.getElementById('canvas');
let board = null;

async function getServerConfig() {
    const response = await fetch('/config');
    const config = await response.json();
    return config;
}

function getUserSettings() {
    let settings = null;
    const stringSettings = localStorage.getItem('settings');
    if (stringSettings) {
        settings = JSON.parse(stringSettings);
    }

    return settings;
}

let webSocketServer = null;
getServerConfig().then( config => {
    const webSocketServerIp = `ws://${config.webSocketServerIp}:9000`;
    webSocketServer = new WebSocketManager(webSocketServerIp, onOpen, onReceive);
});

function onOpen() {
    board = new Board(canvas);
    webSocketServer.send({ type: 'save-settings', value: getUserSettings() });

    const actionHandler = new InGameActionHandler(board, webSocketServer);
    actionHandler.registerListeners();

    setInterval(() => {
        webSocketServer.send({ type: 'ping', value: performance.now() });
    }, 500);
}

function onReceive(message) {
    const data = JSON.parse(message);

    //if (data.type != 'pong') console.log('msg', data);

    if (data.type == 'update-board') {
        board.load(data.value);
    } else if (data.type == 'pong') {
        board.ping = performance.now() - data.value;
    }
}



const settingsToggler = document.getElementById('settings-toggler');
const settings = document.getElementById('settings');
const saveSettings = document.getElementById('save-settings');

settingsToggler.addEventListener('click', () => {
    if (settings.style.display == 'block') {
        canvas.style.display = 'block';
        settings.style.display = 'none';
    } else {
        canvas.style.display = 'none';
        settings.style.display = 'block';
    }
});

saveSettings.addEventListener('click', () => {
    const settings = {
        type: 'save-settings',
        value: {
            name: document.getElementById('name').value
        }
    }
    localStorage.setItem('settings', JSON.stringify(settings.value));
    webSocketServer.send(settings);
});
