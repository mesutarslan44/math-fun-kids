/**
 * Logger Utility
 * Production'da console.log'ları devre dışı bırakır
 */

const IS_DEV = __DEV__;

class Logger {
    static log(...args) {
        if (IS_DEV) {
            console.log('[LOG]', ...args);
        }
    }

    static error(...args) {
        // Error'lar her zaman loglanır (production'da da)
        console.error('[ERROR]', ...args);
    }

    static warn(...args) {
        if (IS_DEV) {
            console.warn('[WARN]', ...args);
        }
    }

    static info(...args) {
        if (IS_DEV) {
            console.info('[INFO]', ...args);
        }
    }

    static debug(...args) {
        if (IS_DEV) {
            console.debug('[DEBUG]', ...args);
        }
    }
}

export default Logger;
