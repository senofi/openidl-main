# openidl-transactional-data-event-listener

[![IBM Cloud](https://img.shields.io/badge/bluemix-powered-blue.svg)](https://bluemix.net)

[![Platform](https://img.shields.io/badge/platform-NODE-blue.svg?style=flat)](https://nodejs.org)

  

This repository contains component responsible for listening to `TransactionalDataAvailable` event emitted from chaincode. As a result of this event the component fetches transactional data from private data collection and stores into an off-chain storage (i.e Cloudant or S3 Bucket). Please note that component is implemented as a Node.js application, which also serves as a Hyperledger Fabric client for submitting transactions to blockchain ledger. Therefore, this application has a dependency on the [Hyperledger Fabric SDK for Node.js](https://fabric-sdk-node.github.io/).

  

The openIDL Transactional Data Manager provides functionality for:

* Listening to `TransactionalDataAvailable` event

* Invoking chaincode to get insurance transactional data from private data collection and storing in Cloudant (off-chain database)

## Running Transactional Data Listener locally

For development, testing, and debugging purposes, it is very convenient to run this Node.js component locally on your system and have it connect to the corresponding IBM Blockchain Platform instance that is running on the IBM Cloud.

## Installing Node.js
If you do not have Node.js installed already, [download](https://nodejs.org/en/download/releases/) and install Node.js v8.9.0 (please note that other Node.js versions may not be compatible with this codebase). Also, make sure that the npm version you have is v5.5.1.

## Get Repository code into local machine

* Open a command line terminal at the location of project has to be created
* git clone -b [branchname] [github clone with SSH or HTTP]
* Example of develop branch : git clone -b git@us-south.git.cloud.ibm.com:openIDL/openidl-transactional-data-event-listener.git

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

### 2. DBConfig.json

| Config File Name      | Configured Value  |  Local Run Value|
| --------------------- | ----------------- | --------------- |
| `server/config/DBConfig.json` | ` "persistentStore":"env_block_managment_db"` | ` "persistentStore":"mongo"` |

### 3. listener-channel-config.json

* Create listener-channel-config.json file under server/config
* Below is an example of AAIS node

|   Config File Name      | Configured Value  |  Local Run Value|
|  --------------------- | ----------------- | --------------- |
|   `server/config/listener-channel-config.json` | `"listenerChannels": "${LISTENER_CHANNELS_EVENTS}"` | `"listenerChannels": [{"channelName":"analytics-aais","events":[{"TransactionalDataAvailable":"processTransactionalDataAvailableEvent"}]}]` |

### 4. target-channel-config.json

* Create target-channel-config.json file under server/config
* Below is an example of AAIS node

|   Config File Name      | Configured Value  |  Local Run Value|
|  --------------------- | ----------------- | --------------- |
|   `server/config/target-channel-config.json` | `"targetChannels": "${TARGET_CHANNELS}"` | `"targetChannels": [{"channelName":"analytics-aais","chaincodeName":"openidl-cc-aais-carriers"}]` |

### 5. Configure local-certmanager-config.json

* Get  `apikey` and `instance_id` from respective node administrator or Clould administrator

`json	
    {
      "apikey": "****************",
      "instance_id":"*****************************"
    }`
    
    To obtain the `apikey` and `instance_id` attributes, log on to the IBM Cloud:
		
	  * `apikey` - For information on how to create an API Key for accessing IBM Certificate Manager, please see [Configuring IBM Certificate Manager as persistent store to store the Fabric credentials](https://git.ng.bluemix.net/openIDL/openidl-common-lib#configuring-ibm-certificate-manager-as-persistent-store-to-store-the-fabric-credentials) on the [openild-common-lib](https://git.ng.bluemix.net/openIDL/openidl-common-lib) repository. Please note that you should save the API Key value when it is created since you **won't** be able to obtain it after that time.	  
	  * `instance_id` - Log on to the IBM Cloud and access the **corresponding** IBM Certificate Manager instance and then click on `Settings` -> `Instance Info` and copy the `Service Instance CRN` value.


### 6. Configure local-mongo-config.json

* Create local-mongo-config.json file under server/config
* Get Mongodb Service Credentials from respective node administrator or Clould administrator or follow the below steps:
    * Filter the services by selecting the desired Resource group on IBM cloud dashboard page.
    * Click on the Mongodb instance
    * Click Service Credentials
    * If service credential already exists, then copy the JSON or create a new Service Credential by clicking on "Create" and copy the generated JSON. Please use appropriate role.
* Paste the above JSON in 'local-mongo-config.json' file

### 7. Configure s3-bucket-config.json

* s3 is an object storage in AWS cloud. Currently, openidl application is configured to place all the carrier insurance data(for the data call) in this bucket
* Create s3-bucket-config.json file under server/config
* The JSON structure for this file is as below:
         {
              "accessKeyId": "XXXXXXXXXXXXXXXXXXXX",
              "secretAccessKey": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
              "bucketName": "openidl-analytics"
         }
* The access key ID and  secret access key are obtained from AWS
* Currently, the credentials provided by AAIS are used by all the environments including dev, test and prod. In future, it needs to have separate buckets and credentials for each environment.
* Due to above reasons, this file is not checked in to git. Get this file from admins or get it from the Kuberenetes secrets in analytics node

### Start the Node.js server

1. Run the `npm install` command and verify that there are no errors.

2. Run the `npm start` command.

3. Verify that the server has started successfully. The message `[2018-11-26 16:34:00.581] [INFO] server - app listening on http://localhost:3000` should be present in the logs, and there should be no errors.

  

### Verify server is up and running

You can access `http://localhost:3000/health` locally to check server is up and running and you will get a message `{"message":"Data call transactional event listener is alive."}`

  

### Execute functional test cases

Once the installation and application have been verified to work locally, test suites may be executed:

  

1. Ensure that the current app has been stopped (Ctrl+C on macOS/Unix machines).

2. Run the `npm test` command.

3. Ensure that output does not contain any errors.

  

If errors are present, see the [troubleshooting section](#troubleshooting).

  

### Troubleshooting

If there are errors, please inspect the logs carefully and debug accordingly. Common errors may relate to:

  

* Connection not being established to the IBM Blockchain Platform service.

* Node/npm packages not being installed correctly.

* Multiple instances of the application running and trying to use the same network port.

  

## Deployment to the IBM Cloud

The automated deployment of the openIDL Insurance Data Manager to the IBM Cloud is driven by a [DevOps pipeline](https://cloud.ibm.com/devops/toolchains?env_id=ibm%3Ayp%3Aus-south) defined on the [IBM Cloud](https://www.ibm.com/cloud/). Hence, whenever new changes are committed, a new build is automatically kicked off. The automated build process also executes a set of automated, functional test cases to validate the health of the component (please note this deployment pipeline is configured with the necessary service credentials so the automated test cases can execute outside of the Cloud Foundry environment).
  

### Sequence Diagram 
Sequence diagram [draw.io](https://us-south.git.cloud.ibm.com/openIDL/openidl-transactional-data-event-listener/blob/develop/docs/transactional-data-event-listener.drawio) file.

![Sequence diagram  image.](./docs/transactional-data-event-listener.jpg)