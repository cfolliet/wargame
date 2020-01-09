export default class SettingsManager {
    constructor() {
        this.settings = null;
        this.load();
        this.bind();
    }
    bind() {
        const settingsToggler = document.getElementById('settings-toggler');
        const keySettings = document.querySelectorAll('.key');
        const saveSettings = document.getElementById('save-settings');

        settingsToggler.addEventListener('click', this.toggleDisplay);

        saveSettings.addEventListener('click', () => {
            const keyMapping = {};
            keySettings.forEach(keySetting => {
                keyMapping[keySetting.getAttribute('data-action')] = keySetting.value;
            })

            const settings = {
                type: 'save-settings',
                value: {
                    name: document.getElementById('name').value,
                    keyMapping: keyMapping
                }
            }

            localStorage.setItem('settings', JSON.stringify(settings.value));
            this.settings = settings.value;
            if (this.onSave) {
                this.onSave(this.settings);
            }
            this.toggleDisplay();
        });

        keySettings.forEach(keySetting => {
            keySetting.addEventListener('click', () => {
                keySetting.innerHTML = '???';
                const listenKey = event => {
                    keySetting.innerHTML = event.key;
                    keySetting.value = event.keyCode;
                    document.removeEventListener('keyup', listenKey);
                }
                document.addEventListener('keyup', listenKey);
            });
        });
    }
    load() {
        const stringSettings = localStorage.getItem('settings');
        if (stringSettings) {
            this.settings = JSON.parse(stringSettings);
        }
        if (this.settings) {

            if (!this.settings.keyMapping) {
                this.settings.keyMapping = this.getDefaultKeyMapping();
            }

            document.getElementById('name').value = this.settings.name,
                document.querySelectorAll('.key').forEach(keySetting => {
                    const action = keySetting.getAttribute('data-action');
                    keySetting.innerHTML = String.fromCharCode(this.settings.keyMapping[action]);
                    keySetting.value = this.settings.keyMapping[action];
                });
        } else {
            this.settings = {
                keyMapping: this.getDefaultKeyMapping()
            }
        }
    }
    getDefaultKeyMapping() {
        return { top: "90", bottom: "83", left: "81", right: "68", reload: "82", nextweapon: "69" };
    }
    toggleDisplay() {
        const canvas = document.getElementById('canvas');
        const settingsView = document.getElementById('settings');
        if (settingsView.style.display == 'block') {
            canvas.style.display = 'block';
            settingsView.style.display = 'none';
        } else {
            canvas.style.display = 'none';
            settingsView.style.display = 'block';
        }
    }
}