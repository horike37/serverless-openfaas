'use strict';
const BbPromise = require('bluebird');
const chalk = require('chalk');
const normalizeUrl = require('normalize-url');
const OpenFaasSdk = require('../lib/openFaasSdk');

class OpenFaasDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('faas');
    this.gateway = normalizeUrl(this.serverless.service.provider.gateway);
    this.sdk = new OpenFaasSdk(this.serverless, 'func_functions');

    this.hooks = {
      'before:deploy:deploy': () => BbPromise.bind(this)
        .then(this.deploy),
    };
  }

  deploy() {
    return this.sdk.deploy()
      .then(() => this.sdk.getDeployedFunctions())
      .then(functions => {
        let message = '';
        message += `${chalk.yellow.underline('Service Information')}\n`;
        message += `${chalk.yellow('gateway:')} ${this.serverless.service.provider.gateway}\n`;
        message += `${chalk.yellow('endpoints:')}\n`;
        BbPromise.each(functions, f => {
          message += `  POST - ${this.gateway}/function/${f.name}\n`;
        }).then(() => {
          message += `${chalk.yellow('functions:')}\n`;
          return BbPromise.resolve();
        }).then(() =>
          BbPromise.each(functions, f => {
            message += `  ${f.name}: ${f.image}\n`;
          })
        ).then(() => {
          this.serverless.cli.consoleLog(message);
          return BbPromise.resolve();
        });
      });
  }
}

module.exports = OpenFaasDeploy;
