const Player = require('./player.js');
const Bullet = require('./bullet.js');

function requestAnimationFrame(f) {
    setImmediate(() => f(Date.now()))
}

class Board {
    constructor() {
        this.width = 400;
        this.height = 400;

        this.players = [];
        this.bullets = new Set;

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
        const player = new Player(name);
        player.pos.x = this.width * Math.random();
        player.pos.y = this.height / 2 * Math.random();
        this.players.push(player);
        return player;
    }
    createBullet(player, vel) {
        const bullet = new Bullet(player, vel);
        this.bullets.add(bullet);
    }
    movePlayer(player, axis, direction) {
        player.vel[axis] = direction;
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
}

module.exports = Board;