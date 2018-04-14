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
- sls package: Build your function docker images
- sls deploy: Deploy functions to OpenFaaS
- sls deploy function -f <your-function>: Deploy function you specify to OpenFaaS
- sls info: Get infomation of your OpenFaaS
- sls invoke -f <your-function> -d <your-data>:
- sls remove: Remove functions from OpenFaaS
