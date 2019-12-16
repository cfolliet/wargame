const WebSocket = require('ws');
const Board = require('./board.js');

//x, y, w, h
const defaultMap = [
    [100, 50, 100, 20],
    [100, 200, 20, 100],
];

const board = new Board;
board.setMap(defaultMap);

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
        this.send({ type: 'update-board', value: this.board.serialize() });
        this.broadcast({ type: 'update-board', value: board.serialize() });
    }
    leave() {
        this.clients.delete(this);
        this.board.removePlayer(this.playerId);
        this.broadcast({ type: 'update-board', value: board.serialize() });
    }
    send(data) {
        if (typeof data.value === 'object') {
            data.value.currentPlayerId = this.playerId;
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
            this.broadcast({ type: 'update-board', value: board.serialize() });
            this.send({ type: 'update-board', value: board.serialize() });
        } else if (data.type == 'move-player') {
            this.board.movePlayer(this.playerId, data.value.axis, data.value.direction);
            this.broadcast({ type: 'update-board', value: board.serialize() });
            this.send({ type: 'update-board', value: board.serialize() });
        } else if (data.type == 'save-settings') {
            if (data.value.name) {
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