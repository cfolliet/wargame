class Board {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.players = new Map;
        this.bullets = new Set;

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
    createBullet(player, vel) {
        const bullet = new Bullet(player, vel);
        this.bullets.add(bullet);
        return bullet;
    }
    movePlayer(player, axis, direction){        
        player.vel[axis] = direction;
    }
    loadPlayer(data) {
        const player = new Player();
        Object.assign(player, data);
        this.players.set(player.id, player);
    }
    load(data) {
        this.players.clear();
        data.players.forEach(p => this.loadPlayer(p));
        //this.bullets = data.bullets;
    }
    clear() {
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
    drawRect(rect) {
        this._context.fillStyle = '#fff';
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }
    drawScore(players) {
        [...players.values()].sort((a, b) => b.score - a.score).forEach((player, index) => {
            this._context.fillText(player.name + ': ' + player.score, this._canvas.width - 100, 20 + index * 20, 100);
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