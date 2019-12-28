const Rect = require('./rect.js');
const Vec = require('./vec.js');

class Zombie extends Rect {
    constructor(id, board) {
        super(10, 10);
        this.board = board;
        this.id = id;
        this.vel = new Vec;
        this.color = 'red';
        this.health = null;
        this.lastStrike = Date.now();

        this.spawn();
    }
    update(dt) {
        if (this.board.isRoundOn()) {
            const target = [...this.board.players][0][1].pos;
            this.vel.x = target.x - this.pos.x;
            this.vel.y = target.y - this.pos.y;

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
            this.revertVel(vel, dt)
            return true;
        }

        let collide = false;
        objects.forEach(object => {
            // todo => use for loop to break at the first collide
            if (object !== this) {
                if (object.left < this.right && object.right > this.left &&
                    object.top < this.bottom && object.bottom > this.top) {
                    this.revertVel(vel, dt)
                    collide = true;
                }
            }
        });

        [...game.players.values()].forEach(player => {
            // todo => use for loop to break at the first collide
            if (player.left < this.right && player.right > this.left &&
                player.top < this.bottom && player.bottom > this.top) {
                this.revertVel(vel, dt)
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
    applyVel(vel, dt) {
        if (vel.len) {
            vel.len = 75;
        }
        this.pos.x += vel.x * dt;
        this.pos.y += vel.y * dt;
    }
    revertVel(vel, dt) {
        if (vel.len) {
            vel.len = 75;
        }
        this.pos.x -= vel.x * dt;
        this.pos.y -= vel.y * dt;
    }
    hit(bullet) {
        this.health -= bullet.power;
        if (this.health <= 0) {
            bullet.player.kills++;
            this.board.zombies.delete(this.id);
            this.board.notifyChanges();
        }
    }
    spawn() {
        this.health = 100;
        do {
            const respawn = this.board.respawns[Math.random() * this.board.respawns.length | 0];
            this.pos.x = respawn.pos.x + (Math.random() * respawn.size.x | 0);
            this.pos.y = respawn.pos.y + (Math.random() * respawn.size.y | 0);
        } while (this.collide(new Vec, this.board, 0));
        this.board.notifyChanges();
    }
}

module.exports = Zombie;