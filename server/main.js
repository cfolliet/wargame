const WebSocket = require('ws');
const Board = require('./board.js');


const board = new Board;

const server = new WebSocket.Server({ port: 9000 });

const clients = new Set;

class Client {
    constructor(conn, clients, board) {
        clients.add(this);
        this.conn = conn;
        this.board = board
    }
    send(data) {
        const msg = JSON.stringify(data);
        this.conn.send(msg);
    }
    broadcast(data){
        [...clients].forEach(client => {
            if(client === this){
                return;
            }

            client.send(data);
        });
    }
    receive(message) {
        const data = JSON.parse(message);
        if(data.type == 'create-bullet'){
            this.board.createBullet(data.value.player, data.value.vel);
            this.broadcast(data);
        }
    }
}

server.on('connection', conn => {
    const client = new Client(conn, clients, board);
    board.createPlayer('player' + clients.size);

    conn.on('message', msg => {
        client.receive(msg);
    });

    conn.on('close', () => {
        clients.delete(client);
    })

    client.send(board);
});