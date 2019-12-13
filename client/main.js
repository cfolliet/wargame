

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
    if (event.keyCode == 37) {
        send({ type: 'move-player', value: { axis: 'x', direction: -1 } });
        board.movePlayer('x', -1);
    } else if (event.keyCode == 38) {
        send({ type: 'move-player', value: { axis: 'y', direction: -1 } });
        board.movePlayer('y', -1);
    } else if (event.keyCode == 39) {
        send({ type: 'move-player', value: { axis: 'x', direction: 1 } });
        board.movePlayer('x', 1);
    } else if (event.keyCode == 40) {
        send({ type: 'move-player', value: { axis: 'y', direction: 1 } });
        board.movePlayer('y', 1);
    }
});

document.addEventListener("keyup", event => {
    if (event.keyCode == 37) {
        send({ type: 'move-player', value: { axis: 'x', direction: 0 } });
        board.movePlayer('x', 0);
    } else if (event.keyCode == 38) {
        send({ type: 'move-player', value: { axis: 'y', direction: 0 } });
        board.movePlayer('y', 0);
    } else if (event.keyCode == 39) {
        send({ type: 'move-player', value: { axis: 'x', direction: 0 } });
        board.movePlayer('x', 0);
    } else if (event.keyCode == 40) {
        send({ type: 'move-player', value: { axis: 'y', direction: 0 } });
        board.movePlayer('y', 0);
    }
});

const address = 'ws://10.100.0.200:9000';
//const address = 'ws://' + window.location.hostname + ':9000';
var conn = new WebSocket(address);

conn.addEventListener('open', event => {
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