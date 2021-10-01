# openidl local reference implementation

use this project to run the services for loading samples etc

1. setup the environment by installing dependencies and creating a proxy
1. set environments with `set-environment.js`
1. load insurance data with `load-insurance-data.js`
1. load data calls with `load-data-calls.js`
1. load extraction patterns with `load-extraction-patterns.js`

## Setup

install the javascript client `npm install @kubernetes/client-node`

install node fetch with `npm install node-fetch@2`

start the proxy to the minikube `kubectl proxy --port=9090 &`

the kubernetes api reference is here: https://kubernetes.io/docs/reference/

update the cognito config files to point to your cognito

update the logins.json to point to your users in cognito

run `./copy-config-files.sh`

go to `../openidl-k8s` and start the reference implementation system with ./systemup.sh

## Set environment

everytime you rebuild the minikube and reset the internals do this

then run `node set-environment.js`

this will create the config.json file in the config directory used by other scripts in this project

## Load Insurance Data

run `node load-insurance-data.js`

this will load data into the data store setup for the system

## load data calls

run `node load-data-calls.js`

this will load some sample data calls

## load extraction patterns

run `node load-extraction-patterns.js`

this will load some sample extraction patterns
