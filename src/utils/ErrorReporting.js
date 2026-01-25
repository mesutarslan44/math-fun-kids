/**
 * Error Reporting Utility
 * Sentry entegrasyonu için wrapper (opsiyonel)
 */

import Logger from './Logger';

let Sentry = null;
let isInitialized = false;

/**
 * Initialize Sentry (only in production, if available)
 */
export const initErrorReporting = async () => {
    try {
        // Only initialize in production builds
        if (__DEV__) {
            Logger.info('Error reporting disabled in development mode');
            return;
        }

        // Try to load Sentry dynamically (if installed)
        // This will fail silently if Sentry is not installed
        try {
            // Dynamic import - will only work if @sentry/react-native is installed
            const SentryModule = await import('@sentry/react-native').catch(() => null);
            
            if (SentryModule && SentryModule.default) {
                Sentry = SentryModule.default;
                const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
                
                if (dsn) {
                    Sentry.init({
                        dsn: dsn,
                        enableInExpoDevelopment: false,
                        debug: false,
                        environment: 'production',
                    });
                    isInitialized = true;
                    Logger.info('Error reporting initialized');
                } else {
                    Logger.info('Sentry DSN not configured, error reporting disabled');
                }
            }
        } catch (error) {
            // Sentry not installed or failed to load - this is OK
            Logger.info('Sentry not available, error reporting disabled');
        }
    } catch (error) {
        Logger.error('Failed to initialize error reporting', error);
    }
};

/**
 * Capture exception
 */
export const captureException = (error, context = {}) => {
    Logger.error('Exception captured', error, context);
    
    if (isInitialized && Sentry) {
        Sentry.captureException(error, {
            extra: context,
        });
    }
};

/**
 * Capture message
 */
export const captureMessage = (message, level = 'info') => {
    Logger.log(`Message captured [${level}]:`, message);
    
    if (isInitialized && Sentry) {
        Sentry.captureMessage(message, level);
    }
};

/**
 * Set user context
 */
export const setUserContext = (user) => {
    if (isInitialized && Sentry) {
        Sentry.setUser(user);
    }
};

/**
 * Clear user context
 */
export const clearUserContext = () => {
    if (isInitialized && Sentry) {
        Sentry.setUser(null);
    }
};
