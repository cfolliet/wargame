class WebSocketManager {
    constructor(serverIp, userSettings, receiveCallback) {
        this.conn = new WebSocket(serverIp);

        this.conn.addEventListener('open', event => {
            this.send({ type: 'save-settings', value: userSettings });
            setInterval(() => {
                this.send({ type: 'ping', value: performance.now() });
            }, 500);
        });

        this.conn.addEventListener('message', event => {
            receiveCallback(event.data);
        });

    }

    send(data) {
        this.conn.send(JSON.stringify(data));
    }
}