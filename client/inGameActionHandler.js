class InGameActionHandler {
    constructor(board, webSocketServer) {
        this.board = board;
        this.webSocketServer = webSocketServer;

        this.fireInterval = null;
        this.fireTarget = null;
    }
    registerListeners() {
        document.addEventListener("keydown", event => {
            if (event.keyCode == 37 || event.keyCode == 81) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'x', direction: -1 } });
                this.board.movePlayer('x', -1);
            } else if (event.keyCode == 38 || event.keyCode == 90) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'y', direction: -1 } });
                this.board.movePlayer('y', -1);
            } else if (event.keyCode == 39 || event.keyCode == 68) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'x', direction: 1 } });
                this.board.movePlayer('x', 1);
            } else if (event.keyCode == 40 || event.keyCode == 83) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'y', direction: 1 } });
                this.board.movePlayer('y', 1);
            }
        });

        document.addEventListener("keyup", event => {
            if (event.keyCode == 37 || event.keyCode == 81) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'x', direction: 0 } });
                this.board.movePlayer('x', 0);
            } else if (event.keyCode == 38 || event.keyCode == 90) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'y', direction: 0 } });
                this.board.movePlayer('y', 0);
            } else if (event.keyCode == 39 || event.keyCode == 68) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'x', direction: 0 } });
                this.board.movePlayer('x', 0);
            } else if (event.keyCode == 40 || event.keyCode == 83) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'y', direction: 0 } });
                this.board.movePlayer('y', 0);
            }
        });

        const fire = () => {
            const bullet = this.board.createBullet(this.fireTarget);
            this.webSocketServer.send({ type: 'create-bullet', value: this.fireTarget });
        }

        document.addEventListener('click', event => {
            const rect = canvas.getBoundingClientRect();
            this.fireTarget = { x: event.clientX - rect.left, y: event.clientY - rect.top };
            fire();
        });
        document.addEventListener('mousemove', event => {
            const rect = canvas.getBoundingClientRect();
            this.fireTarget = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        });
        document.addEventListener('mousedown', event => {
            this.fireInterval = setInterval(fire, 300);
        });
        document.addEventListener('mouseup', event => {
            clearInterval(this.fireInterval);
        });
    }
}