'use strict';
const BbPromise = require('bluebird');

class OpenFaasDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('faas');

    this.hooks = {
      'before:deploy:deploy': () => BbPromise.bind(this),

      'deploy:deploy': () => BbPromise.bind(this),

      'after:deploy:deploy': () => BbPromise.bind(this)
        .then(this.deploy),
    };
  }

  deploy() {
    console.log(this.serverless);
  }
}

module.exports = OpenFaasDeploy;
