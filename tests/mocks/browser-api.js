// Mock for browser.storage.local API (WebExtension polyfill)
const storageData = {};

export const browser = {
  storage: {
    local: {
      get: vi.fn(async (keys) => {
        if (typeof keys === 'string') {
          return { [keys]: storageData[keys] };
        }
        if (Array.isArray(keys)) {
          const result = {};
          keys.forEach(key => {
            if (key in storageData) {
              result[key] = storageData[key];
            }
          });
          return result;
        }
        return { ...storageData };
      }),
      set: vi.fn(async (items) => {
        Object.assign(storageData, items);
      }),
      remove: vi.fn(async (keys) => {
        const keysArray = Array.isArray(keys) ? keys : [keys];
        keysArray.forEach(key => delete storageData[key]);
      }),
    },
  },
};

export function clearStorageData() {
  Object.keys(storageData).forEach(key => delete storageData[key]);
}
