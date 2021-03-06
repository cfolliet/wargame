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
        const sizeX = this.size.x + 2;
        const sizeY = this.size.y + 2;
        const left = this.left - 1;
        const top = this.top - 1;
        this.angle = Math.atan2(this.vel.y, this.vel.x);
        //context.fillStyle = this.color;
        //context.strokeRect(this.left - camera.left, this.top - camera.top, this.size.x, this.size.y);
        context.translate(left - camera.left + sizeX / 2, top - camera.top + sizeY / 2);
        context.rotate(this.angle);
        context.drawImage(image, -sizeX / 2, -sizeY / 2, sizeX, sizeY);
        context.rotate(-this.angle);
        context.translate(-(left - camera.left + sizeX / 2), -(top - camera.top + sizeY / 2));

        const nbpixels = sizeX * sizeY;
        const bloodPixels = nbpixels * ((100 - this.health) / 100) / 6;
        context.fillStyle = 'red';
        for (let i = 0; i < bloodPixels; i++) {
            context.fillRect(this.left - camera.left + Math.random() * sizeX, this.top - camera.top + Math.random() * sizeY, 1, 1);
        }
    }
}