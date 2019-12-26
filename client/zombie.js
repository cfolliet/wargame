class Zombie extends Rect {
    constructor() {
        super(10, 10);
        this.vel = new Vec;
        this.color =  'red';
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
        const objects = [...game.walls, ...game.players.values(), ...game.zombies.values()];

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
}