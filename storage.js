const Storage = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    },

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    getTheme() {
        return localStorage.getItem('crimsonTheme') || 'garden';
    },

    setTheme(theme) {
        localStorage.setItem('crimsonTheme', theme);
    }
};