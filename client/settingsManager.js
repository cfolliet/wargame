export default class SettingsManager {
    constructor() {
        this.settings = null;
        this.load();
        this.bind();
    }
    load() {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        } else {
            this.settings = { name: '', keyMapping: {} };
        }

        // apply saved settings in view
        document.getElementById('name').value = this.settings.name;
        document.querySelectorAll('.key').forEach(keySetting => {
            const action = keySetting.getAttribute('data-action');
            const value = this.settings.keyMapping[action];
            if (value) {
                keySetting.innerHTML = String.fromCharCode(value);
                keySetting.value = value;
            }
        });

        // get all settings from the view and save them    
        this.settings.name = document.getElementById('name').value;
        const keySettings = document.querySelectorAll('.key');
        keySettings.forEach(keySetting => {
            this.settings.keyMapping[keySetting.getAttribute('data-action')] = keySetting.value;
        })
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }
    bind() {
        const settingsToggler = document.getElementById('settings-toggler');
        const keySettings = document.querySelectorAll('.key');
        const saveSettings = document.getElementById('save-settings');

        settingsToggler.addEventListener('click', this.toggleDisplay);

        saveSettings.addEventListener('click', () => {

            this.settings.name = document.getElementById('name').value;
            const keySettings = document.querySelectorAll('.key');
            keySettings.forEach(keySetting => {
                this.settings.keyMapping[keySetting.getAttribute('data-action')] = keySetting.value;
            })
            localStorage.setItem('settings', JSON.stringify(this.settings));

            if (this.onSave) {
                this.onSave({
                    type: 'save-settings', value: { name: this.settings.name }
                });
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