const WebSocket = require('ws');
const Board = require('./board.js');

//x, y, w, h
const defaultMap = {
    width: 800,
    height: 600,
    // -10 - 30
    walls: [
        [290, 10, 100, 20],
        [700, 10, 120, 25],
        [50, 160, 70, 75],
        [155, 135, 90, 80],
        [300, 140, 60, 75],
        [435, 140, 125, 115],
        [565, 160, 100, 110],
        [685, 130, 120, 80],
        [175, 455, 130, 100],
        [350, 445, 110, 85],
        [480, 450, 70, 80],
        [715, 450, 135, 95],
        [140, 590, 70, 20],
        [450, 570, 115, 65],
        [690, 585, 70, 35]
    ],
    respawns : [
        [0, 0, 50, 600],
        [750, 0 ,50, 800],
        [0, 0, 800, 50],
        [0, 550 ,800, 50],
    ]
};

const board = new Board;
board.setMap(defaultMap);
board.onChange = () => {
    const data = { type: 'update-board', value: board.serialize() };
    [...clients].forEach(client => {
        client.send(data);
    });
};

const server = new WebSocket.Server({ port: 9000 });

const clients = new Set;

class Client {
    constructor(conn, clients) {
        this.clients = clients;
        this.clients.add(this);
        this.conn = conn;
        this.board = null;
        this.playerId = null;
    }
    join(board) {
        this.board = board;
        const player = this.board.createPlayer('player' + clients.size);
        this.playerId = player.id;
    }
    leave() {
        this.clients.delete(this);
        this.board.removePlayer(this.playerId);
    }
    send(data) {
        if (typeof data.value === 'object') {
            data.value.currentPlayerId = this.playerId;
            data.value.serverTimestamp = Date.now();
        }
        const msg = JSON.stringify(data);
        this.conn.send(msg);
    }
    broadcast(data) {
        [...this.clients].forEach(client => {
            if (client === this) {
                return;
            }

            client.send(data);
        });
    }
    receive(message) {
        const data = JSON.parse(message);

        if (data.type != 'ping') console.log('received', data);

        if (data.type == 'create-bullet') {
            this.board.createBullet(this.playerId, data.value);
        } else if (data.type == 'move-player') {
            this.board.movePlayer(this.playerId, data.value.axis, data.value.direction);
        } else if (data.type == 'save-settings') {
            if (data.value && data.value.name) {
                this.board.players.get(this.playerId).name = data.value.name;
            }
            this.broadcast({ type: 'update-board', value: board.serialize() });
            this.send({ type: 'update-board', value: board.serialize() });
        } else if (data.type == 'ping') {
            this.send({ type: 'pong', value: data.value });
        }
    }
}

server.on('connection', conn => {
    const client = new Client(conn, clients);

    conn.on('message', msg => client.receive(msg));
    conn.on('close', () => client.leave());

    client.join(board);
});

var httpserver = require('./httpserver.js');
httpserver.start();