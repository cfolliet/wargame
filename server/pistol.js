const Weapon = require('./weapon.js');
const Bullet = require('./bullet.js');

class Pistol extends Weapon {
    constructor() {
        super({
            name: 'pistol',
            maxBulletCount: 15,
            reloadDuration: 5000,
            loadDuration: 500
        });

    }
    fire(player, vel) {
        const fire = super.fire();
        if (fire) {
            return [new Bullet(player, vel, 30, 100)];
        }
        return null;
    }
}

module.exports = Pistol;