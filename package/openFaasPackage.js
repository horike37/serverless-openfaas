'use strict';
const BbPromise = require('bluebird');
const _ = require('lodash');
const buildTemplate = require('../lib/buildTemplate');
const dockerBuild = require('../lib/dockerBuild');

class OpenFaasPackage {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('faas');

    delete this.serverless.pluginManager.hooks['package:createDeploymentArtifacts'];
    this.hooks = {
      'package:createDeploymentArtifacts': () =>
        BbPromise.bind(this)
          .then(this.validate)
          .then(this.compileFunctions),
    };

    Object.assign(
      this,
      buildTemplate,
      dockerBuild
    );
  }

  validate() {
    const allFunctions = this.serverless.service.getAllFunctions();
    return BbPromise.each(
      allFunctions,
      functionName =>
        BbPromise.try(() => {
          if (_.isEmpty(this.serverless.service.functions[functionName].handler)) {
            const errorMessage = [
              'please provide the full path to your function\'s handler',
              ` in function "${functionName}" in serverless.yml.`,
            ].join('');
            throw new this.serverless.classes.Error(errorMessage);
          }

          if (_.isEmpty(this.serverless.service.provider.runtime) &&
            _.isEmpty(this.serverless.service.functions[functionName].runtime)) {
            const errorMessage = [
              'please provide runtime to provider section or',
              ` in function "${functionName}" in serverless.yml.`,
            ].join('');
            throw new this.serverless.classes.Error(errorMessage);
          }

          if (_.isEmpty(this.serverless.service.functions[functionName].image)) {
            const errorMessage = [
              'please provide a valid image name for your Docker image',
              ` in function "${functionName}" in serverless.yml.`,
            ].join('');
            throw new this.serverless.classes.Error(errorMessage);
          }
        }
      )
    );
  }

  compileFunctions() {
    const allFunctions = this.serverless.service.getAllFunctions();
    return BbPromise.each(
      allFunctions,
      functionName => this.buildTemplate(functionName)
    ).then(() => BbPromise.each(
      allFunctions,
      functionName => this.dockerBuild(functionName)
    ));
  }
}

module.exports = OpenFaasPackage;
