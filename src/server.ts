if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

import * as path from 'path';

// Initialize configuration before all locale stuff loaded.
import { loadConfig, config } from './config';
loadConfig();
config('root', path.resolve(__dirname, '../'));

import app from './app';
import logger from './utils/logger';

export default app().listen(config('port'), () => {
  logger.info(`App is running at http://localhost:${config('port')} in ${config('NODE_ENV')} mode.`);
});
