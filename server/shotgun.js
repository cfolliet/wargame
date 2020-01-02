const Weapon = require('./weapon.js');
const Bullet = require('./bullet.js');
const Vec = require('./vec.js');

class Shotgun extends Weapon {
    constructor() {
        super({
            name: 'shotgun',
            maxBulletCount: 7,
            reloadDuration: 5000,
            loadDuration: 1000,
        });

    }
    fire(player, vel) {
        const fire = super.fire();
        if (fire) {
            vel.len = 2000;
            const bullets = [
                new Bullet(player, vel)
            ];

            for (let index = -5; index < 6; index++) {
                const newVel = new Vec(vel.x + index * 90, vel.y + index * 90);
                bullets.push(new Bullet(player, newVel, 10, 35));
            }
            return bullets;
        }
        return null;
    }
}

module.exports = Shotgun;