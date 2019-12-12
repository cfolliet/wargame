const WebSocket = require('ws');
const Board = require('./board.js');


const board = new Board;

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
        this.send({ type: 'update-board', value: board.serialize() });
        this.send({ type: 'player-id', value: this.playerId });
        this.broadcast({ type: 'update-board', value: board.serialize() });
    }
    leave() {
        this.clients.delete(this);
        this.board.removePlayer(this.playerId);
        this.broadcast({ type: 'update-board', value: board.serialize() });
    }
    send(data) {
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
        console.log('received', data)
        if (data.type == 'create-bullet') {
            this.board.createBullet(data.value.playerId, data.value.vel);
            this.broadcast(data);
        } else if(data.type == 'move-player'){
            this.board.movePlayer(this.playerId , data.value.axis, data.value.direction);
            this.send({ type: 'update-board', value: board.serialize() });
            this.broadcast({ type: 'update-board', value: board.serialize() });
        }
    }
}

server.on('connection', conn => {
    const client = new Client(conn, clients);

    conn.on('message', msg => client.receive(msg));
    conn.on('close', () => client.leave());

    client.join(board);
});