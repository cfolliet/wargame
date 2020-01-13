const Player = require('./player.js');
const Zombie = require('./zombie.js');
const Rect = require('./rect.js');

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
    constructor(map, zombieCount) {
        this.width = 0;
        this.height = 0;

        this.players = new Map;
        this.startZombieCount = zombieCount;
        this.zombies = new Map;
        this.walls = [];
        this.playerSpawns = [];
        this.zombieSpawns = [];

        this.setMap(map);

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
        const player = new Player(createId(), this, name);
        this.players.set(player.id, player);
        return player;
    }
    removePlayer(playerId) {
        this.players.delete(playerId);
        this.notifyChanges();
    }
    createZombie() {
        const zombie = new Zombie(createId(), this);
        this.zombies.set(zombie.id, zombie);
        return zombie;
    }
    fire(playerId, target) {
        const player = this.players.get(playerId);
        const bullets = player.fire(target);
        if (bullets) {
            bullets.forEach(b => this.bullets.add(b));
        }
        this.notifyChanges();
        return bullets;
    }
    reload(playerId) {
        const player = this.players.get(playerId);
        player.reload();
        this.notifyChanges();
    }
    changeWeapon(playerId, newIndex) {
        const player = this.players.get(playerId);
        player.changeWeapon(newIndex);
        this.notifyChanges();
    }
    movePlayer(playerId, axis, direction) {
        this.players.get(playerId).vel[axis] = direction;
        this.notifyChanges();
    }
    setMap(map) {
        this.width = map.width;
        this.height = map.height;
        map.walls.forEach(w => {
            const wall = new Rect(w[0], w[1], w[2], w[3]);
            this.walls.push(wall);
        });
        map.playerSpawns.forEach(r => {
            const respawn = new Rect(r[0], r[1], r[2], r[3]);
            this.playerSpawns.push(respawn);
        });
        map.zombieSpawns.forEach(r => {
            const respawn = new Rect(r[0], r[1], r[2], r[3]);
            this.zombieSpawns.push(respawn);
        });
    }
    isRoundOn() {
        return [...this.players.values()].every(p => p.health > 0);
    }
    update(dt) {
        if (this.players.size) {
            this.players.forEach(player => player.update(dt));
            this.zombies.forEach(zombie => zombie.update(dt));
            this.bullets.forEach(bullet => {
                bullet.update(dt);
                bullet.collide(this)
            });

            if (!this.isRoundOn()) {
                this.reset();
            }
        }
    }
    reset() {
        this.zombies.clear();
        for (let index = 0; index < this.startZombieCount; index++) {
            this.createZombie();
        }

        this.players.forEach(player => {
            player.health = 100;
            player.kills = 0;
            player.deaths = 0;
            player.weapons.forEach(weapon => weapon.reset());
        });
        this.bullets = new Set;
        this.roundStartTimestamp = Date.now();
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
            roundResultDuration: this.roundResultDuration,
            players: [...this.players.values()],
            zombies: [...this.zombies.values()],
            bullets: [...this.bullets],
            walls: this.walls,
            playerSpawns: this.playerSpawns
        };
    }
}

module.exports = Board;