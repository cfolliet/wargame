const Rect = require('./rect.js');
const Vec = require('./vec.js');

class Zombie extends Rect {
    constructor(id, board) {
        super(0, 0, 10, 10);
        this.board = board;
        this.id = id;
        this.vel = new Vec;
        this.color = 'red';
        this.health = null;
        this.lastStrike = Date.now();
        this.speed = Math.floor(Math.random() * (50 - 33 + 1) + 33);

        this.spawn();
    }
    update(dt) {
        if (this.board.isRoundOn()) {
            let target = null;
            let targetDist = this.board.width + this.board.height;

            [...this.board.players.values()].forEach(player => {
                const dist = Math.hypot(player.pos.x - this.pos.x, player.pos.y - this.pos.y);
                if (dist <= 300 && (target == null || dist < targetDist)) {
                    targetDist = dist
                    target = player;
                }
            });

            if (target) {
                this.vel.x = target.pos.x - this.pos.x;
                this.vel.y = target.pos.y - this.pos.y;
            } else {
                this.vel.x = 0;
                this.vel.y = 0;
            }

            let vel = new Vec(this.vel.x, this.vel.y);
            let collide = this.collide(vel, this.board, dt);
            if (collide && this.vel.x != 0 && this.vel.y != 0) {
                vel = new Vec(0, this.vel.y);
                collide = this.collide(vel, this.board, dt);
                if (collide) {
                    this.vel.y = 0;
                    vel = new Vec(this.vel.x, this.vel.y);
                    collide = this.collide(vel, this.board, dt);
                    if (collide) {
                        this.vel.x = 0;
                    }
                }
            }
        }
    }
    collide(vel, game, dt) {
        const width = game.width;
        const height = game.height;
        const objects = [...game.walls, ...game.zombies.values()];

        this.applyVel(vel, dt);

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

        [...game.players.values()].forEach(player => {
            // todo => use for loop to break at the first collide
            if (player.left < this.right && player.right > this.left &&
                player.top < this.bottom && player.bottom > this.top) {
                this.applyVel(vel, dt, true);
                collide = true;
                const now = Date.now();
                if (now - this.lastStrike >= 2000) {
                    player.health -= 35;
                    this.lastStrike = now;
                }
            }
        });

        return collide;
    }
    applyVel(vel, dt, invert = false) {
        if (vel.len) {
            vel.len = this.speed;
        }
        let modifiyer = invert ? -1 : 1;
        this.pos.x += vel.x * dt * modifiyer;
        this.pos.y += vel.y * dt * modifiyer;
    }
    hit(bullet) {
        this.health -= bullet.power;
        if (this.health <= 0) {
            bullet.player.kills++;
            this.board.zombies.delete(this.id);

            this.board.createZombie();
            if(Math.random() >= 0.25){
                this.board.createZombie();
            }

            this.board.notifyChanges();
        }
    }
    spawn() {
        this.health = 100;
        do {
            const respawn = this.board.zombieSpawns[Math.random() * this.board.zombieSpawns.length | 0];
            this.pos.x = respawn.pos.x + (Math.random() * respawn.size.x | 0);
            this.pos.y = respawn.pos.y + (Math.random() * respawn.size.y | 0);
        } while (this.collide(new Vec, this.board, 0));
        this.board.notifyChanges();
    }
}

module.exports = Zombie;