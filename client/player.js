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
    draw(context, camera, spriteManager, board) {
        context.strokeStyle = this.color;
        context.arc(this.pos.x - camera.left, this.pos.y - camera.top, 10, 0, 2 * Math.PI);
        context.stroke();

        const image = spriteManager.get('/img/player.png');
        let headingX = 0;
        let headingY = 0;

        if (this.headingPosition) {
            headingX = this.headingPosition.x;
            headingY = this.headingPosition.y;
        }

        if (board.mousePosition && this.id == board.currentPlayerId) {
            headingX = board.mousePosition.x - this.pos.x;
            headingY = board.mousePosition.y - this.pos.y;
        }

        this.angle = Math.atan2(headingY, headingX);

        const sizeX = this.size.x + 10;
        const sizeY = this.size.y + 10;
        const left = this.left - 5;
        const top = this.top - 5;
        context.translate(left - camera.left + sizeX / 2, top - camera.top + sizeY / 2);
        context.rotate(this.angle);
        context.drawImage(image, -sizeX / 2, -sizeY / 2, sizeX, sizeY);
        context.rotate(-this.angle);
        context.translate(-(left - camera.left + sizeX / 2), -(top - camera.top + sizeY / 2));
    }
}