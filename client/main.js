import WebSocketManager from './webSocketManager.js';
import InGameActionHandler from './inGameActionHandler.js';
import SettingsManager from './settingsManager.js';
import Board from './board.js';

const canvas = document.getElementById('canvas');
const board = new Board(canvas);
const settingsManager = new SettingsManager();

async function getServerConfig() {
    const response = await fetch('/config');
    const config = await response.json();
    return config;
}

getServerConfig().then(config => {
    const webSocketServerIp = `ws://${config.webSocketServerIp}:9000`;
    const webSocketServer = new WebSocketManager(webSocketServerIp, onOpen, onReceive);

    function onOpen() {
        const actionHandler = new InGameActionHandler(board, webSocketServer);
        actionHandler.registerKeyboardListeners(settingsManager.settings.keyMapping);        
        actionHandler.registerMouseListeners();

        settingsManager.onSave = (settings) => {
            actionHandler.registerKeyboardListeners(settings.keyMapping);
            webSocketServer.send({ type: 'save-settings', value: settings });
        };

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
});
