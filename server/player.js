const Rect = require('./rect.js');
const Vec = require('./vec.js');
const Pistol = require('./pistol.js');
const Machinegun = require('./machinegun.js');
const Shotgun = require('./shotgun.js');

class Player extends Rect {
    constructor(id, board, name = '') {
        super(0, 0, 10, 10);
        this.board = board;
        this.id = id;
        this.vel = new Vec;
        this.kills = 0;
        this.name = name;
        this.color = '#' + (Math.random() * 16777215 | 0).toString(16);
        this.health = 0;
        this.deaths = 0;
        this.weapons = [new Pistol(), new Machinegun(), new Shotgun()];
        this.currentWeaponIndex = 0;

        this.spawn();
    }
    update(dt) {
        if (this.health <= 0) {
            this.deaths++;
            this.pos.x = -1000;
            this.pos.y = -1000;
        }

        let vel = new Vec(this.vel.x, this.vel.y);
        let collide = this.collide(vel, this.board, dt);
        if (collide && this.vel.x != 0 && this.vel.y != 0) {
            vel = new Vec(0, this.vel.y);
            collide = this.collide(vel, this.board, dt);
            if (collide) {
                vel = new Vec(this.vel.x, 0);
                this.collide(vel, this.board, dt);
            }
        }
    }
    collide(vel, game, dt) {
        const width = game.width;
        const height = game.height;
        const objects = [...game.walls, ...game.players.values()];

        this.applyVel(vel, dt)

        if (this.left < 0 || this.right > width
            || this.top < 0 || this.bottom > height) {
            this.applyVel(vel, dt, true);
            return true;
        }

        let collide = false;
        objects.forEach(object => {
            // todo => use for loop to break at the first collide
            if (object !== this) {
                if (object.left < this.right && object.right > this.left &&
                    object.top < this.bottom && object.bottom > this.top) {
                    this.applyVel(vel, dt, true);
                    collide = true;
                }
            }
        });

        return collide;
    }
    applyVel(vel, dt, invert = false) {
        if (vel.len) {
            vel.len = 100;
        }
        let modifiyer = invert ? -1 : 1;
        this.pos.x += vel.x * dt * modifiyer;
        this.pos.y += vel.y * dt * modifiyer;
    }
    fire(target) {
        const vel = new Vec(target.x - this.pos.x, target.y - this.pos.y);
        return this.weapons[this.currentWeaponIndex].fire(this, vel);
    }
    reload() {
        this.weapons[this.currentWeaponIndex].reload();
    }
    changeWeapon(newIndex) {
        this.currentWeaponIndex = newIndex;
    }
    hit(bullet) {
        //todo remove this function, move the health decrease and the kills++ on the bullet side, the rest is done in the update here
        this.health -= bullet.damage;
        if (this.health <= 0) {
            bullet.player.kills++;
            this.deaths++;
            this.pos.x = -1000;
            this.pos.y = -1000;
        }
    }
    spawn() {
        this.health = 100;
        do {
            const respawn = this.board.playerSpawns[Math.random() * this.board.playerSpawns.length | 0];
            this.pos.x = respawn.pos.x + (Math.random() * respawn.size.x | 0);
            this.pos.y = respawn.pos.y + (Math.random() * respawn.size.y | 0);
        } while (this.collide(new Vec, this.board, 0));
        this.weapons.forEach(weapon => weapon.reset());
        this.board.notifyChanges();
    }
}

module.exports = Player;