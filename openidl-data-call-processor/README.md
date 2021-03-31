# openIDL Data Call Processor

[![IBM Cloud](https://img.shields.io/badge/bluemix-powered-blue.svg)](https://bluemix.net)
[![Platform](https://img.shields.io/badge/platform-NODE-blue.svg?style=flat)](https://nodejs.org)

The Data Call Processor component is responsible for processing consented events and extraction pattern specified events. This component processes such events by extracting the corresponding data from the HDS (mongo/cloudant) database and ingesting it into corresponding channel (e.g. `AAIS-Carriers`, `AAIS-Carrier1`, etc.). This component is implemented as a Node.js application that receives and processes live consented events and extraction pattern specified events and ensures that any previously missed consented events and extraction pattern specified events are also processed.
The codebase for this component is capable of supporting a single carrier (i.e. running under the control of a carrier) and also capable of supporting multiple carriers (i.e. running under the control of an advisory organization such as AAIS). Therefore, the same codebase is deployed to both types of environments (though with different configuration).

## Data Processing Flow

* Singletenant or Multitenant user will provide a consent on their UI
* Data call can be updated into the ledger of default channel
* After successful commit into the ledger, blockchain emit an event is "ConsentedEvent"
* Data call processor is a microservice where "ConsentedEvent" listener is up and running
* ConsentedEvent can perform the extraction pattern which mapped with data call, load the data into mongodb collection and push the data into Private data collection (PDC) between Analytics and carrier node. 


## Running locally

## Installing NodeJS
If you do not have Node.js installed already, [download](https://nodejs.org/en/download/releases/) and install Node.js v8.9.0 (please note that other Node.js versions may not be compatible with this codebase). Also, make sure that the npm version you have is v5.5.1.

## Get Repository code into local machine

* Open a command line terminal at the location of project has to be created
* git clone -b [branchname] [github clone with SSH or HTTP]
* Example of develop branch : git clone -b develop git@us-south.git.cloud.ibm.com:openIDL/openidl-data-call-processor.git

## Pulling Git private repositories
This repository leverages common functionality from the [openidl-common-lib](https://git.ng.bluemix.net/openIDL/openidl-common-lib.git) repository. To install this dependency, replace `{GITHUB_TOKEN}` in `package.json` and `package-lock.json` with your own Git personal access token. For details on how to get an access token, please see [Personal access tokens](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) on the GitLab site.

## Configure to Run locally

For development, testing, and debugging purposes, it is very convenient to run this Node.js component locally on your system and have it connect to the corresponding IBM Blockchain Platform instance that is running on the IBM Cloud.

### 1. Configure local-certmanager-config.json

* Get  `apikey` and `instance_id` from respective node administrator or Clould administrator

`json	
    {
      "apikey": "****************",
      "instance_id":"*****************************"
    }`
    
    To obtain the `apikey` and `instance_id` attributes, log on to the IBM Cloud:
		
	  * `apikey` - For information on how to create an API Key for accessing IBM Certificate Manager, please see [Configuring IBM Certificate Manager as persistent store to store the Fabric credentials](https://git.ng.bluemix.net/openIDL/openidl-common-lib#configuring-ibm-certificate-manager-as-persistent-store-to-store-the-fabric-credentials) on the [openild-common-lib](https://git.ng.bluemix.net/openIDL/openidl-common-lib) repository. Please note that you should save the API Key value when it is created since you **won't** be able to obtain it after that time.	  
	  * `instance_id` - Log on to the IBM Cloud and access the **corresponding** IBM Certificate Manager instance and then click on `Settings` -> `Instance Info` and copy the `Service Instance CRN` value.

### 2. Configure local-mongo-config.json

* Create local-mongo-config.json file under server/config
* Get Mongodb Service Credentials from respective node administrator or Clould administrator or follow the below steps:
    * Filter the services by selecting the desired Resource group on IBM cloud dashboard page.
    * Click on the Mongodb instance
    * Click Service Credentials
    * If service credential already exists, then copy the JSON or create a new Service Credential by clicking on "Create" and copy the generated JSON. Please use appropriate role.
* Paste the above JSON in 'local-mongo-config.json' file


### 3. Configure connection-profile.json

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


### 4. DBConfig.json

| Config File Name      | Configured Value  |  Local Run Value|
| --------------------- | ----------------- | --------------- |
| `server/config/DBConfig.json` | ` "persistentStore":"env_target_db""` | ` "persistentStore":"mongo"` |

### 5.listener-channel-config.json

* Change $HOST value with respective IBP node / organization name. Below is an example of AAIS node

| Config File Name      | Configured Value  |  Local Run Value|
| --------------------- | ----------------- | --------------- |
| `server/config/listener-channel-config.json` | `"channelName": "analytics-${HOST}"` | `"channelName": "analytics-aais"` |
| `server/config/listener-channel-config.json` | ` "user": "openidl-${HOST}-data-call-processor-ibp-2.0","` | ` "user": "openidl-aais-data-call-processor-ibp-2.0","` |


### 6.local-cloudant-config.json

* As we are planning to use mongodb, we will not need local-cloudant-config.json. However, as per the code we have to provide the cloudant connection profile. Down the line we might have to do clean the code.
* Please use checked-in local-cloudant-config.json as is


### 7.unique-identifiers-config.json

* Create unique-identifiers-config.json file under server/config
* Add the carriername and company code value in the config file with below format
* {
    "identifiers": [{
            "carrierName": "The Hartford",
            "uniqueIdentifier": "12345"
        } 
    ]
}


## Start the Node.js server
1. Run the `npm install` command and verify that there are no errors.
2. Run the `npm start` command.
3. Verify that the server has started successfully. The message `[2018-11-26 16:34:00.581] [INFO] server - app listening on http://localhost:8000` should be present in the logs, and there should be no errors.

### Verify server is up and running
You can access the OpenAPI  locally at http://localhost:8000/health so you can validate the server is up and running as expected.

### Execute functional test cases
Once the installation and application have been verified to work locally, test suites may be executed:

1. Ensure that the current app has been stopped (Ctrl+C on macOS/Unix machines).
2. Run the `npm run dev-test` command.
3. Ensure that output does not contain any errors.

If errors are present, see the [troubleshooting section](#troubleshooting).

### Troubleshooting
If there are errors, please inspect the logs carefully and debug accordingly. Common errors may relate to:

* Connection not being established to the IBM Blockchain Platform service.
* Node/npm packages not being installed correctly.
* Multiple instances of the application running and trying to use the same network port.
 

### Sequence Diagram.
Sequence diagram [draw.io](./docs/datacall-processor.drawio) file.

![](./docs/datacall-processor.jpg)

