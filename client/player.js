class Player extends Rect {
    constructor(name = '') {
        super(10, 10);
        this.vel = new Vec;
        this.score = 0;
        this.name = name;
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
        const players = game.players;

        const vel = new Vec(this.vel.x, this.vel.y);
        if (vel.len) {
            vel.len = 100;
        }

        if (this.left < 0 || this.right > canvas.width
            || this.top < 0 || this.bottom > canvas.height) {
            this.pos.x -= vel.x * dt;
            this.pos.y -= vel.y * dt;
        } else {
            players.forEach(player => {
                // todo => use for loop to break at the first collide
                if (player !== this) {
                    if (player.left < this.right && player.right > this.left &&
                        player.top < this.bottom && player.bottom > this.top) {
                        this.pos.x -= vel.x * dt;
                        this.pos.y -= vel.y * dt;
                    }
                }
            });
        }
    }
}