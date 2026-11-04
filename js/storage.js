
/* =========================================
   CRIMSON STUDENT SPACE
   LOCAL STORAGE
========================================= */

const Storage = {
    get(key, fallback = []) {
        try {
            const saved = localStorage.getItem(`crimson_${key}`);
            return saved ? JSON.parse(saved) : fallback;
        } catch (error) {
            console.error("Помилка читання даних:", error);
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(`crimson_${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Помилка збереження даних:", error);
            alert("Не вдалося зберегти дані у браузері.");
            return false;
        }
    },

    remove(key) {
        localStorage.removeItem(`crimson_${key}`);
    }
};
