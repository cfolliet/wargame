export default class InGameActionHandler {
    constructor(board, webSocketServer) {
        this.board = board;
        this.webSocketServer = webSocketServer;

        this.fireInterval = null;
        this.fireTarget = null;
        this.keysPressed = new Set;
    }

    registerListeners(keyMapping) {
        document.addEventListener("keydown", event => {
            if (this.keysPressed.has(event.keyCode)) {
                return;
            }

            this.keysPressed.add(event.keyCode);
            if (keyMapping['left'] == event.keyCode) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'x', direction: -1 } });
                this.board.movePlayer('x', -1);
            } else if (keyMapping['top'] == event.keyCode) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'y', direction: -1 } });
                this.board.movePlayer('y', -1);
            } else if (keyMapping['right'] == event.keyCode) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'x', direction: 1 } });
                this.board.movePlayer('x', 1);
            } else if (keyMapping['bottom'] == event.keyCode) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'y', direction: 1 } });
                this.board.movePlayer('y', 1);
            } else if (keyMapping['reload'] == event.keyCode) {
                this.webSocketServer.send({ type: 'reload-weapon' });
            } else if (keyMapping['nextweapon'] == event.keyCode) {
                const currentPlayer = this.board.currentPlayer();
                const nextWeaponIndex = (currentPlayer.currentWeaponIndex + 1) % currentPlayer.weapons.length;
                this.webSocketServer.send({ type: 'change-weapon', value: nextWeaponIndex });
            }
        });

        document.addEventListener("keyup", event => {
            this.keysPressed.delete(event.keyCode);
            if (keyMapping['left'] == event.keyCode) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'x', direction: 0 } });
                this.board.movePlayer('x', 0);
            } else if (keyMapping['top'] == event.keyCode) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'y', direction: 0 } });
                this.board.movePlayer('y', 0);
            } else if (keyMapping['right'] == event.keyCode) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'x', direction: 0 } });
                this.board.movePlayer('x', 0);
            } else if (keyMapping['bottom'] == event.keyCode) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'y', direction: 0 } });
                this.board.movePlayer('y', 0);
            }
        });

        const fire = () => {
            //const bullet = this.board.createBullet(this.fireTarget);
            this.webSocketServer.send({ type: 'fire', value: this.fireTarget });
        }

        document.addEventListener('click', event => {            
            event.preventDefault();
            const rect = canvas.getBoundingClientRect();
            this.fireTarget = { x: (event.clientX - rect.left) / this.board.scale, y: (event.clientY - rect.top) / this.board.scale };
            fire();
        });
        document.addEventListener('contextmenu', event => {
            event.preventDefault();
            this.webSocketServer.send({ type: 'reload-weapon' });
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