/**
 * App Version Utility
 * Tek bir kaynaktan versiyon bilgisini çeker
 */

// app.json'dan versiyon bilgisini al (require kullanarak)
let appJson;
try {
    appJson = require('../../../app.json');
} catch (e) {
    // Fallback if require fails
    appJson = { expo: { version: '2.0.3', name: 'Bilsem ve Eğlenceli Matematik' } };
}

export const APP_VERSION = appJson?.expo?.version || '2.0.3';
export const APP_NAME = appJson?.expo?.name || 'Bilsem ve Eğlenceli Matematik';

export const getAppVersion = () => APP_VERSION;
export const getAppName = () => APP_NAME;
