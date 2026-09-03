/**
 * Secure & Resilient Storage Adapter
 *
 * Provides safe storage access for Web, Mobile Safari, and Android WebViews (AppsGeyser / Cordova / Capacitor).
 * Prevents unhandled SecurityError / QuotaExceededError crashes when DOM Storage is restricted or sandboxed,
 * without using insecure cookie dumping (avoiding HTTP 431 header overflow and token leakage).
 */

const inMemoryStore: Map<string, string> = new Map();
const inMemorySessionStore: Map<string, string> = new Map();

function checkStorageAvailability(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const storage = window[type];
    if (!storage) return false;
    const testKey = '__jossy_test_storage__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

const canUseLocalStorage = checkStorageAvailability('localStorage');
const canUseSessionStorage = checkStorageAvailability('sessionStorage');

export class SafeStorage {
  static getItem(key: string): string | null {
    if (canUseLocalStorage) {
      try {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      } catch (e) {
        // WebView or quota error fallback
      }
    }
    return inMemoryStore.has(key) ? inMemoryStore.get(key)! : null;
  }

  static setItem(key: string, value: string): void {
    if (canUseLocalStorage) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        // WebView or quota error fallback
      }
    }
    inMemoryStore.set(key, value);
  }

  static removeItem(key: string): void {
    if (canUseLocalStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {}
    }
    inMemoryStore.delete(key);
  }

  static clear(): void {
    if (canUseLocalStorage) {
      try {
        window.localStorage.clear();
      } catch (e) {}
    }
    inMemoryStore.clear();
  }
}

export class SafeSessionStorage {
  static getItem(key: string): string | null {
    if (canUseSessionStorage) {
      try {
        const val = window.sessionStorage.getItem(key);
        if (val !== null) return val;
      } catch (e) {}
    }
    return inMemorySessionStore.has(key) ? inMemorySessionStore.get(key)! : null;
  }

  static setItem(key: string, value: string): void {
    if (canUseSessionStorage) {
      try {
        window.sessionStorage.setItem(key, value);
      } catch (e) {}
    }
    inMemorySessionStore.set(key, value);
  }

  static removeItem(key: string): void {
    if (canUseSessionStorage) {
      try {
        window.sessionStorage.removeItem(key);
      } catch (e) {}
    }
    inMemorySessionStore.delete(key);
  }

  static clear(): void {
    if (canUseSessionStorage) {
      try {
        window.sessionStorage.clear();
      } catch (e) {}
    }
    inMemorySessionStore.clear();
  }
}
