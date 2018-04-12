'use strict';
const BbPromise = require('bluebird');
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
    const endpoint = `${this.serverless.service.provider.gateway}/system/functions`;
    const allFunctions = this.serverless.service.getAllFunctions();
    return BbPromise.each(
      allFunctions,
      functionName =>
        fetch(endpoint, {
          method: 'PUT',
          body: JSON.stringify({
            service: functionName,
            image: this.serverless.service.functions[functionName].image,
            network: 'func_functions',
          }),
          headers: { 'Content-Type': 'application/json' },
        })
        .then(res => {
          console.log(res);
        })
    );
  }
}

module.exports = OpenFaasDeploy;
