'use strict';
const BbPromise = require('bluebird');
const path = require('path');
const _ = require('lodash');
const Docker = BbPromise.promisifyAll(require('dockerode'));
const tar = require('tar-fs');

module.exports = {
  dockerBuild(functionName) {
    this.docker = new Docker({
      Promise: BbPromise,
    });

    this.followProgress = BbPromise.promisify((stream, done) =>
      this.docker.modem.followProgress(stream, done),
      { context: this.docker.modem }
    );

    const buildPath = path.join(this.serverless.config.servicePath, 'build', functionName);
    const image = this.serverless.service.functions[functionName].image;
    const tarStream = tar.pack(buildPath);
    return this.docker.buildImage(tarStream,
      { t: image })
    .then(stream => {
      this.serverless.cli.log(`Building: ${image}. Please wait..`);
      return this.followProgress(stream).then((outputs) =>
        BbPromise.each(outputs, (output) => {
          if (_.isString(output.stream) && !_.isEmpty(output.stream.replace(/\n/g, ''))) {
            this.serverless.cli.log(output.stream.replace(/\n/g, ''));
          } else if (!_.isEmpty(output.aux)) {
            this.serverless.cli.log(JSON.stringify(output.aux));
          }
        })
      );
    });
  },
};
