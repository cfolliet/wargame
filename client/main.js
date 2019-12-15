

const canvas = document.getElementById('canvas');
const board = new Board(canvas);
let currentPlayerId = null;

function fire() {
    const bullet = board.createBullet(fireTarget);
    send({ type: 'create-bullet', value: fireTarget });
}

let fireInterval = null;
let fireTarget = null;
document.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    fireTarget = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    fire();
});
document.addEventListener('mousemove', event => {
    const rect = canvas.getBoundingClientRect();
    fireTarget = { x: event.clientX - rect.left, y: event.clientY - rect.top };
});
document.addEventListener('mousedown', event => {
    fireInterval = setInterval(fire, 300);
});
document.addEventListener('mouseup', event => {
    clearInterval(fireInterval);
});

document.addEventListener("keydown", event => {
    if (event.keyCode == 37 || event.keyCode == 81) {
        send({ type: 'move-player', value: { axis: 'x', direction: -1 } });
        board.movePlayer('x', -1);
    } else if (event.keyCode == 38 || event.keyCode == 90) {
        send({ type: 'move-player', value: { axis: 'y', direction: -1 } });
        board.movePlayer('y', -1);
    } else if (event.keyCode == 39 || event.keyCode == 68) {
        send({ type: 'move-player', value: { axis: 'x', direction: 1 } });
        board.movePlayer('x', 1);
    } else if (event.keyCode == 40 || event.keyCode == 83) {
        send({ type: 'move-player', value: { axis: 'y', direction: 1 } });
        board.movePlayer('y', 1);
    }
});

document.addEventListener("keyup", event => {
    if (event.keyCode == 37 || event.keyCode == 81) {
        send({ type: 'move-player', value: { axis: 'x', direction: 0 } });
        board.movePlayer('x', 0);
    } else if (event.keyCode == 38 || event.keyCode == 90) {
        send({ type: 'move-player', value: { axis: 'y', direction: 0 } });
        board.movePlayer('y', 0);
    } else if (event.keyCode == 39 || event.keyCode == 68) {
        send({ type: 'move-player', value: { axis: 'x', direction: 0 } });
        board.movePlayer('x', 0);
    } else if (event.keyCode == 40 || event.keyCode == 83) {
        send({ type: 'move-player', value: { axis: 'y', direction: 0 } });
        board.movePlayer('y', 0);
    }
});

const address = 'ws://localhost:9000';
//const address = 'ws://' + window.location.hostname + ':9000';
var conn = new WebSocket(address);

conn.addEventListener('open', event => {
    loadSettings();
    setInterval(() => {
        send({ type: 'ping', value: performance.now() });
    }, 500);
});

conn.addEventListener('message', event => {
    receive(event.data);
});

function receive(message) {
    const data = JSON.parse(message);

    if (data.type != 'pong') console.log('msg', data);

    if (data.type == 'update-board') {
        board.load(data.value);
    } else if (data.type == 'pong') {
        board.ping = performance.now() - data.value;
    }
}

function send(data) {
    const msg = JSON.stringify(data);
    this.conn.send(msg);
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
    send(settings);
});

function loadSettings() {
    const stringSettings = localStorage.getItem('settings');
    if (stringSettings) {
        const settings = JSON.parse(stringSettings);
        document.getElementById('name').value = settings.name;

        send({ type: 'save-settings', value: settings });
    }
}
