import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { merge, get, set } from 'lodash';
import { resolve } from 'path';
import { env } from '../utils/env';

class Config {
  config: IOptions;

  /**
   * Parse configuration from another file.
   *
   * Please mind this function will remove all configuration load from `env.yaml` and `env.{env()}.yaml`.
   *
   * @param path path of configuration file.
   */
  parse(filePath: string) {
    try {
      const config: IOptions = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
      config.NODE_ENV = env();

      this.config = config;
    } catch (e) {
      console.log('Exception occurs when parsing configuration file');
      console.log(e.stack);
    }
  }

  /**
   * Detect whether given path is located to a file.
   *
   * @param {string} filePath
   * @returns {boolean}
   */
  isFile(filePath: string): boolean {
    try {
      const stat = fs.statSync(filePath);
      return stat.isFile();
    } catch (e) {
      return false;
    }
  }

  /**
   * Loading default config files.
   *
   * The default config files are `env.yaml` and `env.{env()}.yaml`, where `env()` is a utility function
   * to detect and normalize current NODE_ENV.
   */
  load() {
    const NODE_ENV = env();
    const defaultConfigPath = resolve(__dirname, '../../');
    const configFile = `${defaultConfigPath}/env.yaml`;
    const envConfigFile = `${defaultConfigPath}/env.${NODE_ENV}.yaml`;

    if (!this.isFile(configFile)) {
      throw new Error('Config file env.yaml is not found.');
    }

    try {
      let config: IOptions = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
      config.NODE_ENV = NODE_ENV;

      // If env.NODE_ENV.yaml file is detected, load it and override env config.
      if (this.isFile(envConfigFile)) {
        const envConfig: IOptions = yaml.safeLoad(fs.readFileSync(envConfigFile, 'utf8'));
        config = merge(config, envConfig);
      }

      this.config = config;
      return this.config;
    } catch (e) {
      e.message = 'Exception occurs when parsing configuration file';
      throw e;
    }
  }

  /**
   * Get/Set progress config.
   *
   * @see https://lodash.com/docs/4.17.11#get
   * @see https://lodash.com/docs/4.17.11#set
   * @param {string} key
   * @param {string} value
   */
  helper (key?: string, value?: any): string | object | number | any {
    if (key === undefined) {
      return this.config;
    }

    if (value === undefined) {
      return get(this.config, key, undefined);
    } else {
      set(this.config, key, value);
    }
  }
}

const configInstance = new Config();

export const parse = configInstance.parse.bind(configInstance);
export const config = configInstance.helper.bind(configInstance);
export const loadConfig = configInstance.load.bind(configInstance);
