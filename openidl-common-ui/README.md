# openIDL Common UI

[![IBM Cloud](https://img.shields.io/badge/bluemix-powered-blue.svg)](https://bluemix.net)
[![Platform](https://img.shields.io/badge/platform-NODE-blue.svg?style=flat)](https://nodejs.org)

This private repository contains the source code for the openIDL Common UI module, which includes services, configs, components and pipes. These are used by the [openIDL UI](https://git.ng.bluemix.net/openIDL/openidl-ui)  multi-tenant application as well as the [openIDL Carrier UI](https://git.ng.bluemix.net/openIDL/openidl-carrier-ui) single tenant application. Therefore, this repository is installed as a npm package inside OpenIDL UI and OpenIDL Carrier UI applications.

## Node.js and NPM version used
For the development of this package, we used Node.js v8.9.0 (please note that other Node.js versions may not be compatible with this codebase). Also, make sure that the npm version you have is v5.5.1. You can check your node and npm version anytime by executing the following commands:

    node -v
    npm -v

## Angular version used
We used Angular version 6 for the development of this package (please note that other Angular versions may not be compatible with this codebase).

## Angular CLI version used
For development and maintenance of this component, we leverage the [Angular CLI](https://cli.angular.io/). The Angular CLI is a tool to initialize, develop, scaffold, and maintain Angular applications. Make sure to install @angular/cli, globally, using the following command:

    npm install @angular/cli@6.0.8

Pleae note that we used [Angular CLI](https://cli.angular.io/) v6.0.8. To install a different version of the CLI, you can just update the version locally within your project using the following command:

    npm install @angular/cli@<version>

However, please note that we only tested this application using v6.0.8. 

## Project configuration
The configuration for this project is found in `angular.json`, which is the Angular CLI workspace file. For details on the schema for this file, see [Angular CLI workspace file](https://github.com/angular/angular-cli/wiki/angular-workspace).

