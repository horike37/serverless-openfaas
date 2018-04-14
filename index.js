'use strict';
const OpenFaasProvider = require('./provider/openFaasProvider');
const OpenFaasDeploy = require('./deploy/openFaasDeploy');
const OpenFaasPackage = require('./package/openFaasPackage');
const OpenFaasRemove = require('./remove/openFaasRemove');
const OpenFaasInvoke = require('./invoke/openFaasInvoke');
const OpenFaasInfo = require('./info/openFaasInfo');
const OpenFaasDeployFunction = require('./deployFunction/openFaasDeployFunction');

class ServerlessOpenfaas {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.serverless.pluginManager.addPlugin(OpenFaasProvider);
    this.serverless.pluginManager.addPlugin(OpenFaasDeploy);
    this.serverless.pluginManager.addPlugin(OpenFaasPackage);
    this.serverless.pluginManager.addPlugin(OpenFaasInvoke);
    this.serverless.pluginManager.addPlugin(OpenFaasRemove);
    this.serverless.pluginManager.addPlugin(OpenFaasInfo);
    this.serverless.pluginManager.addPlugin(OpenFaasDeployFunction);
  }
}
module.exports = ServerlessOpenfaas;
