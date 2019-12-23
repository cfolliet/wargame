const Weapon = require('./weapon.js');
const Bullet = require('./bullet.js');
const Vec = require('./vec.js');

class Shotgun extends Weapon {
    constructor() {
        super({
            name: 'shotgun',
            range: 7000,
            bulletCount: 5,
            maxBulletCount: 5,
            reloadDuration: 10000,
            loadDuration: 1000,
        });

    }
    fire(player, vel) {
        const fire = super.fire();
        if (fire) {
            const bullets = [
                new Bullet(player, vel)
            ];

            for (let index = -5; index < 6; index++) {
                const newVel = new Vec(vel.x + index * 2, vel.y + index * 2);
                bullets.push(new Bullet(player, newVel))                
            }
            return bullets;
        }
        return null;
    }
}

module.exports = Shotgun;