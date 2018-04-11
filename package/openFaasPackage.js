'use strict';
const BbPromise = require('bluebird');
const path = require('path');
const fse = BbPromise.promisifyAll(require('fs-extra'));
const _ = require('lodash');

class OpenFaasPackage {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('faas');

    this.hooks = {
      'before:package:compileFunctions': () => BbPromise.bind(this)
        .then(this.compileFunctions),
    };
  }

  compileFunctions() {
    const allFunctions = this.serverless.service.getAllFunctions();
    return BbPromise.each(
      allFunctions,
      functionName => this.compileFunction(functionName)
    );
  }

  compileFunction(functionName) {
    const tempPath = path.join(this.serverless.config.servicePath, 'build', functionName);
    const functionPath = path.join(tempPath, 'function');
    const runtime = _.isEmpty(this.serverless.service.functions[functionName].runtime) ?
      this.serverless.service.provider.runtime :
      this.serverless.service.functions[functionName].runtime;
    const templatePath = path.join(this.serverless.config.servicePath, 'template', runtime);
    return fse.copy(templatePath, tempPath)
      .then(() => fse.copy(this.serverless.service.functions[functionName].handler, functionPath));
  }
}

module.exports = OpenFaasPackage;
