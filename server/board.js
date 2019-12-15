const Player = require('./player.js');
const Bullet = require('./bullet.js');
const Rect = require('./rect.js');
const Vec = require('./vec.js');

function requestAnimationFrame(f) {
    setImmediate(() => f(Date.now()))
}

function createId(len = 6, chars = 'abcdefghijklmnopqrstuvwxyz01234567890') {
    let id = '';
    while (len--) {
        id += chars[Math.random() * chars.length | 0];
    }
    return id;
}

class Board {
    constructor() {
        this.width = 300;
        this.height = 300;

        this.players = new Map;
        this.bullets = new Set;
        this.walls = [];

        let lastTime = null;
        this._frameCallback = (millis) => {
            if (lastTime !== null) {
                const diff = millis - lastTime;
                this.update(diff / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(this._frameCallback);
        };
        requestAnimationFrame(this._frameCallback);
    }
    createPlayer(name) {
        const player = new Player(createId(), name);
        player.pos.x = this.width * Math.random();
        player.pos.y = this.height / 2 * Math.random();
        this.players.set(player.id, player);
        return player;
    }
    removePlayer(playerId) {
        this.players.delete(playerId);
    }
    createBullet(playerId, vec) {
        const player = this.players.get(playerId);
        const vel = new Vec(vec.x - player.pos.x, vec.y - player.pos.y);
        const bullet = new Bullet(player, vel);
        this.bullets.add(bullet);
        return bullet;
    }
    movePlayer(playerId, axis, direction) {
        this.players.get(playerId).vel[axis] = direction;
    }
    setMap(map){
        map.forEach(w => {
            const wall = new Rect(w[2], w[3]);
            wall.pos.x = w[0];
            wall.pos.y = w[1];
            this.walls.push(wall);
        });
    }
    update(dt) {
        this.players.forEach(player => {
            player.update(dt);
            player.collide(this, dt);
        }
        );
        this.bullets.forEach(bullet => {
            bullet.update(dt);
            bullet.collide(this)
        });
    }
    serialize() {
        return { width: this.width, height: this.height, players: [...this.players.values()], bullets: [...this.bullets], walls: this.walls };
    }
}

module.exports = Board;