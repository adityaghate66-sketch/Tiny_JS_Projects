/**
 * Phase 2: Storage Utility
 * LocalStorage Manager with fallback to sessionStorage
 */

class StorageManager {
    constructor(prefix = 'phase2') {
        this.prefix = prefix;
    }

    _getKey(key) {
        return `${this.prefix}_${key}`;
    }

    set(key, value, type = 'json') {
        try {
            const item = {
                key: this._getKey(key),
                value: type === 'json' ? JSON.stringify(value) : value,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(item.key, item.value);
            return true;
        } catch (e) {
            console.error('Storage write failed:', e);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this._getKey(key));
            if (item === null) return defaultValue;

            // Try to parse as JSON first
            try {
                return JSON.parse(item);
            } catch {
                return item;
            }
        } catch (e) {
            console.error('Storage read failed:', e);
            return defaultValue;
        }
    }

    remove(key) {
        localStorage.removeItem(this._getKey(key));
    }

    clearAll() {
        Object.keys(localStorage)
            .filter(k => k.startsWith(this.prefix))
            .forEach(k => localStorage.removeItem(k));
    }

    // Auto-save helper
    autoSave(key, value, delay = 500) {
        clearTimeout(this._saveTimeout);
        this._saveTimeout = setTimeout(() => {
            this.set(key, value);
        }, delay);
    }
}

export default new StorageManager('tools');
export { StorageManager };