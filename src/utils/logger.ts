
const isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args: any[]): void => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  warn: (...args: any[]): void => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  info: (...args: any[]): void => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};
