export default class WebSocketManager {
    constructor(serverIp, openCallback, receiveCallback) {
        this.conn = new WebSocket(serverIp);

        this.conn.addEventListener('open', event => {
            openCallback();
        });

        this.conn.addEventListener('message', event => {
            receiveCallback(event.data);
        });

    }

    send(data) {
        this.conn.send(JSON.stringify(data));
    }
}