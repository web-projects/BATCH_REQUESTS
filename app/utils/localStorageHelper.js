export default class LocalStorageHelper {
    supportsLocalStorage() {
        try {
            // Quickly add and remove the item from local storage.
            const storage = window['localStorage'];
            const dummyVar = '__storage_test__';

            storage.setItem(dummyVar, dummyVar);
            storage.removeItem(dummyVar);
            return true;
        } catch (e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 || 
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage.length !== 0;
        }
    }

    getItem(key) {
        return localStorage.getItem(key);
    }

    setItem(key, value) {
        localStorage.setItem(key, value);
    }

    removeItem(key) {
        localStorage.removeItem(key);
    }

    clear() {
        localStorage.clear();
    }
}