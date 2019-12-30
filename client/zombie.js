class Zombie extends Rect {
    constructor() {
        super(0, 0, 10, 10);
        this.vel = new Vec;
        this.color = 'red';
        this.health = null;
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
}