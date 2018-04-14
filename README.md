# Serverless OpenFaaS
## Prepare
### Create OpenFaaS Cluster
Setup OpenFaaS according to https://github.com/openfaas/workshop/blob/master/lab1.md

## Getting started

### Install the Serverless Framework
```
$ npm install -g serverless
```

### Setup a sample project for OpenFaaS
```
$ sls install --url https://github.com/horike37/serverless-openfaas-template
$ cd ./serverless-openfaas-template
$ npm install
```

## Supported command
```
sls package: Build your function docker images
sls deploy: Deploy functions to OpenFaaS
sls deploy function -f <your-function>: Deploy function you specify to OpenFaaS
sls info: Get infomation of your OpenFaaS
sls invoke -f <your-function> -d <your-data>:
sls remove: Remove functions from OpenFaaS
```

## Improvements from the original one
- Updated this provider name to `openfaas` from `faas` since in general, faas means function as a service, I feel the context is a bit too widely.
- Created OpenFaaS SDK instead of invoking `faas-cli` internally with spawn method since the behavior depends on library versions which a user Individually installs. Imo libraries should be managed inside package.json.
- Updated to use `dockerode` instead of docker command for building images
- Updated to provide `sls info` command instead of `sls deploy list` since actually `sls deploy list` is a command which shows versions list of a deployed function. To show infomation of your deployed functions, it would be good to provide `sls info` command
- Abolished `sls init` command since the framework is just for function deployment tool, however, this command is for setting up OpenFaaS cluster, so would be unnecessity in this integration
- Updated all messages format according to the framework provided
- Updated getting started easier with according to the framework format
