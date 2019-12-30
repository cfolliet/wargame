class InGameActionHandler {
    constructor(board, webSocketServer) {
        this.board = board;
        this.webSocketServer = webSocketServer;

        this.fireInterval = null;
        this.fireTarget = null;
        this.keysPressed = new Set;
    }

    registerListeners() {
        document.addEventListener("keydown", event => {
            if (this.keysPressed.has(event.keyCode)) {
                return;
            }

            this.keysPressed.add(event.keyCode);
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
            } else if (event.keyCode == 82) {
                this.webSocketServer.send({ type: 'reload-weapon' });
            } else if (event.keyCode == 69) {
                const currentPlayer = this.board.currentPlayer();
                const nextWeaponIndex = (currentPlayer.currentWeaponIndex + 1) % currentPlayer.weapons.length;
                this.webSocketServer.send({ type: 'change-weapon', value: nextWeaponIndex });
            }
        });

        document.addEventListener("keyup", event => {
            this.keysPressed.delete(event.keyCode);
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
            //const bullet = this.board.createBullet(this.fireTarget);
            this.webSocketServer.send({ type: 'fire', value: this.fireTarget });
        }

        document.addEventListener('click', event => {
            const rect = canvas.getBoundingClientRect();
            this.fireTarget = { x: (event.clientX - rect.left) / this.board.scale, y: (event.clientY - rect.top) / this.board.scale };
            fire();
        });
        document.addEventListener('mousemove', event => {
            const rect = canvas.getBoundingClientRect();
            this.fireTarget = { x: (event.clientX - rect.left) / this.board.scale, y: (event.clientY - rect.top) / this.board.scale };
        });
        document.addEventListener('mousedown', event => {
            this.fireInterval = setInterval(fire, 50);
        });
        document.addEventListener('mouseup', event => {
            clearInterval(this.fireInterval);
        });
    }
}