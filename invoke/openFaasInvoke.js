'use strict';
const path = require('path');
const BbPromise = require('bluebird');
const OpenFaasSdk = require('../lib/openFaasSdk');

class OpenFaasInvoke {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('faas');
    this.sdk = new OpenFaasSdk(this.serverless, 'func_functions');

    this.hooks = {
      'invoke:invoke': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.parseInputDate)
        .then(this.invoke),
    };
  }

  validate() {
    return BbPromise.try(() =>
      this.sdk.checkFunctionExists(this.options.function)
        .then(exists => {
          if (!exists) {
            throw new this.serverless.classes.Error('The function you specified does not exist.');
          }
        })
    );
  }

  parseInputDate() {
    return BbPromise.try(() => {
      if (this.options.path) {
        const absolutePath = path.isAbsolute(this.options.path) ?
          this.options.path :
        path.join(this.serverless.config.servicePath, this.options.path);
        return this.serverless.utils.fileExists(absolutePath)
          .then(exists => {
            if (!exists) {
              throw new this.serverless.classes.Error('The file you provided does not exist.');
            }

            return this.serverless.utils.readFile(absolutePath)
              .then(data => {
                this.options.data = data;
                return BbPromise.resolve();
              });
          });
      }
      return BbPromise.resolve();
    });
  }

  invoke() {
    return this.sdk.invoke(this.options.function, this.options.data)
      .then(res => {
        this.serverless.cli.consoleLog(JSON.stringify(res));
        return BbPromise.resolve();
      });
  }
}

module.exports = OpenFaasInvoke;
