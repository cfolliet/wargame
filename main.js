
class Vec {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len(value) {
        const f = value / this.len;
        this.x *= f;
        this.y *= f;
    }
}

class Rect {
    constructor(w = 0, h = 0) {
        this.pos = new Vec(0, 0);
        this.size = new Vec(w, h);
    }
    get left() {
        return this.pos.x - this.size.x / 2;
    }
    get right() {
        return this.pos.x + this.size.x / 2;
    }
    get top() {
        return this.pos.y - this.size.y / 2;
    }
    get bottom() {
        return this.pos.y + this.size.y / 2;
    }
}

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

class GameBoard {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.players = [
            new Player('player 1'),
            new Player('player 2'),
        ];

        this.bullets = [];

        this.players[0].pos.x = 50;
        this.players[1].pos.x = this._canvas.width - 50;
        this.players.forEach(p => p.pos.y = this._canvas.height / 2);

        let lastTime = null;
        this._frameCallback = (millis) => {
            if (lastTime !== null) {
                const diff = millis - lastTime;
                this.update(diff / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(this._frameCallback);
        };
        requestAnimationFrame(this._frameCallback);
    }
    clear() {
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
    drawRect(rect) {
        this._context.fillStyle = '#fff';
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }
    drawScore(players){
        players.slice().sort((a, b) => b.score - a.score ).forEach((player, index) => {
            this._context.fillText(player.name + ': '  + player.score, this._canvas.width - 100, 20 + index * 20, 100);
        });
    }
    draw() {
        this.clear();

        this.players.forEach(player => this.drawRect(player));
        this.bullets.forEach(bullet => this.drawRect(bullet));
        this.drawScore(this.players);
    }
    update(dt) {
        this.players.forEach(player => {
            player.update(dt);
            player.collide(this, dt);
        }
        );
        this.bullets.forEach(bullet => {
            bullet.update(dt);
            bullet.collide(this)
        });
        this.draw();
    }
}

const canvas = document.getElementById('canvas');
const game = new GameBoard(canvas);
const currentPlayer = game.players[0];

document.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    const bullet = new Bullet(currentPlayer);
    bullet.pos.x = currentPlayer.pos.x;
    bullet.pos.y = currentPlayer.pos.y;
    bullet.vel.x = event.clientX - rect.left - currentPlayer.pos.x;
    bullet.vel.y = event.clientY - rect.top - currentPlayer.pos.y;
    game.bullets.push(bullet);
});

document.addEventListener("keydown", event => {
    if (event.keyCode == 37) {
        currentPlayer.vel.x = -1;
    } else if (event.keyCode == 38) {
        currentPlayer.vel.y = -1;
    } else if (event.keyCode == 39) {
        currentPlayer.vel.x = 1;
    } else if (event.keyCode == 40) {
        currentPlayer.vel.y = 1;
    }
});

document.addEventListener("keyup", event => {
    if (event.keyCode == 37) {
        currentPlayer.vel.x = 0;
    } else if (event.keyCode == 38) {
        currentPlayer.vel.y = 0;
    } else if (event.keyCode == 39) {
        currentPlayer.vel.x = 0;
    } else if (event.keyCode == 40) {
        currentPlayer.vel.y = 0;
    }
});