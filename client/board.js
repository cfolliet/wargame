const BOARD_SCALE = 1;

class Board {
    constructor(canvas) {
        this.scale = BOARD_SCALE;
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.currentPlayerId = null;
        this.players = new Map;
        this.zombies = new Map;
        this.bullets = new Set;
        this.walls = [];
        this.respawns = [];

        this.roundStartTimestamp = null;
        this.roundDuration = null;

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
        requestAnimationFrame(this._frameCallback);
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
    loadPlayer(data) {
        const player = new Player();
        Object.assign(player, data);
        this.players.set(player.id, player);
    }
    loadZombie(data) {
        const zombie = new Zombie();
        Object.assign(zombie, data);
        this.zombies.set(zombie.id, zombie);
    }
    loadBullet(data) {
        const bullet = new Bullet(data.player, data.vel);
        Object.assign(bullet, data);
        this.bullets.add(bullet);
    }
    loadMap(map) {
        this.walls = [];
        this.respawns = [];
        map.walls.forEach(w => {
            const wall = new Rect(w.pos.x, w.pos.y, w.size.x, w.size.y);
            this.walls.push(wall);
        });
        map.respawns.forEach(r => {
            const respawn = new Rect(r.pos.x, r.pos.y, r.size.x, r.size.y);
            this.respawns.push(respawn);
        });
    }
    load(data) {
        this._canvas.width = data.width * this.scale;
        this._canvas.height = data.height * this.scale;
        this._context.scale(this.scale, this.scale);
        this.time = data.time;
        this.roundStartTimestamp = data.roundStartTimestamp;
        this.roundDuration = data.roundDuration;
        this.roundResultDuration = data.roundResultDuration;
        this.currentPlayerId = data.currentPlayerId;
        this.players.clear();
        data.players.forEach(p => this.loadPlayer(p));
        this.zombies.clear();
        data.zombies.forEach(z => this.loadZombie(z));
        this.bullets.clear();
        data.bullets.forEach(b => this.loadBullet(b));
        this.loadMap(data);
    }
    clear() {
        //this._context.fillStyle = '#000';
        //this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        var image = document.getElementById('background-image');
        this._context.drawImage(image, 0, 0);
    }
    drawRect(rect, color = '#fff', stroke) {
        this._context.fillStyle = color;
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
        if (stroke) {
            this._context.strokeStyle = '#fff';
            this._context.strokeRect(rect.left, rect.top, rect.size.x, rect.size.y);
        }
    }
    drawTime() {
        this._context.fillStyle = '#fff';
        if (this.roundStartTimestamp + this.roundDuration > this.time) {
            const roundDuration = new Date(1000 * Math.round((this.roundStartTimestamp + this.roundDuration - this.time) / 1000)); // round to nearest second
            this._context.fillText('Time left: ' + roundDuration.getUTCMinutes() + ':' + roundDuration.getUTCSeconds().toString().padStart(2, '0'), this._canvas.width / this.scale - 115, 20, 100);
        } else {
            const waitDuration = new Date(1000 * Math.round((this.roundStartTimestamp + this.roundDuration + this.roundResultDuration - this.time) / 1000)); // round to nearest second
            this._context.fillText('New round in: ' + waitDuration.getUTCMinutes() + ':' + waitDuration.getUTCSeconds().toString().padStart(2, '0'), this._canvas.width / 3 / this.scale, this._canvas.width / 2 / this.scale, 100);
        }
    }
    drawScore(players) {
        this._context.fillStyle = '#fff';
        [...players.values()].sort((a, b) => b.kills - a.kills).forEach((player, index) => {
            this._context.fillStyle = player.color;
            this._context.fillRect(this._canvas.width / this.scale - 115, 32 + index * 20, 10, 10);
            this._context.strokeStyle = '#fff';
            this._context.strokeRect(this._canvas.width / this.scale - 115, 32 + index * 20, 10, 10);
            this._context.fillText(`${player.name}: ${player.kills}/${player.deaths}`, this._canvas.width / this.scale - 100, 40 + index * 20, 100);
        });
    }
    drawRespawns() {
        this.respawns.forEach(respawn => {
            this._context.fillStyle = 'violet';
            this._context.fillRect(respawn.pos.x, respawn.pos.y, respawn.size.x, respawn.size.y);
        });
    }
    drawInfos() {
        this._context.fillStyle = '#fff';
        this._context.fillText('FPS: ' + this.fps, 20, 20);
        this._context.fillText('Ping: ' + (this.ping | 0), 20, 35);
    }
    drawHealth() {
        if (this.currentPlayer()) {
            this._context.fillStyle = '#fff';
            this._context.fillText('\u2764 ' + this.currentPlayer().health, 20, this._canvas.height / this.scale - 20);
        }
    }
    drawWeapon() {
        if (this.currentPlayer()) {
            this._context.fillStyle = '#fff';
            const player = this.currentPlayer();
            const weapon = player.weapons[player.currentWeaponIndex];
            if (weapon.isReloading) {
                this._context.fillText(`${weapon.name}: RELOADING...`, 100, this._canvas.height / this.scale - 20);
            } else {
                this._context.fillText(`${weapon.name}: ${weapon.bulletCount}/${weapon.maxBulletCount}`, 100, this._canvas.height / this.scale - 20);
            }
        }
    }
    draw() {
        this.clear();
        //this.drawRespawns();
        this.players.forEach(player => this.drawRect(player, player.color, true));
        this.zombies.forEach(zombie => this.drawRect(zombie, zombie.color, false));
        this.bullets.forEach(bullet => this.drawRect(bullet));
        //this.walls.forEach(wall => this.drawRect(wall));
        this.drawScore(this.players);
        this.drawInfos();
        this.drawHealth();
        this.drawWeapon();
        this.drawTime();
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