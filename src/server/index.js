/* eslint class-methods-use-this: 0 */
const _ = require('lodash');
const http = require('http');
const Koa = require('koa');
// Localization
const locale = require('koa-locale');
const i18n = require('koa-i18n');

const { api, locales } = require('../config');
const utils = require('../common/utils');

class Server {
  /**
   *
   * @param options
   * {
   *     name:
   *     port:
   *     hooks:
   *     middlewares:
   *     onStart:
   *     onStarted:
   *     onEnd:
   *     onError:
   * }
   */
  constructor(options = {}) {
    this.options = utils.merge(
      {
        port: process.env.PORT || api.port
      },
      options
    );

    // Init global field
    global.Api = {};
    this._applyGlobals();

    // Init koa app
    this._app = this._createKoaInstance();
    this._server = http.createServer(this._app.callback());
  }

  _createKoaInstance() {
    const app = new Koa();
    // General
    app.proxy = true;
    // Localization config
    locale(app);
    app.use(
      i18n(app, {
        locales: locales.supportedLocales,
        directory: locales.dataPath,
        extension: locales.dataExtension,
        register: global.Api.locales,
        updateFiles: false,
        modes: [
          'query', //  optional detect querystring - `/?locale=en`
          'header' //  optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
        ]
      })
    );

    return app;
  }

  _applyGlobals() {
    const env = process.env.NODE_ENV || 'development';

    _.set(global, 'Api.locales', {});
    _.set(global, 'Api.params.inDevelopment', utils.inDevelopment());
  }

  _applyHooks() {
    const hooks = require('./hooks');
    hooks.forEach((item) => {
      if (item.type === 'context') {
        this._app.context[item.hook.name] = item.hook.obj;
      } else if (item.type === 'global') {
        global.Api[item.hook.name] = item.hook.obj;
      }
    });
  }

  _applyMiddlewares() {
    const middlewares = require('./middlewares');
    middlewares.forEach((item) => {
      this._app.use(item);
    });
  }

  async start() {
    const { name, port, onStart, onStarted, onError } = this.options;

    if (onError) {
      this._app.on('error', onError);
    }

    if (onStart) {
      await onStart(this._app);
    }

    this._applyHooks();
    this._applyMiddlewares();

    if (onStarted) {
      await onStarted();
    }

    await new Promise((resolve, reject) => {
      this._server.on('error', (err) => {
        if (err.syscall !== 'listen') {
          return reject(err);
        }

        switch (err.code) {
          case 'EACCES':
            console.error(`port ${err.port} requires elevated privileges`);
            process.exit(1);
            break;
          case 'EADDRINUSE':
            console.error(`port ${err.port} is already in use`);
            process.exit(1);
            break;
          default:
            if (onError) {
              onError(err);
            }
            reject(err);
        }
        return true;
      });

      this._server.on('listening', () => {
        resolve();
      });

      this._server.listen(port);
    });

    const info = this._server.address();
    const env = process.env.NODE_ENV || 'development';
    const lHost = info.address === '::' ? 'localhost' : info.address;
    const lPort = info.port;

    console.log(`API [${name}] started at [${lHost}:${lPort}] on [${env}]`);
  }

  async stop() {
    const { onEnd } = this.options;
    if (onEnd) {
      await onEnd();
    }

    if (this._server && this._server.listening) {
      this._server.close();
    }
  }
}

module.exports = Server;
