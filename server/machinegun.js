const Weapon = require('./weapon.js');
const Bullet = require('./bullet.js');

class Machinegun extends Weapon {
    constructor() {
        super({
            name: 'machinegun',
            maxBulletCount: 30,
            reloadDuration: 3000,
            loadDuration: 100,
        });

    }
    fire(player, vel) {
        const fire = super.fire();
        if (fire) {
            return [new Bullet(player, vel, 10, 60)];
        }
        return null;
    }
}

module.exports = Machinegun;