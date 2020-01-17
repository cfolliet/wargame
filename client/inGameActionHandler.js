export default class InGameActionHandler {
    constructor(board, webSocketServer) {
        this.board = board;
        this.webSocketServer = webSocketServer;

        this.fireInterval = null;
        this.fireTarget = null;
        this.keysPressed = new Set;
    }

    registerKeyboardListeners(keyMapping) {
        const keydown = event => {
            if (this.keysPressed.has(event.code)) {
                return;
            }

            this.keysPressed.add(event.code);
            if (keyMapping['left'].code == event.code) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'x', direction: -1 } });
                this.board.movePlayer('x', -1);
            } else if (keyMapping['top'].code == event.code) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'y', direction: -1 } });
                this.board.movePlayer('y', -1);
            } else if (keyMapping['right'].code == event.code) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'x', direction: 1 } });
                this.board.movePlayer('x', 1);
            } else if (keyMapping['bottom'].code == event.code) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'y', direction: 1 } });
                this.board.movePlayer('y', 1);
            } else if (keyMapping['reload'].code == event.code) {
                this.webSocketServer.send({ type: 'reload-weapon' });
            } else if (keyMapping['nextweapon'].code == event.code) {
                const currentPlayer = this.board.currentPlayer();
                const nextWeaponIndex = (currentPlayer.currentWeaponIndex + 1) % currentPlayer.weapons.length;
                this.webSocketServer.send({ type: 'change-weapon', value: nextWeaponIndex });
            }
        }

        const keyup = event => {
            this.keysPressed.delete(event.code);
            if (keyMapping['left'].code == event.code) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'x', direction: 0 } });
                this.board.movePlayer('x', 0);
            } else if (keyMapping['top'].code == event.code) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'y', direction: 0 } });
                this.board.movePlayer('y', 0);
            } else if (keyMapping['right'].code == event.code) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'x', direction: 0 } });
                this.board.movePlayer('x', 0);
            } else if (keyMapping['bottom'].code == event.code) {
                this.webSocketServer.send({ type: 'move-player', value: { axis: 'y', direction: 0 } });
                this.board.movePlayer('y', 0);
            }
        }

        document.removeEventListener("keydown", keydown);
        document.removeEventListener("keyup", keyup);
        document.addEventListener("keydown", keydown);
        document.addEventListener("keyup", keyup);
    }

    registerMouseListeners() {
        const fire = () => {
            //const bullet = this.board.createBullet(this.fireTarget);
            this.webSocketServer.send({ type: 'fire', value: this.fireTarget });
        }

        document.addEventListener('contextmenu', event => { event.preventDefault(); });
        document.addEventListener('wheel', event => {
            event.preventDefault();
            const currentPlayer = this.board.currentPlayer();
            const tempIndex = event.deltaY > 0 ? currentPlayer.currentWeaponIndex + 1 : currentPlayer.currentWeaponIndex + currentPlayer.weapons.length - 1;
            const nextWeaponIndex = tempIndex % currentPlayer.weapons.length;
            this.webSocketServer.send({ type: 'change-weapon', value: nextWeaponIndex });
        });
        document.addEventListener('mousemove', event => {
            const camera = this.board.camera;
            this.fireTarget = { x: event.offsetX / this.board.scale + camera.left, y: event.offsetY / this.board.scale + camera.top };
        });
        document.addEventListener('mousedown', event => {
            if (event.button == 0) {
                fire();
                this.fireInterval = setInterval(fire, 50);
            } else if (event.button == 2) {
                this.webSocketServer.send({ type: 'reload-weapon' });
            }
        });
        document.addEventListener('mouseup', event => {
            clearInterval(this.fireInterval);
        });
    }
}