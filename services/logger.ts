/**
 * Simple Logger utility for robust debug handling
 */

const IS_DEV = __DEV__;

export const Logger = {
    log: (message: string, ...args: any[]) => {
        if (IS_DEV) {
            console.log(`[LOG] ${message}`, ...args);
        }
    },

    warn: (message: string, ...args: any[]) => {
        if (IS_DEV) {
            console.warn(`[WARN] ${message}`, ...args);
        }
        // In production, you might send this to a service like Sentry
    },

    error: (message: string, error?: any, ...args: any[]) => {
        console.error(`[ERROR] ${message}`, error, ...args);
        // Always log errors, potentially send to Sentry/Bugsnag in production
    },

    debug: (message: string, data?: any) => {
        if (IS_DEV) {
            console.debug(`[DEBUG] ${message}`, data);
        }
    },

    db: (query: string, params?: any[]) => {
        if (IS_DEV) {
            console.log(`[SQL] ${query}`, params || '');
        }
    }
};
