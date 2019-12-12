

const canvas = document.getElementById('canvas');
const board = new Board(canvas);
let currentPlayer = null;

document.addEventListener('click', event => {
    if (!currentPlayer) {
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - currentPlayer.pos.x;
    const y = event.clientY - rect.top - currentPlayer.pos.y;
    const vel = new Vec(x, y);
    const bullet = board.createBullet(currentPlayer, vel);
    send({ type: 'create-bullet', value: bullet });
});

document.addEventListener("keydown", event => {    
    if (event.keyCode == 37) {
        send({type: 'move-player', value: { axis: 'x', direction: -1}});
        //board.movePlayer(currentPlayer, 'x', -1);
    } else if (event.keyCode == 38) {
        send({type: 'move-player', value: { axis: 'y', direction: -1}});
        //board.movePlayer(currentPlayer, 'y', -1);
    } else if (event.keyCode == 39) {
        send({type: 'move-player', value: { axis: 'x', direction: 1}});
        //board.movePlayer(currentPlayer, 'x', 1);
    } else if (event.keyCode == 40) {
        send({type: 'move-player', value: { axis: 'y', direction: 1}});
        //board.movePlayer(currentPlayer, 'y', 1);
    }
});

document.addEventListener("keyup", event => {    
    if (event.keyCode == 37) {
        send({type: 'move-player', value: { axis: 'x', direction: 0}});
        //board.movePlayer(currentPlayer, 'x', 0);
    } else if (event.keyCode == 38) {
        send({type: 'move-player', value: { axis: 'y', direction: 0}});
        //board.movePlayer(currentPlayer, 'y', 0);
    } else if (event.keyCode == 39) {
        send({type: 'move-player', value: { axis: 'x', direction: 0}});
        //board.movePlayer(currentPlayer, 'x', 0);
    } else if (event.keyCode == 40) {
        send({type: 'move-player', value: { axis: 'y', direction: 0}});
        //board.movePlayer(currentPlayer, 'y', 0);
    }
});

const address = 'ws://localhost:9000';
var conn = new WebSocket(address);
conn.addEventListener('message', event => {
    receive(event.data);
});

function receive(message) {
    const data = JSON.parse(message);

    console.log('msg', data);
    if (data.type == 'update-board') {
        board.load(data.value);
    } else if (data.type == 'player-id') {
        currentPlayer = board.players.get(data.value);
    }
}

function send(data) {
    const msg = JSON.stringify(data);
    this.conn.send(msg);
}