'use strict';
const BbPromise = require('bluebird');
const normalizeUrl = require('normalize-url');
const OpenFaasSdk = require('../lib/openFaasSdk');
const displayInfo = require('../lib/displayInfo');

class OpenFaasDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('openfaas');
    this.gateway = normalizeUrl(this.serverless.service.provider.gateway);
    this.sdk = new OpenFaasSdk(this.serverless, 'func_functions');

    Object.assign(
      this,
      displayInfo
    );

    this.hooks = {
      'before:deploy:deploy': () => BbPromise.bind(this)
        .then(this.deploy),
    };
  }

  deploy() {
    return this.sdk.deploy()
      .then(() => this.sdk.getDeployedFunctions())
      .then(functions => this.displayInfo(functions));
  }
}

module.exports = OpenFaasDeploy;
