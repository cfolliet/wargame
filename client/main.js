

const canvas = document.getElementById('canvas');
const board = new Board(canvas);
const currentPlayer = board.createPlayer('player 1');
board.createPlayer('player 2');

document.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - currentPlayer.pos.x;
    const y = event.clientY - rect.top - currentPlayer.pos.y;
    const vel = new Vec(x, y);
    const bullet = board.createBullet(currentPlayer, vel);
    send({ type: 'create-bullet', value: bullet });
});

document.addEventListener("keydown", event => {
    if (event.keyCode == 37) {
        board.movePlayer(currentPlayer, 'x', -1);
    } else if (event.keyCode == 38) {
        board.movePlayer(currentPlayer, 'y', -1);
    } else if (event.keyCode == 39) {
        board.movePlayer(currentPlayer, 'x', 1);
    } else if (event.keyCode == 40) {
        board.movePlayer(currentPlayer, 'y', 1);
    }
});

document.addEventListener("keyup", event => {
    if (event.keyCode == 37) {
        board.movePlayer(currentPlayer, 'x', 0);
    } else if (event.keyCode == 38) {
        board.movePlayer(currentPlayer, 'y', 0);
    } else if (event.keyCode == 39) {
        board.movePlayer(currentPlayer, 'x', 0);
    } else if (event.keyCode == 40) {
        board.movePlayer(currentPlayer, 'y', 0);
    }
});

const address = 'ws://localhost:9000';
var conn = new WebSocket(address);
conn.addEventListener('message', event => {
    receive(event.data);
});

function receive(message) {
    const data = JSON.parse(message);
    console.log('Received message', data);
}

function send(data) {
    const msg = JSON.stringify(data);
    this.conn.send(msg);
}