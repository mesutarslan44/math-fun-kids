/**
 * App Version Utility
 * Tek bir kaynaktan versiyon bilgisini çeker
 */
const appJson = require('../../../app.json');

export const APP_VERSION = appJson.expo.version;
export const APP_NAME = appJson.expo.name;

export const getAppVersion = () => APP_VERSION;
export const getAppName = () => APP_NAME;
