import Rect from './rect.js';
import Vec from './vec.js';

export default class Bullet extends Rect {
    constructor(data) {
        super();
        Object.assign(this, data);
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
        const canvas = game._canvas;
        const players = game.players;
        const walls = game.walls;

        if (this.left < 0 || this.right > canvas.width
            || this.top < 0 || this.bottom > canvas.height) {
            bullets.delete(this);
        } else {
            walls.forEach(wall => {
                if (wall.left < this.right && wall.right > this.left &&
                    wall.top < this.bottom && wall.bottom > this.top) {
                    bullets.delete(this);
                }
            });

            players.forEach(player => {
                if (player !== this.player &&
                    player.left < this.right && player.right > this.left &&
                    player.top < this.bottom && player.bottom > this.top) {
                    bullets.delete(this);
                    this.player.kills++;
                }
            });
        }
    }
    draw(context, camera) {
        context.fillStyle = '#fff';
        context.fillRect(this.left - camera.left, this.top - camera.top, this.size.x, this.size.y);
    }
}