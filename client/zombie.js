import Rect from './rect.js';
import Vec from './vec.js';

export default class Zombie extends Rect {
    constructor(data) {
        super();
        this.angle = 90;
        Object.assign(this, data);
    }
    update(dt) {
        const target = [...this.board.players][0][1].pos;
        this.vel.x = target.x - this.pos.x;
        this.vel.y = target.y - this.pos.y;

        const vel = new Vec(this.vel.x, this.vel.y);
        if (vel.len) {
            vel.len = 75;
        }
        this.pos.x += vel.x * dt;
        this.pos.y += vel.y * dt;
    }
    collide(game, dt) {
        const canvas = game._canvas;
        const objects = [...game.walls, ...game.zombies.values()];

        const vel = new Vec(this.vel.x, this.vel.y);
        if (vel.len) {
            vel.len = 75;
        }

        if (this.left < 0 || this.right > canvas.width
            || this.top < 0 || this.bottom > canvas.height) {
            this.pos.x -= vel.x * dt;
            this.pos.y -= vel.y * dt;
        } else {
            objects.forEach(object => {
                // todo => use for loop to break at the first collide
                if (object !== this) {
                    if (object.left < this.right && object.right > this.left &&
                        object.top < this.bottom && object.bottom > this.top) {
                        this.pos.x -= vel.x * dt;
                        this.pos.y -= vel.y * dt;
                    }
                }
            });
        }
    }
    draw(context, camera, spriteManager) {
        const image = spriteManager.get('/img/zombie.png');
        this.angle = Math.atan2(this.vel.y, this.vel.x);
        context.fillStyle = this.color;
        context.strokeRect(this.left - camera.left, this.top - camera.top, this.size.x, this.size.y);
        context.translate(this.left - camera.left + this.size.x / 2, this.top - camera.top + this.size.y / 2);
        context.rotate(this.angle);
        context.drawImage(image, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        context.rotate(-this.angle);
        context.translate(-(this.left - camera.left + this.size.x / 2), -(this.top - camera.top + this.size.y / 2));
    }
}