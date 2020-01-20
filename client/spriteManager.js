import { loadImage } from './loader.js';

export default class SpriteManager {
    constructor() {
        this.ressources = new Map;
    }
    get(url) {
        return this.ressources.get(url);
    }
    load() {
        const promises = [];
        [
            '/img/map.png',
            '/img/machinegun.png',
            '/img/pistol.png',
            '/img/shotgun.png',
            '/img/zombie.png',
            '/img/player.png'
        ].forEach(url => {
            promises.push(loadImage(url).then((image) => this.ressources.set(url, image)));
        });
        return Promise.all(promises);
    }
}