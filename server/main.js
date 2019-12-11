const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 9000 });

const clients = new Set;

class Client {
}

server.on('connection', conn => {
    const client = new Client;
    clients.add(client);

    console.log(clients)
    conn.on('message', message => {
    
    });

    conn.on('close', () => {
        clients.delete(client);
    })

    conn.send('something');
});