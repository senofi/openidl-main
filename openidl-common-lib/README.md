# openIDL-common-lib

[![Platform](https://img.shields.io/badge/platform-NODE-blue.svg?style=flat)](https://nodejs.org)

This repository contains common functionality and logic leveraged by several of the openIDL applications such as the [OpenIDL Data Call App](https://git.ng.bluemix.net/openIDL/openidl-data-call-app) and the [OpenIDL Data Call Carrier App](https://git.ng.bluemix.net/openIDL/openidl-data-call-carrier-app).

The openIDL-common-lib repository includes functionality for:
* Transacting on the Fabric network
* [Processing block events](https://git.ng.bluemix.net/openIDL/openidl-common-lib/blob/develop/EventHandler.md)
* Authenticating users and components (API authentication)
* Wallets for Fabric identities
* Accessing line of businesses from the ledger
* IBM Certificate Manager as persistent wallet

### Install Node.js
If you do not have Node.js installed already, download and install [Node.js v8.9](https://nodejs.org/download/release/v8.9.4/) (please note that v8.9.x is version that this component was developed and tested with; other versions may not be compatible).

### Install npm dependencies
1. Run the `npm install` command.

### Configuring IBM Certificate Manager as persistent store for Fabric credentials
1. Create IBM Certificate Manager service instance on the IBM Cloud
    * Log on to the IBM Cloud and create an IBM Certificate Manager service instance under the corresponding organization and environment (e.g. development, staging, etc.). For more information on creating an instance of the IBM Certificate Manager service, please see [Getting started with IBM Certificate Manager](https://console.bluemix.net/docs/services/certificate-manager/index.html#gettingstarted. An instance ID is associated with each IBM Certificate Manager instance. To retrieve the instance ID value for your service, select the corresponding IBM Certificate Manager service, then click on `Settings`, select the `Instance Info` tab, and copy the `Service Instance CRN` value.
    
2. Create a Service Id and API key to work with your IBM Certificate Manager instance
    *  To authenticate with the IBM Certificate Manager service from an application, you must include an IBM Cloud IAM access token and the IBM Certificate Manager instance ID in every HTTP request.
    
    * To create Service Id and an API key:
                Log into IBM Cloud, go to `Manage` -> `Security` ->`Identity and Access`, and select `Service IDs`. Create the service ID. Select the service ID and click on the API keys tab and proceed to create an API key. Save your API key by copying or downloading it to a secure location. Please note that you should save the API key value when it is created since you **won't** be able to obtain it after that time.
                
   * To assign an access policy to the API key:
                Go to `Manage` -> `Security` ->`Identity and Access` and select `Service IDs`.
                Then select the relevant service ID and go to the `Access policies` tab.
                Click on the `Assign access` button to provide the relevant permissions. 
                Click on the `Assign access to resources` image and then from the services list, select `Certificate Manager`.
                Now select the **corresponding** IBM Certificate Manager instance and assign access roles `Manager`,`Writer` and `Reader`. For more information on assigning access policies, please refer to [Managing service access roles](https://console.bluemix.net/docs/services/certificate-manager/access-management.html#managing-service-access-roles).

### Sequence diagram for common event listener

![](./docs/SD-Common-Event-Listener.png)