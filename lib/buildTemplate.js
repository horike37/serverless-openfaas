'use strict';
const BbPromise = require('bluebird');
const fse = BbPromise.promisifyAll(require('fs-extra'));
const path = require('path');
const _ = require('lodash');

module.exports = {
  buildTemplate(functionName) {
    const handler = this.serverless.service.functions[functionName].handler;
    const tempPath = path.join(this.serverless.config.servicePath, 'build', functionName);
    const functionPath = path.join(tempPath, 'function');
    const runtime = _.isEmpty(this.serverless.service.functions[functionName].runtime) ?
      this.serverless.service.provider.runtime :
      this.serverless.service.functions[functionName].runtime;
    const templatePath = path.join(this.serverless.config.servicePath, 'template', runtime);
    this.serverless.cli.log(`Preparing: ${handler} ${functionPath}`);
    return fse.copy(templatePath, tempPath)
      .then(() => fse.copy(handler, functionPath));
  },
};
