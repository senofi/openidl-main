# openIDL Data Call mood listener

[![IBM Cloud](https://img.shields.io/badge/bluemix-powered-blue.svg)](https://bluemix.net)
[![Platform](https://img.shields.io/badge/platform-NODE-blue.svg?style=flat)](https://nodejs.org)

This repository contains the event listening and processing functionality for likes/dislikes and consents events created by [OpenIDL Data Call App](https://git.ng.bluemix.net/openIDL/openidl-data-call-app) and [OpenIDL Data Call Carrier App](https://git.ng.bluemix.net/openIDL/openidl-data-call-carrier-app) repositories. Please note that this service API layer is implemented as a Node.js application, which serves as a Hyperledger Fabric client for listening events and processing event as per business logic. Therefore, this application has a dependency on the [Hyperledger Fabric SDK for Node.js](https://fabric-sdk-node.github.io/). This application also has dependency on https://git.ng.bluemix.net/openIDL/openidl-common-lib which contains the common eventHandler engine.

The openIDL Data Call mood listener component provides functionality for:
* Listen to like/dislike/consent events emitted by openIDL Data Call App and OpenIDL Data Call Carrier App.
   
* Listening and Target channels are configurable in /server/config/channel-config.json


## Running Mood Listener locally

For development, testing, and debugging purposes, it is very convenient to run this Node.js component locally on your system and have it connect to the corresponding IBM Blockchain Platform instance that is running on the IBM Cloud.

## Installing Node.js
If you do not have Node.js installed already, [download](https://nodejs.org/en/download/releases/) and install Node.js v8.9.0 (please note that other Node.js versions may not be compatible with this codebase). Also, make sure that the npm version you have is v5.5.1.

## Get Repository code into local machine

* Open a command line terminal at the location of project has to be created
* git clone -b [branchname] [github clone with SSH or HTTP]
* Example of develop branch : git clone -b git@us-south.git.cloud.ibm.com:openIDL/openidl-data-call-mood-listener.git

### Pulling Git private repositories

This repository leverages common functionality from the [openidl-common-lib](https://git.ng.bluemix.net/openIDL/openidl-common-lib.git) repository. To install this dependency, replace `{GITHUB_TOKEN}` in `package.json` and `package-lock.json` with your own Git personal access token. For details on how to get an access token, please see [Personal access tokens](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) on the GitLab site.

### Edit/Create Configuration files

The following configuration files are either to be created or edited(if already exists):

### 1. Configure connection-profile.json

* Create connection-profile.json file under server/config
* Get IBP connection profile from respective node administrator or Clould administrator or follow the below steps:
    * Login to IBM Cloud account
    * Filter the services by selecting the desired Resource group on IBM cloud dashboard page.
    * Click on the IBP instance
    * Click on "Launch the IBM Blockchain Platform console"
    * In IBP console, click on Organizations icon in the left vertical panel. A list of Organizations will be displayed
    * Select the Organization MSP for which the connection profile is required, usually of the Peers like aais, analytics, etc
    * Select "Create Connection Profile" in the Organization panel.
    * In the pop up window, select the peer(s) and click on Download Connection profile
    * Save this file as connection-profile.json in the above mentioned server/config directory

### 2. Configure DBConfig.json

| Config File Name      | Configured Value  |  Local Run Value|
| --------------------- | ----------------- | --------------- |
| `server/config/DBConfig.json` | ` "persistentStore":"env_block_managment_db"` | ` "persistentStore":"mongo"` |

### 3. Configure listener-channel-config.json

* Create listener-channel-config.json file under server/config
* Below is an example of AAIS node

|   Config File Name      | Configured Value  |  Local Run Value|
|  --------------------- | ----------------- | --------------- |
|   `server/config/listener-channel-config.json` | `"listenerChannels": "${LISTENER_CHANNELS_EVENTS}"` | `"listenerChannels": [{"channelName":"analytics-aais","events":[{"ConsentedEvent":"ConsentedEvent"},{"ToggleLikeEvent":"ToggleLikeEvent"}]}]` |


### 4. Configure local-certmanager-config.json

* Get  `apikey` and `instance_id` from respective node administrator or Clould administrator

`json	
    {
      "apikey": "****************",
      "instance_id":"*****************************"
    }`
    
    To obtain the `apikey` and `instance_id` attributes, log on to the IBM Cloud:
		
	  * `apikey` - For information on how to create an API Key for accessing IBM Certificate Manager, please see [Configuring IBM Certificate Manager as persistent store to store the Fabric credentials](https://git.ng.bluemix.net/openIDL/openidl-common-lib#configuring-ibm-certificate-manager-as-persistent-store-to-store-the-fabric-credentials) on the [openild-common-lib](https://git.ng.bluemix.net/openIDL/openidl-common-lib) repository. Please note that you should save the API Key value when it is created since you **won't** be able to obtain it after that time.	  
	  * `instance_id` - Log on to the IBM Cloud and access the **corresponding** IBM Certificate Manager instance and then click on `Settings` -> `Instance Info` and copy the `Service Instance CRN` value.


### 5. Configure local-mongo-config.json

* Create local-mongo-config.json file under server/config
* Get Mongodb Service Credentials from respective node administrator or Clould administrator or follow the below steps:
    * Filter the services by selecting the desired Resource group on IBM cloud dashboard page.
    * Click on the Mongodb instance
    * Click Service Credentials
    * If service credential already exists, then copy the JSON or create a new Service Credential by clicking on "Create" and copy the generated JSON. Please use appropriate role.
* Paste the above JSON in 'local-mongo-config.json' file

### Start the Node.js server
1. Run the `npm install` command and verify that there are no errors.
2. Run the `npm run dev` command.
3. Verify that the server has started successfully. The message `server - app listening on http://localhost:3000` should be present in the logs, and there should be no errors.

### Verify server is up and running
You can verify if server started successfully by browsing to http://localhost:3000/ 

### Execute unit test cases
Once the installation and application have been verified to work locally, test suites may be executed:

1. Ensure that the current app has been stopped (Ctrl+C on macOS/Unix machines).
2. Run the `npm run dev-test` command.
3. Ensure that output does not contain any errors.

If errors are present, see the [troubleshooting section](#troubleshooting).

### Troubleshooting
If there are errors, please inspect the logs carefully and debug accordingly. Common errors may relate to:

* Connection not being established to the IBM Blockchain Platform service.
* Node/NPM packages not being installed correctly.
* Multiple instances of the app running and trying to use the same network port.

## Deployment to the IBM Cloud
The automated deployment of the openIDL Data Call App component to the IBM Cloud is driven by a [DevOps pipeline](https://console.bluemix.net/devops/toolchains?env_id=ibm%3Ayp%3Aus-south) defined on the [IBM Cloud](https://www.ibm.com/cloud/). Hence, whenever new changes are committed and pushed a new build is automatically kicked off. The automated build process also executes a set of automated, functional test cases to validate the health of the application (please note this deployment pipeline is configured with the necessary service credentials so the automated test cases can execute outside of the Cloud Foundry environment).

     
### Sequence Diagram 

Sequence diagram [draw.io](https://us-south.git.cloud.ibm.com/openIDL/openidl-data-call-mood-listener/blob/develop/docs/data-call-mood-listener.drawio) file.

![Sequence diagram  image.](./docs/data-call-mood-listener.jpg)
