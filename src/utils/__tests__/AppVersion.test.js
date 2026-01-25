import { APP_VERSION, APP_NAME, getAppVersion, getAppName } from '../AppVersion';

describe('AppVersion', () => {
  it('should export APP_VERSION', () => {
    expect(APP_VERSION).toBeDefined();
    expect(typeof APP_VERSION).toBe('string');
  });

  it('should export APP_NAME', () => {
    expect(APP_NAME).toBeDefined();
    expect(typeof APP_NAME).toBe('string');
  });

  it('getAppVersion should return version', () => {
    expect(getAppVersion()).toBe(APP_VERSION);
  });

  it('getAppName should return name', () => {
    expect(getAppName()).toBe(APP_NAME);
  });
});
