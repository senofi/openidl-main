## Creating users for the openIDL UI applications
openIDL UI applications use IBM Cloud's App ID service for user management. The App ID service instances (for openIDL) use the out-of-the box Cloud Directory storage as the user repository. Please note that the setup and configuration of the IBM App ID service on the IBM Cloud is beyond the scope of this document (for further details, please see App ID's [documentation](
https://console.bluemix.net/docs/services/appid/index.html#gettingstarted).

### Running the script
1. Log on to the IBM Cloud and access your App ID's dashboard; go to the `Service credentials` section.
2. Open credentials section and copy the JSON content.
3. Save the JSON content into a local JSON file and name it `app-id-credentials.json`. Place this file under the `server/app/config` folder.
4. Please look at the `multicarrier-users.json` file; it contains the details of users and their attributes. Create a similar file and named it `user-config.json` and place it under the `server/app` folder.
5. Log on to the [IBM Cloud CLI](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html#install_use) and generate a bearer token as follows:

		ibmcloud iam oauth-tokens

6. Copy the token and create a new entry with key `authkey` in `user-config.json` as follows (make sure to leave out the `Bearer` string from the token you just generated):

		"authKey":"<Token Value>"

7. Execute the script as follows:

		node server/app/app-user-registration-cli.js app-id-credentials.json user-config.json <option>

	where option can be either `-c` to create users or `-u` to update user attributes of existing users.
  8. ### Start the Node.js server
  * Run the `npm run dev` command.
  * Verify that the server has started successfully. The message `[2018-11-26 16:34:00.581] [INFO] server - app listening on http://localhost:3000` should be present in the logs, and there should be no errors.
  * select endpoint for api  `app-user-creation` and click `try it out`. Make appropriate changes in the payload.
  
	 ```script 
			{
			"directory": "cloud_directory",
			"authKey": "wiueewruwq-eueuuwiueiw",
			"users": [
				{
				"name": {
					"givenName": "john",
					"familyName": "blockchain"
				},
				"emails": [
					{
					"value": "john@email.com",
					"primary": true
					}
				],
				"userName": "john@email.com",
				"password": "john@blockchain",
				"status": "CONFIRMED",
				"profile": {
					"attributes": {
					"role": "carrier",
					"organizationId": "67856"
					}
				}
				}
			]
			}
	 ```
	* where
		`authKey` should be obtained by running `ibmcloud iam oauth-tokens`. 
		 role can be `carrier` or `advisory` based on type of organisation.
		 `organizationId` should be the *corresponding* organization Id.
		 provide appropriate `userName`, `emails` and `password`

  * To obtain a authentication token for swagger refer the below link
	* ### [Creating authentication token using curl or postman](/server/README_token.md)
	Use this token to authorize , by clicking on `Authorize` and providing the token.

