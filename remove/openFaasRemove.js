'use strict';
const BbPromise = require('bluebird');
const OpenFaasSdk = require('../lib/openFaasSdk');

class OpenFaasRemove {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('openfaas');
    this.sdk = new OpenFaasSdk(this.serverless, 'func_functions');

    this.hooks = {
      'remove:remove': () => BbPromise.bind(this)
        .then(this.remove),
    };
  }

  remove() {
    return this.sdk.remove()
      .then(() => {
        this.serverless.cli.log('Deployed functions have been removed');
        return BbPromise.resolve();
      });
  }
}

module.exports = OpenFaasRemove;
