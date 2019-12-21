class Weapon {
    constructor(options) {
        this.range = options.range;
        this.bulletCount = options.bulletCount;
        this.maxBulletCount = options.maxBulletCount;
        this.loadDuration = options.loadDuration;
        this.reloadDuration = options.reloadDuration;
        this.isLoading = false;
        this.isReloading = false;
    }
    isEmpty() {
        return this.bulletCount <= 0;
    }
    load() {
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false;
        }, this.loadDuration)
    }
    reload() {
        this.isReloading = true;
        setTimeout(() => {
            this.bulletCount = this.maxBulletCount;
            this.isReloading = false;
        }, this.reloadDuration);
    }
    fire() {
        if (this.isLoading) {
            console.log('isLoading')
            return false;
        }
        if (this.isReloading) {
            console.log('isReloading')
            return false;
        }
        if (this.isEmpty()) {
            console.log('isEmpty')
            this.reload();
            return false;
        }
        console.log('go')
        this.bulletCount--;
        this.load();
        return true;
    }
}

module.exports = Weapon;