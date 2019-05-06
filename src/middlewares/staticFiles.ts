import { posix, normalize } from 'path';
import { Stats, statSync } from 'fs';
import * as sendFile from 'koa-send';
import { Context, Middleware } from 'koa';
import { config } from '../config';
import logger from '../utils/logger';
import { HTTP_STATUS_CODE } from '../utils/constants';

class StaticFileServer {

  /**
   * options.
   *
   * @type {staticFileOptions}
   * @memberof StaticFileServer
   */
  options: staticFileOptions;

  /**
   * default options.
   *
   * @type {staticFileOptions}
   * @memberof StaticFileServer
   */
  defaultOptions: staticFileOptions = {
    location: '/static',
    path: '',
    sendDefault: true,
    root: config('root'),
  };

  /**
   * Regular expression used to parse static file from request path.
   *
   * @type {RegExp}
   * @memberof StaticFileServer
   */
  regex: RegExp = /(.*)/;

  /**
   * Prefix path with '/' and remove trailing '/'.
   *
   * @param {string} path
   * @returns {string}
   */
  formatPath(path: string): string {
    let result = normalize(`/${path}/`);

    if (result.endsWith('/')) {
      result = result.slice(0, -1);
    }

    return result;
  }

  /**
   * Get default file(index.html) inside a directory.
   *
   * @param {string} path
   * @returns {string}
   */
  getDefaultFile(path: string): string {
    return posix.join(path, 'index.html');
  }

  /**
   * Get stat of a file or directory
   *
   * @param {string} filePathFromRoot the relative path to root directory
   * @returns {Stats}
   */
  getStat(filePathFromRoot: string): Stats {
    return statSync(posix.join(this.options.root, filePathFromRoot));
  }

  async sendDefaultFile(ctx: Context, path: string) {
    const filePath = this.getDefaultFile(typeof path === 'string' ? path : this.options.location);

    try {
      if (this.getStat(filePath).isFile()) {
        logger.debug('Send default file.', { file: filePath });
        await sendFile(ctx, filePath, { root: this.options.root });
      }
    } catch (e) {
      ctx.throw(
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        'Failed to sent static file',
      );
    }
  }

  async staticRouter(ctx: Context, next: Next) {
    const matches = ctx.path.match(this.regex);

    // matching static file
    if (!!matches) {
      const filePathFromRoot = posix.join(this.options.location, matches[1]);

      try {
        const stat = this.getStat(filePathFromRoot);
        if (stat.isFile()) {
          logger.debug('Send static file.', { file: filePathFromRoot });
          await sendFile(ctx, filePathFromRoot, { root: this.options.root });
        } else if (stat.isDirectory() && this.options.sendDefault) {
          await this.sendDefaultFile(ctx, filePathFromRoot);
        }
      } catch (e) {
        // the path is not file or directory on the disk.
        await next();
      }
    } else {
      await next();
    }
  }

  /**
   * return a middleware that monitors on the path.
   * and return static file if detected.
   *
   * @param {staticFileOptions} [option={}]
   * @returns {Middleware}
   */
  serveStaticFiles(options: staticFileOptions): Middleware {
    this.options = Object.assign({}, this.defaultOptions, options);
    this.options.path = this.formatPath(this.options.path);

    this.regex = new RegExp(`^${this.options.path}(.*)$`);
    logger.info('Static server is on.', this.options);
    return this.staticRouter.bind(this);
  }
}

const server = new StaticFileServer();

export const sendDefaultFile = server.sendDefaultFile.bind(server);
export default server.serveStaticFiles.bind(server);
