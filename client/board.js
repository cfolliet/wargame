import Player from './player.js';
import Zombie from './zombie.js';
import Bullet from './bullet.js';
import Vec from './vec.js';
import Rect from './rect.js';
import { loadImage } from './loader.js';
import drawHud from './hud.js';

export default class Board {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.currentPlayerId = null;
        this.players = new Map;
        this.zombies = new Map;
        this.bullets = new Set;
        this.walls = [];
        this.playerSpawns = [];

        this.roundStartTimestamp = null;
        this.roundDuration = null;

        this.currentHealth = 100;

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

        this.ressources = new Map;
        this.loadResources().then(() => requestAnimationFrame(this._frameCallback));
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
        this.scale = Math.min((window.innerHeight - 80) / data.height, (window.innerWidth - 80) / data.width);
        this._canvas.width = data.width * this.scale;
        this._canvas.height = data.height * this.scale;
        this._context.scale(this.scale, this.scale);
        this.time = data.time;
        this.roundStartTimestamp = data.roundStartTimestamp;
        this.roundDuration = data.roundDuration;
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

        this.walls = map.walls.map(w => {
            return new Rect(w.pos.x, w.pos.y, w.size.x, w.size.y);
        });
        this.playerSpawns = map.playerSpawns.map(r => {
            return new Rect(r.pos.x, r.pos.y, r.size.x, r.size.y);
        });
    }
    draw() {
        this._context.font = "20px monospace";
        var image = this.ressources.get('/img/map.png');
        this._context.drawImage(image, 0, 0);

        this.players.forEach(player => player.draw(this._context));
        this.zombies.forEach(zombie => zombie.draw(this._context));
        this.bullets.forEach(bullet => bullet.draw(this._context));
        drawHud(this);
    }
    update(dt) {
        this.players.forEach(player => {
            player.update(dt);
            player.collide(this, dt);
        });
        this.bullets.forEach(bullet => {
            bullet.update(dt);
            bullet.collide(this)
        });
        this.draw();
    }
    loadResources() {
        const urls = [
            '/img/map.png',
            '/img/machinegun.png',
            '/img/pistol.png',
            '/img/shotgun.png'
        ];

        const promises = [];
        urls.forEach(url => {
            promises.push(loadImage(url).then((image) => this.ressources.set(url, image)));
        });
        return Promise.all(promises);
    }
}