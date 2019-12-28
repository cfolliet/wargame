const Rect = require('./rect.js');
const Vec = require('./vec.js');

const BULLET_POWER = 35;

class Bullet extends Rect {
    constructor(player, vel) {
        super(0, 0, 2, 2);
        this.vel = vel;
        this.player = player;
        this.pos.x = player.pos.x;
        this.pos.y = player.pos.y;
        this.power = BULLET_POWER;
    }
    update(dt) {
        const vel = new Vec(this.vel.x, this.vel.y);
        if (vel.len) {
            vel.len = 2000;
        }
        this.pos.x += vel.x * dt;
        this.pos.y += vel.y * dt;
    }
    collide(game) {
        const bullets = game.bullets;
        const width = game.width;
        const height = game.height;
        const walls = game.walls;
        const targets = [game.players.values(), ...game.zombies.values()];

        if (this.left < 0 || this.right > width
            || this.top < 0 || this.bottom > height) {
            bullets.delete(this);
        } else {
            walls.forEach(wall => {
                if (wall.left < this.right && wall.right > this.left &&
                    wall.top < this.bottom && wall.bottom > this.top) {
                    bullets.delete(this);
                }
            });

            targets.forEach(target => {
                if (target !== this.target &&
                    target.left < this.right && target.right > this.left &&
                    target.top < this.bottom && target.bottom > this.top) {
                    bullets.delete(this);
                    if (game.isRoundOn()) {
                        target.hit(this);
                    }
                }
            });
        }
    }
}

module.exports = Bullet;