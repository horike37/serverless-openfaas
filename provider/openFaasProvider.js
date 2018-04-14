'use strict';

const constants = {
  providerName: 'openfaas',
};

class openFaasProvider {
  static getProviderName() {
    return constants.providerName;
  }

  constructor(serverless) {
    this.serverless = serverless;
    this.provider = this;
    this.serverless.setProvider(constants.providerName, this);
  }
}

module.exports = openFaasProvider;
