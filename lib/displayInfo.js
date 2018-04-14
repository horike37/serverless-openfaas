'use strict';
const BbPromise = require('bluebird');
const chalk = require('chalk');
const normalizeUrl = require('normalize-url');

module.exports = {
  displayInfo(functions) {
    this.gateway = normalizeUrl(this.serverless.service.provider.gateway);
    let message = '';
    message += `${chalk.yellow.underline('Service Information')}\n`;
    message += `${chalk.yellow('service:')} ${this.serverless.service.service}\n`;
    message += `${chalk.yellow('gateway:')} ${this.gateway}\n`;
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
  },
};
