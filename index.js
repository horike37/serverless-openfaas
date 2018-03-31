'use strict';
const OpenFaasProvider = require('./provider/openFaasProvider');
const OpenFaasDeploy = require('./deploy/openFaasDeploy');

class ServerlessOpenfaas {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.serverless.pluginManager.addPlugin(OpenFaasProvider);
    this.serverless.pluginManager.addPlugin(OpenFaasDeploy);
  }
}
module.exports = ServerlessOpenfaas;
