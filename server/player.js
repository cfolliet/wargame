const Rect = require('./rect.js');
const Vec = require('./vec.js');

class Player extends Rect {
    constructor(id, board, name = '') {
        super(10, 10);
        this.board = board;
        this.id = id;
        this.vel = new Vec;
        this.kills = 0;
        this.name = name;
        this.color = '#' + (Math.random() * 16777215 | 0).toString(16);
        this.health = null;
        this.deaths = 0;

        this.spawn();
    }
    update(dt) {
        const vel = new Vec(this.vel.x, this.vel.y);
        if (vel.len) {
            vel.len = 100;
        }
        this.pos.x += vel.x * dt;
        this.pos.y += vel.y * dt;
    }
    collide(game, dt) {
        const width = game.width;
        const height = game.height;
        const objects = [...game.walls, ...game.players.values()];

        const vel = new Vec(this.vel.x, this.vel.y);
        if (vel.len) {
            vel.len = 100;
        }

        if (this.left < 0 || this.right > width
            || this.top < 0 || this.bottom > height) {
            this.pos.x -= vel.x * dt;
            this.pos.y -= vel.y * dt;
            return true;
        }

        let collide = false;
        objects.forEach(object => {
            // todo => use for loop to break at the first collide
            if (object !== this) {
                if (object.left < this.right && object.right > this.left &&
                    object.top < this.bottom && object.bottom > this.top) {
                    this.pos.x -= vel.x * dt;
                    this.pos.y -= vel.y * dt;
                    collide = true;
                }
            }
        });

        return collide;
    }
    hit(bullet) {
        this.health -= bullet.power;
        if (this.health <= 0) {
            bullet.player.kills++;
            this.deaths++;
            this.spawn();
        }
    }
    spawn() {
        this.health = 100;
        do {
            const respawn = this.board.respawns[Math.random() * this.board.respawns.length | 0];
            this.pos.x = respawn.pos.x + (Math.random() * respawn.size.x | 0);
            this.pos.y = respawn.pos.y + (Math.random() * respawn.size.y | 0);
        } while (this.collide(this.board, 0));
        this.board.notifyChanges();
    }
}

module.exports = Player;