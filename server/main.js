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
    }
    join(board) {
        this.board = board;
        this.board.createPlayer('player' + clients.size);
        this.send(board);
        this.broadcast({ type: 'update-board', value: board });
    }
    leave() {
        this.clients.delete(this);
        this.broadcast({ type: 'update-board', value: board });
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
        if (data.type == 'create-bullet') {
            this.board.createBullet(data.value.player, data.value.vel);
            this.broadcast(data);
        }
    }
}

server.on('connection', conn => {
    const client = new Client(conn, clients);

    conn.on('message', msg => client.receive(msg));
    conn.on('close', () => client.leave());

    client.join(board);
});