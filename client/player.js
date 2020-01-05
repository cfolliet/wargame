import Rect from './rect.js';
import Vec from './vec.js';

export default class Player extends Rect {
    constructor(data) {
        super();
        Object.assign(this, data);
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
        const canvas = game._canvas;
        const objects = [...game.walls, ...game.players.values()];

        const vel = new Vec(this.vel.x, this.vel.y);
        if (vel.len) {
            vel.len = 100;
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
    draw(context, camera) {
        context.fillStyle = this.color;
        context.fillRect(this.left - camera.left, this.top - camera.top, this.size.x, this.size.y);
        context.strokeStyle = '#fff';
        context.strokeRect(this.left - camera.left, this.top - camera.top, this.size.x, this.size.y);
    }
}