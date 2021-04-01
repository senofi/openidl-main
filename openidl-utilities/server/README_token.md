## Creating tokens for the openIDL UI applications
openIDL UI applications use IBM Cloud's App ID service for user management. The App ID service instances (for openIDL) use the out-of-the box Cloud Directory storage as the user repository. Please note that the setup and configuration of the IBM App ID service on the IBM Cloud is beyond the scope of this document (for further details, please see App ID's [documentation](
https://console.bluemix.net/docs/services/appid/index.html#gettingstarted).

### Curl using Git Bash-Curl using Git Bash 
* Encode clientId:secret in base64
* *type node in GitBash, it will open REPL terminal then run the below code
console.log(Buffer.from("${clientId}:${secret}").toString('base64')); 
It will return the base64 encoded value.
* Run the below command to get the token-

``` 
	curl -X POST \
	https://appid-oauth.ng.bluemix.net/oauth/v3/eda1f5ac-51ed-4544-9a89-ca270016a2f5/token \
	-H 'accept: application/json' \
	-H 'Authorization: Basic ${base64-encoded-value}' \
	-H 'content-type: application/x-www-form-urlencoded' \
	-d grant_type=client_credentials
```

### Curl using Windows-PowerShell
* Encode clientId:secret in base64
* type node in PowerShell, it will open REPL terminal then run the below code
console.log(Buffer.from("${clientId}:${secret}").toString('base64')); 
It will return the base64 encoded value.
* Run the below command to get the token-

``` script
curl.exe -X POST https://appid-oauth.ng.bluemix.net/oauth/v3/eda1f5ac-51ed-4544-9a89-ca270016a2f5/token -H 'accept: application/json' -H 'authorization: Basic ${base64-encoded-value}' -H 'content-type: application/x-www-form-urlencoded' -d grant_type=client_credentials
```