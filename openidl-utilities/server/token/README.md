## Generating an App ID token for Swagger UI
To generate an App ID token so you can obtain access to the Swagger UIs provided in the REST API components, you should leverage the `token/api-token-generator.js` script.

### Running the script
1. Log on to the IBM Cloud and access your App ID's dashboard; go to the `Service credentials` section.
2. Open Credentials Section and copy the `apikey`, `managementUrl`, `oauthServerUrl`, `profilesUrl` and `version` elements from the JSON content.
3. Create a file named `local-appid-config.json` and paste the credentials into it. Move this file into the `server/token/config` directory.
4. In your App ID's dashboard, go to the `Applications` section.
5. Open the UI application's credentials and copy the `clientId`, `tenantId` and `secret` elements from the JSON content.
6. Open the `local-appid-config.json` and paste the attributes and values you just copied in the previous step.
7. Execute the `api-token-generator.js` script as follows:

	  node server/token/api-token-generator.js

8. An App ID token will then be generated.
Generating an App ID token for Swagger UI




* ## [Creating users for the openIDL UI applications](/server/chaincode/README.md)

* ## [Creating identities for the Fabric client components (registration and enrollment)](/server/chaincode/README.md)

* ## [Resetting and configuring Cloudant databases](/server/chaincode/README.md)

* ## [Generating an App ID token for Swagger UI](/server/chaincode/README.md)

* ## [Install and Instantiate](/server/chaincode/README.md)


