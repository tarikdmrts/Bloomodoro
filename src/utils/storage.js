export const fetchStorage = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (result) => {
      resolve(result);
    });
  });
};

export const updateStorage = (data) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(data, () => {
      resolve();
    });
  });
};

export const storageListener = (callback) => {
  const listener = (changes) => {
    callback(changes);
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
};

export const migrateLocalToSync = () => {
  return new Promise((resolve) => {
    // Daha önce göç yapılmış mı kontrol et
    chrome.storage.sync.get(['migration_v1_completed'], (syncResult) => {
      if (syncResult.migration_v1_completed) {
        resolve();
        return;
      }

      // Local'deki tüm verileri al
      chrome.storage.local.get(null, (localData) => {
        if (Object.keys(localData).length > 0) {
          // Sync'e taşı ve tamamlandı bayrağını ekle
          chrome.storage.sync.set({ ...localData, migration_v1_completed: true }, () => {
            console.log('Migration to sync storage completed.');
            resolve();
          });
        } else {
          // Veri yoksa bile bayrağı ayarla ki tekrar bakmasın
          chrome.storage.sync.set({ migration_v1_completed: true }, () => {
            resolve();
          });
        }
      });
    });
  });
};
