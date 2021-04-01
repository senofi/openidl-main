## Creating identities for the Fabric client components (registration and enrollment)
The Fabric identity registration and enrollment script, `fabric-user-enrollment.js`, relies on two pre-requisites:

1. A running IBP network instance on the IBM Cloud.
2. A running Cloudant service instance **or** a running IBM Certificate Manager service instance on the IBM Cloud.

The `fabric-user-enrollment-cli.js` script registers and enrolls users in the blockchain network and can stores their certificates in the Cloudant service instance or IBM Certificate Manager.

### Running the script
1. Log on to IBM Cloud and access your IBP Blockchain Dashboard.
2. Download connection profile from Dashboard overview page.
3. Copy the file into the `server/fabric/config` folder and name it `network-config.json`.
4. If using Cloudant as persistent store, then:
	* Copy to the clipboard the Cloudant connection credentials from the **corresponding** Cloudant dashboard; these credentials are found under the `Service credentials` section.
	* Paste the Cloudant credentials into a file named `local-cloudant-config.json` and place this file under the `server/fabric/config` folder.
	
5. If using IBM Certificate Manager as persistent store, then:
	* Create a file named `local-certmanager-config.json` and place this file under the `server/fabric/config` folder. This file will contain an `apikey` and `instance_id` attributes (see following point).

		```json
		{
		  "apikey": "*****************",
		  "instance_id":"***********************"
		}
		```

	* To obtain the `apikey` and `instance_id` attributes, log on to the IBM Cloud:
		
	  * `apikey` - For information on how to create an API Key for accessing IBM Certificate Manager, please see [Configuring IBM Certificate Manager as persistent store to store the Fabric credentials](https://git.ng.bluemix.net/openIDL/openidl-common-lib#configuring-ibm-certificate-manager-as-persistent-store-to-store-the-fabric-credentials) on the [openild-common-lib](https://git.ng.bluemix.net/openIDL/openidl-common-lib) repository. Please note that you should save the API Key value when it is created since you **won't** be able to obtain it after that time.	  
	  * `instance_id` - Log on to the IBM Cloud and access the **corresponding** IBM Certificate Manager instance and then click on `Settings` -> `Instance Info` and copy the `Service Instance CRN` value.

6. Validate the admin user and password in `admin.json` under the `server/fabric/config` folder.
	* `admin` is bootstrap identity which you setup at the time CA creation which have values `user` and `secret`.
	
6. Create a new file named `users.json` under the `server/fabric/config` folder; this file should contain the component identity information. As an example, see below:
	```json 	
	{
    "users": [{
        "org": "org1",
        "user": "openidl-aais_config_change",
        "pw": "password",
        "affiliation": "org1",
        "role": "client",
        "attrs": [{ "name": "orgType", "value": "advisory", "ecert": true }]
		}]
	}
	```
	* Ensure the values for the `org` and `affiliation` attributes are correct. Validate with the `connection profile` file that you just downloaded, the values for these attributes. 
	* `attrs` is an array of key/value attributes where `orgtype` is the type of the organisation and can be `advisory` or `carrier`. `ecert` is an optional value of true indicates that this attribute should be included in an enrollment certificate by default.
	

7. Execute the `fabric-user-enrollment-cli.js` script as follows:
	```script 	
	node server/fabric/fabric-user-enrollment-cli.js <option> <connection-profile-file-name> <user-config-file-name> <persistentStore>
	```
	where:
	* `option` can be `-r` for registering the user or `-e` for enrolling the user. 
	* `connection-profile-file-name` is the connection profile file you downloaded from the IBM Blockchain Platform Dashboard.
	* `user-config-file-name` is the file that contains the details of the user who needs to be enrolled/registered.
	* `persistentStore` to use Cloudant as persistent store pass the value `cloudant` and to use IBM Certification Manager as persistent store pass the value `certificate-manager`. If no value is passed, then default is `certificate-manager`.

	Please note that the script should be executed in two steps, with one option at a time (always use the register option before the enroll option).

8. ### Start the Node.js server
  * Run the `npm run dev` command.
  * Verify that the server has started successfully. The message `[2018-11-26 16:34:00.581] [INFO] server - app listening on http://localhost:3000` should be present in the logs, and there should be no errors.
  * select endpoint for api  `fabric-user-creation` and click `Try it out`. Make appropriate changes in the payload.
  
	```code 
	{
	 "options": "register",
	    "users": 
		[{
				"org": "higmsp",
				"user": "openidl-aais_config_Htest2",
				"pw": "password",
				"affiliation": "org1",
				"role": "client",
				"attrs": [
					{
						"name": "orgType",
						"value": "carrier",
						"ecert": true
					}
				]
			}
		]
	}
```
	
* where
	1. `options` should be `register` when registering the new fabric user and `enroll` to enroll the fabric user.
	1.  `value` can be `carrier` or `advisory` based on type of organisation.
	1.  `org` and `affiliation` should be the *corresponding* values for organization and affiliation. This can be obtained from the IBP `connection profile`
	1.  provide appropriate values for `user` and `pw`

  * To obtain a authentication token refer the below link
	* ### [Creating authentication token using curl or postman](/server/README_token.md)

### Troubleshooting
1. Fabric-ca request register failed with errors [[{"code":20,"message":"Authorization failure"}]]

	First make sure the connection profile is correct. Also, note that this error appears when there has been a previous run of the script against a different connection profile. In such case, remove previously downloaded certificates from the project's root directory:
   	* Files ending with `-priv`
   	* Files ending with `-pub`
   	* Files with name of admin identity; generally this will be a file with name `admin`

2.  Registration of user failed with affiliation validation

	Ensure the affiliation section is populated correctly (inspect the connection profile file and the contents of the `users.json` file).





