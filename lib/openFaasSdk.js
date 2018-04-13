'use strict';
const normalizeUrl = require('normalize-url');
const BbPromise = require('bluebird');
const fetch = require('node-fetch');

class OpenFaasSdk {
  constructor(serverless, network) {
    this.serverless = serverless;
    this.network = network;
    this.allFunctions = this.serverless.service.getAllFunctions();
    this.gateway = normalizeUrl(this.serverless.service.provider.gateway);
    this.endpoint = {
      functions: `${this.gateway}/system/functions`,
    };
  }

  deploy() {
    return BbPromise.each(
      this.allFunctions,
      functionName =>
        this.checkFunctionExists(functionName)
        .then(exists => {
          if (exists) {
            return this.updateFunction(functionName,
              this.serverless.service.functions[functionName].image);
          }
          return this.createFunction(functionName,
            this.serverless.service.functions[functionName].image);
        }
      )
    );
  }

  remove() {
    return BbPromise.each(
      this.allFunctions,
      functionName =>
        this.checkFunctionExists(functionName)
        .then(exists => {
          if (exists) {
            return this.removeFunction(functionName);
          }
          return BbPromise.resolve();
        }
      )
    );
  }

  removeFunction(functionName) {
    return fetch(this.endpoint.functions, {
      method: 'DELETE',
      body: JSON.stringify({
        functionName,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getDeployedFunctions() {
    return fetch(this.endpoint.functions, {
      method: 'GET',
    })
    .then(res => res.json());
  }

  createFunction(functionName, image) {
    return fetch(this.endpoint.functions, {
      method: 'POST',
      body: JSON.stringify({
        service: functionName,
        image,
        network: this.network,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  updateFunction(functionName, image) {
    return fetch(this.endpoint.functions, {
      method: 'PUT',
      body: JSON.stringify({
        service: functionName,
        image,
        network: this.network,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  checkFunctionExists(functionName) {
    let exists = false;
    return this.getDeployedFunctions().then(deployedFunctions =>
      BbPromise.each(
        deployedFunctions,
        deployedFunction => {
          if (deployedFunction.name === functionName) {
            exists = true;
          }
        }
      ).then(() => exists)
    );
  }
}

module.exports = OpenFaasSdk;
