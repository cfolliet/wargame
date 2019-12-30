class Weapon {
    constructor(options) {
        this.options = options;
        this.name = options.name;
        this.range = options.range;
        this.maxBulletCount = options.maxBulletCount;
        this.loadDuration = options.loadDuration;
        this.reloadDuration = options.reloadDuration;
        this.loadTimestamp = Date.now();

        this.reset();
    }
    isEmpty() {
        return this.bulletCount <= 0;
    }
    load() {
        this.isLoading = true;
        this.loadTimestamp = Date.now();
        setTimeout(() => {
            this.isLoading = false;
        }, this.loadDuration)
    }
    reload() {
        if (this.isReloading) {
            return;
        }
        this.isReloading = true;
        this.loadTimestamp = Date.now();
        setTimeout(() => {
            this.bulletCount = this.maxBulletCount;
            this.isReloading = false;
        }, this.reloadDuration);
    }
    fire() {
        if (this.isLoading) {
            return false;
        }
        if (this.isReloading) {
            return false;
        }
        if (this.isEmpty()) {
            this.reload();
            return false;
        }
        this.bulletCount--;
        this.load();
        return true;
    }
    reset() {
        this.bulletCount = this.maxBulletCount;
        this.isLoading = false;
        this.isReloading = false;
    }
}

module.exports = Weapon;