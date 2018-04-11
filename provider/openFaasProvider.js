'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');

const BbPromise = require('bluebird');
const _ = require('lodash');

const constants = {
  providerName: 'faas',
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
