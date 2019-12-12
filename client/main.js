

const canvas = document.getElementById('canvas');
const board = new Board(canvas);
let currentPlayerId = null;

function fire() {
    const rect = canvas.getBoundingClientRect();
    const player = board.currentPlayer();
    const x = fireTarget.x - rect.left - player.pos.x;
    const y = fireTarget.y - rect.top - player.pos.y;
    const vel = new Vec(x, y);
    const bullet = board.createBullet(vel);
    send({ type: 'create-bullet', value: vel });
}

let fireInterval = null;
let fireTarget = null;
document.addEventListener('click', event => {
    fireTarget = { x: event.clientX, y: event.clientY };
    fire();
});
document.addEventListener('mousemove', event => {
    fireTarget = { x: event.clientX, y: event.clientY };
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

const address = 'ws://localhost:9000';
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