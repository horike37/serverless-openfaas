'use strict';
const BbPromise = require('bluebird');
const normalizeUrl = require('normalize-url');
const OpenFaasSdk = require('../lib/openFaasSdk');
const _ = require('lodash');
const buildTemplate = require('../lib/buildTemplate');
const dockerBuild = require('../lib/dockerBuild');

class OpenFaasDeployFunction {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('faas');
    this.gateway = normalizeUrl(this.serverless.service.provider.gateway);
    this.sdk = new OpenFaasSdk(this.serverless, 'func_functions');

    this.hooks = {
      'deploy:function:packageFunction': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.packageFunction),
      'deploy:function:deploy': () => BbPromise.bind(this)
        .then(this.deployFunction),
    };

    Object.assign(
      this,
      buildTemplate,
      dockerBuild
    );
  }

  packageFunction() {
    return this.buildTemplate(this.options.function)
      .then(() => this.dockerBuild(this.options.function));
  }

  validate() {
    return BbPromise.try(() => {
      if (_.isEmpty(this.serverless.service.functions[this.options.function])) {
        throw new this.serverless.classes.Error('The function you specified does not exist.');
      }
    });
  }

  deployFunction() {
    return this.sdk.checkFunctionExists(this.options.function)
    .then(exists => {
      if (exists) {
        return this.sdk.updateFunction(this.options.function,
          this.serverless.service.functions[this.options.function].image);
      }
      return this.sdk.createFunction(this.options.function,
        this.serverless.service.functions[this.options.function].image);
    })
    .then(() => {
      this.serverless.cli.log(`Successfully deployed function: ${this.options.function}`);
      return BbPromise.resolve();
    });
  }
}

module.exports = OpenFaasDeployFunction;
