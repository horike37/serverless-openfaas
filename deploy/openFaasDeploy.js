'use strict';
const BbPromise = require('bluebird');
const path = require('path');
const fetch = require('node-fetch');

class OpenFaasDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('faas');
    this.gateway = this.serverless.service.provider.gateway;

    this.hooks = {
      'deploy:deploy': () => BbPromise.bind(this)
        .then(this.deploy),
    };
  }

  deploy() {
    console.log(path.join(this.serverless.service.provider.gateway, '/system/functions'));
    return BbPromise.resolve();
  }
}

module.exports = OpenFaasDeploy;
