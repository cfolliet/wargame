const Weapon = require('./weapon.js');
const Bullet = require('./bullet.js');

class Machinegun extends Weapon {
    constructor() {
        super({
            name: 'machinegun',
            range: 13000,
            bulletCount: 30,
            maxBulletCount: 30,
            reloadDuration: 5000,
            loadDuration: 100,
        });

    }
    fire(player, vel) {
        const fire = super.fire();
        if (fire) {
            return new Bullet(player, vel);
        }
        return null;
    }
}

module.exports = Machinegun;