class Board {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.currentPlayerId = null;
        this.players = new Map;
        this.bullets = new Set;

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
    loadBullet(data) {
        const bullet = new Bullet(data.player, data.vel);
        Object.assign(bullet, data);
        this.bullets.add(bullet);
    }
    load(data) {
        this._canvas.width = data.width;
        this._canvas.height = data.height;
        this.currentPlayerId = data.currentPlayerId;
        this.players.clear();
        data.players.forEach(p => this.loadPlayer(p));
        this.bullets.clear();
        data.bullets.forEach(b => this.loadBullet(b));
    }
    clear() {
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
    drawRect(rect, color = '#fff', stroke) {
        this._context.fillStyle = color;
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
        if (stroke) {
            this._context.strokeStyle = '#fff';
            this._context.strokeRect(rect.left, rect.top, rect.size.x, rect.size.y);
        }
    }
    drawScore(players) {
        this._context.fillStyle = '#fff';
        [...players.values()].sort((a, b) => b.score - a.score).forEach((player, index) => {
            this._context.fillStyle = player.color;
            this._context.fillRect(this._canvas.width - 115, 12 + index * 20, 10, 10);
            this._context.strokeStyle = '#fff';
            this._context.strokeRect(this._canvas.width - 115, 12 + index * 20, 10, 10);
            this._context.fillText(player.name + ': ' + player.score, this._canvas.width - 100, 20 + index * 20, 100);
        });
    }
    drawInfos() {
        this._context.fillStyle = '#fff';
        this._context.fillText('FPS: ' + this.fps, 20, 20);
        this._context.fillText('Ping: ' + this.ping, 20, 35);
    }
    draw() {
        this.clear();

        this.players.forEach(player => this.drawRect(player, player.color, true));
        this.bullets.forEach(bullet => this.drawRect(bullet));
        this.drawScore(this.players);
        this.drawInfos();
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