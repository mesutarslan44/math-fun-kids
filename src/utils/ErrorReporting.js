/**
 * Error Reporting Utility
 * Sentry entegrasyonu için wrapper
 */

import Logger from './Logger';

let Sentry = null;
let isInitialized = false;

/**
 * Initialize Sentry (only in production)
 */
export const initErrorReporting = async () => {
    try {
        // Only initialize in production builds
        if (__DEV__) {
            Logger.info('Error reporting disabled in development mode');
            return;
        }

        // Dynamic import to avoid bundling Sentry in dev
        const SentryModule = await import('@sentry/react-native');
        Sentry = SentryModule.default;

        if (Sentry) {
            Sentry.init({
                dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '', // Set this in your environment
                enableInExpoDevelopment: false,
                debug: false,
                environment: __DEV__ ? 'development' : 'production',
            });
            isInitialized = true;
            Logger.info('Error reporting initialized');
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
