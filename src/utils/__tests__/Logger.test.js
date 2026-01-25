import Logger from '../Logger';

// Mock __DEV__
const originalDev = global.__DEV__;

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.console = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    };
  });

  afterEach(() => {
    global.__DEV__ = originalDev;
  });

  describe('in development mode', () => {
    beforeEach(() => {
      global.__DEV__ = true;
    });

    it('should log messages', () => {
      Logger.log('test message');
      expect(console.log).toHaveBeenCalledWith('[LOG]', 'test message');
    });

    it('should warn messages', () => {
      Logger.warn('test warning');
      expect(console.warn).toHaveBeenCalledWith('[WARN]', 'test warning');
    });

    it('should always log errors', () => {
      Logger.error('test error');
      expect(console.error).toHaveBeenCalledWith('[ERROR]', 'test error');
    });
  });

  describe('in production mode', () => {
    beforeEach(() => {
      global.__DEV__ = false;
    });

    it('should not log messages', () => {
      Logger.log('test message');
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should still log errors', () => {
      Logger.error('test error');
      expect(console.error).toHaveBeenCalledWith('[ERROR]', 'test error');
    });
  });
});
