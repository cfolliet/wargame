const Rect = require('./rect.js');
const Vec = require('./vec.js');

class Bullet extends Rect {
    constructor(player, vel) {
        super(2, 2);
        this.vel = vel;
        this.player = player;
        this.pos.x = player.pos.x;
        this.pos.y = player.pos.y;
    }
    update(dt) {
        const vel = new Vec(this.vel.x, this.vel.y);
        if (vel.len) {
            vel.len = 500;
        }
        this.pos.x += vel.x * dt;
        this.pos.y += vel.y * dt;
    }
    collide(game) {
        const bullets = game.bullets;
        const width = game.width;
        const height = game.height;
        const players = game.players;

        if (this.left < 0 || this.right > width
            || this.top < 0 || this.bottom > height) {
            bullets.delete(this);
        } else {
            players.forEach(player => {
                if (player !== this.player &&
                    player.left < this.right && player.right > this.left &&
                    player.top < this.bottom && player.bottom > this.top) {
                    bullets.delete(this);
                    this.player.score++;
                }
            });
        }
    }
}

module.exports = Bullet;