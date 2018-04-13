'use strict';
const BbPromise = require('bluebird');
const OpenFaasSdk = require('../lib/openFaasSdk');

class OpenFaasDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('faas');
    this.sdk = new OpenFaasSdk(this.serverless, 'func_functions');

    this.hooks = {
      'deploy:deploy': () => BbPromise.bind(this)
        .then(this.deploy),
    };
  }

  deploy() {
    return this.sdk.deploy();
  }
}

module.exports = OpenFaasDeploy;
