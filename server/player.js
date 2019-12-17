const Rect = require('./rect.js');
const Vec = require('./vec.js');

class Player extends Rect {
    constructor(id, name = '') {
        super(10, 10);
        this.id = id;
        this.vel = new Vec;
        this.score = 0;
        this.name = name;
        this.color = '#' + (Math.random() * 16777215 | 0).toString(16);
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
}

module.exports = Player;