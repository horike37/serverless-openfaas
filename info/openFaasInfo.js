'use strict';
const BbPromise = require('bluebird');
const OpenFaasSdk = require('../lib/openFaasSdk');
const displayInfo = require('../lib/displayInfo');

class OpenFaasDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('faas');
    this.sdk = new OpenFaasSdk(this.serverless, 'func_functions');

    Object.assign(
      this,
      displayInfo
    );

    this.hooks = {
      'info:info': () => BbPromise.bind(this)
        .then(this.info),
    };
  }

  info() {
    return this.sdk.getDeployedFunctions()
      .then(functions => this.displayInfo(functions));
  }
}

module.exports = OpenFaasDeploy;
