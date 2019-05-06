import * as path from 'path';
import { config } from '../config';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { isEmpty } from 'lodash';
import { objToString } from '.';
import { isDevelopment } from './env';

/**
 * Current configured span of log file
 *
 * @var span
 */
const span = config('log.span');

/**
 * Folder for log file
 *
 * @var folder
 */
const folder = path.resolve(config('root'), 'storage/logs');

/**
 * Get current log file.
 *
 * @param span
 */
function getDatePattern(span: string = ''): string {
  let pattern = undefined;
  switch (span) {
    case 'day':
      pattern = 'YYYY-MM-DD'; break;
    case 'week':
      pattern = 'YYYY-MM-WW'; break;
    case 'month':
      pattern = 'YYYY-MM'; break;
  }

  return pattern;
}

const pattern = getDatePattern(span);
const transports: Transport[] = [];

if (pattern) {
  // error
  transports.push(new DailyRotateFile({
    dirname: folder,
    filename: 'error-%DATE%.log',
    datePattern: pattern,
    maxSize: '20m',
    level: 'error',
  }));
  // log
  transports.push(new DailyRotateFile({
    dirname: folder,
    filename: 'log-%DATE%.log',
    datePattern: pattern,
    maxSize: '20m',
    maxFiles: '30d',
  }));
} else {
  transports.push(new winston.transports.File({ filename: 'error.log', dirname: folder, level: 'error' }));
  transports.push(new winston.transports.File({ filename: 'all.log', dirname: folder }));
}


const consoleFormat = winston.format((info) => {
  const { level, message, timestamp, ...pending } = info;
  let content = `[${level}]`.padEnd(10, ' ') + `${timestamp} - ${message} `;
  content += isEmpty(pending) ? '' : objToString(pending);
  console.log(content);
  return false;
});

// console for development.
if (isDevelopment()) {
  transports.push(new winston.transports.Console({
    level: 'silly',
    format: winston.format.combine(
      winston.format.timestamp(),
      consoleFormat(),
    ),
  }));
}

/**
 * @var logger
 */
const logger = winston.createLogger({
  level: config('log.level'),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports,
});

export default logger;
