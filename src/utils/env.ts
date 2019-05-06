import { ENV } from './constants';

/**
 * Get current NODE_ENV.
 *
 * @returns {string}
 */
export function env(): string {
  const e = ENV[process.env.NODE_ENV.toLocaleLowerCase()];
  if (!e) {
    throw new Error('Unknown NODE_ENV value. Must be one of \n' + Object.keys(ENV).join('\n'));
  }

  return e;
}

/**
 * Detect whether current NODE_ENV is development.
 *
 * @returns {boolean}
 */
export function isDevelopment(): boolean {
  return env() === 'development';
}

/**
 * Detect whether current NODE_ENV is production.
 *
 * @returns {boolean}
 */
export function isProduction(): boolean {
  return env() === 'production';
}

/**
 * Detect whether current NODE_ENV is test.
 *
 * @returns {boolean}
 */
export function isTest(): boolean {
  return env() === 'test';
}
