const Player = require('./player.js');
const Bullet = require('./bullet.js');
const Rect = require('./rect.js');
const Vec = require('./vec.js');

const ROUND_DURATION = 1000 * 30;
const ROUND_RESULT_DURATION = 1000 * 10;

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
        this.walls = [];
        this.respawns = [];

        this.reset();

        this.onChange = null;

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
        do {
            const respawn = this.respawns[Math.random() * this.respawns.length | 0];
            player.pos.x = respawn.pos.x + (Math.random() * respawn.size.x | 0);
            player.pos.y = respawn.pos.y + (Math.random() * respawn.size.y | 0);
        } while (player.collide(this, 0));

        this.players.set(player.id, player);
        this.notifyChanges();
        return player;
    }
    removePlayer(playerId) {
        this.players.delete(playerId);
        this.notifyChanges();
    }
    createBullet(playerId, vec) {
        const player = this.players.get(playerId);
        const vel = new Vec(vec.x - player.pos.x, vec.y - player.pos.y);
        const bullet = new Bullet(player, vel);
        this.bullets.add(bullet);
        this.notifyChanges();
        return bullet;
    }
    movePlayer(playerId, axis, direction) {
        this.players.get(playerId).vel[axis] = direction;
        this.notifyChanges();
    }
    setMap(map) {
        map.walls.forEach(w => {
            const wall = new Rect(w[2], w[3]);
            wall.pos.x = w[0];
            wall.pos.y = w[1];
            this.walls.push(wall);
        });
        map.respawns.forEach(r => {
            const respawn = new Rect(r[2], r[3]);
            respawn.pos.x = r[0];
            respawn.pos.y = r[1];
            this.respawns.push(respawn);
        });
    }
    isRoundOn() {
        return this.roundStartTimestamp + this.roundDuration > Date.now()
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

        if (this.roundStartTimestamp + this.roundDuration + this.roundResultDuration <= Date.now()) {
            this.reset();
        }
    }
    reset() {
        this.players.forEach(player => {
            player.score = 0;
        });
        this.bullets = new Set;
        this.roundStartTimestamp = Date.now();
        this.roundDuration = ROUND_DURATION;
        this.roundResultDuration = ROUND_RESULT_DURATION;
        this.notifyChanges();
    }
    notifyChanges() {
        if (this.onChange) {
            this.onChange();
        }
    }
    serialize() {
        return {
            width: this.width,
            height: this.height,
            roundStartTimestamp: this.roundStartTimestamp,
            roundDuration: this.roundDuration,
            roundResultDuration: this.roundResultDuration,
            players: [...this.players.values()],
            bullets: [...this.bullets],
            walls: this.walls,
            respawns: this.respawns
        };
    }
}

module.exports = Board;