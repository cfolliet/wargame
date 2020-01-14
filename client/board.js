import Player from './player.js';
import Zombie from './zombie.js';
import Bullet from './bullet.js';
import Vec from './vec.js';
import Rect from './rect.js';
import drawHud from './hud.js';
import SpriteManager from './spriteManager.js';

export default class Board {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
        this.spriteManager = new SpriteManager();

        this.currentPlayerId = null;
        this.players = new Map;
        this.zombies = new Map;
        this.bullets = new Set;
        this.walls = [];
        this.playerSpawns = [];
        this.lastScore = 0;
        this.score = 0;

        this.roundStartTimestamp = null;

        this.currentHealth = 100;

        this.camera = new Rect(0, 0, 800, 600);
        this._canvas.width = this.camera.size.x;
        this._canvas.height = this.camera.size.y;

        this.ping = 999;
        this.fps = 0;
        let lastTime = null;
        this._frameCallback = (millis) => {
            if (lastTime !== null) {
                const diff = millis - lastTime;
                this.fps = 1000 / diff | 0;
                this.update(diff / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(this._frameCallback);
        };

        this.spriteManager.load().then(() => requestAnimationFrame(this._frameCallback));
    }
    currentPlayer() {
        return this.players.get(this.currentPlayerId);
    }
    createBullet(vec) {
        const player = this.currentPlayer();
        const vel = new Vec(vec.x - player.pos.x, vec.y - player.pos.y);
        const bullet = new Bullet(player, vel);
        this.bullets.add(bullet);
        return bullet;
    }
    movePlayer(axis, direction) {
        this.currentPlayer().vel[axis] = direction;
    }
    load(data) {
        this.time = data.time;
        this.roundStartTimestamp = data.roundStartTimestamp;
        this.roundResultDuration = data.roundResultDuration;
        this.currentPlayerId = data.currentPlayerId;

        this.players = new Map(data.players.map(p => {
            const player = new Player(p);
            return [player.id, player];
        }));

        this.zombies = new Map(data.zombies.map(z => {
            const zombie = new Zombie(z);
            return [zombie.id, zombie];
        }));

        this.bullets = new Set(data.bullets.map(b => {
            return new Bullet(b);
        }));

        this.walls = data.walls.map(w => {
            return new Rect(w.pos.x, w.pos.y, w.size.x, w.size.y);
        });
        this.playerSpawns = data.playerSpawns.map(r => {
            return new Rect(r.pos.x, r.pos.y, r.size.x, r.size.y);
        });
    }
    draw() {
        this._context.font = "20px monospace";
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, this.camera.size.x, this.camera.size.y);
        var image = this.spriteManager.get('/img/map.png');
        this._context.drawImage(image, this.camera.left, this.camera.top, this.camera.size.x, this.camera.size.y, 0, 0, this.camera.size.x, this.camera.size.y);

        this.players.forEach(player => player.draw(this._context, this.camera));
        this.zombies.forEach(zombie => zombie.draw(this._context, this.camera, this.spriteManager));
        this.bullets.forEach(bullet => bullet.draw(this._context, this.camera));
        drawHud(this);
    }
    update(dt) {
        if (this.currentPlayer()) {
            this.camera.pos.x = this.currentPlayer().pos.x// - this.camera.size.x / 2;
            this.camera.pos.y = this.currentPlayer().pos.y// - this.camera.size.y / 2;
            this.score = [...this.players.values()].reduce((acc, p) => acc + p.kills, 0);
        }


        this.players.forEach(player => {
            player.update(dt);
            player.collide(this, dt);
        });
        //this.bullets.forEach(bullet => {
        //    bullet.update(dt);
        //   bullet.collide(this)
        //});
        this.draw();
    }
}