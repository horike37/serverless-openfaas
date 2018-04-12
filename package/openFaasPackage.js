'use strict';
const BbPromise = require('bluebird');
const path = require('path');
const fse = BbPromise.promisifyAll(require('fs-extra'));
const Docker = BbPromise.promisifyAll(require('dockerode'));
const tar = require('tar-fs');
const _ = require('lodash');

class OpenFaasPackage {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('faas');
    this.docker = new Docker({
      Promise: BbPromise,
    });

    delete this.serverless.pluginManager.hooks['package:createDeploymentArtifacts'];
    this.hooks = {
      'before:package:createDeploymentArtifacts': () =>
        BbPromise.bind(this)
          .then(this.compileFunctions),
    };
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
  }

  dockerBuild(functionName) {
    const buildPath = path.join(this.serverless.config.servicePath, 'build', functionName);
    const image = this.serverless.service.functions[functionName].image;
    const tarStream = tar.pack(buildPath);
    return this.docker.buildImage(tarStream,
      { t: image })
    .then(stream => {
      this.serverless.cli.log(`Building: ${image}. Please wait..`);
      this.docker.modem.followProgress(stream, (error, outputs) =>
        BbPromise.each(outputs, (output) => {
          if (_.isString(output.stream) && !_.isEmpty(output.stream.replace(/\n/g, ''))) {
            this.serverless.cli.log(output.stream.replace(/\n/g, ''));
          } else if (!_.isEmpty(output.aux)) {
            this.serverless.cli.log(JSON.stringify(output.aux));
          }
        })
      );
      return BbPromise.resolve();
    });
  }
}

module.exports = OpenFaasPackage;
