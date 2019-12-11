class Bullet extends Rect {
    constructor(player) {
        super(2, 2);
        this.vel = new Vec;
        this.player = player;
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
        const canvas = game._canvas;
        const players = game.players;

        if (this.left < 0 || this.right > canvas.width
            || this.top < 0 || this.bottom > canvas.height) {
                // todo use a Set instead of Array for the bullets to be able to do a .delete
            bullets.splice(bullets.indexOf(this), 1);
        } else {
            players.forEach(player => {
                if (player !== this.player &&
                    player.left < this.right && player.right > this.left &&
                    player.top < this.bottom && player.bottom > this.top) {
                    bullets.splice(bullets.indexOf(this), 1);
                    this.player.score++;
                }
            });
        }
    }
}