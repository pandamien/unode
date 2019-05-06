import { config } from '../config';

/**
 * Detect whether a given string is empty.
 *
 * @param {string} str
 * @returns {boolean}
 */
function isNonEmptyString(str: string): boolean {
  return typeof str === 'string' && str.trim().length != 0;
}

/**
 * Get project related url.
 *
 * @param {string} [path='']
 * @param {boolean} [fromRoot=false]
 * @returns {string}
 */
export function url(path: string = '', fromRoot: boolean = false): string {
  const baseUrl = `${config('protocol')}://${config('host')}`;
  const basePath: string = fromRoot ? '' : config('path') || '';
  const $path = basePath.split('/').filter(isNonEmptyString);
  const $extra = path.split('/').filter(isNonEmptyString);

  return baseUrl + '/' + [].concat($path, $extra).join('/');
}

/**
 * Flat object to string value.
 *
 * @param {Object} obj
 * @returns {string}
 */
export function objToString(obj: Object): string {
  const keys = Object.getOwnPropertyNames(obj);
  if (keys.length === 0) {
    return '{}';
  }

  function getValue(value: any): string {
    const type = typeof value;
    if (type === 'string') {
      return value || '(empty string)';
    } else if (type === 'number') {
      return value.toString();
    } else if (type === 'function') {
      return '(function)';
    } else if (Array.isArray(value)) {
      return `[${value.map(getValue).join(', ')}]`;
    } else if (type === 'object') {
      return objToString(value);
    } else if (type === 'undefined') {
      return '(undefined)';
    }

    return value;
  }

  return `{ ${keys.map(key => `${key}: ${getValue(obj[key])}`).join(', ')} }`;
}

/**
 * Delay function.
 *
 * @param {number} ms
 * @returns {Promise<never>}
 */
export function delay(ms: number): Promise<never> {
  return new Promise<never>(done => {
    setTimeout(done, ms);
  });
}
