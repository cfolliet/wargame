const Weapon = require('./weapon.js');
const Bullet = require('./bullet.js');

class Pistol extends Weapon {
    constructor() {
        super({
            range: 13000,
            bulletCount: 15,
            maxBulletCount: 15,
            reloadDuration: 5000,
            loadDuration: 500,
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

module.exports = Pistol;