# openIDL utilities
This repository contains scripts for:

1. Creating users for the openIDL UI applications
1. Creating identities for the Fabric client components (i.e. blockchain identities for application components)
1. Generating an App ID token that can be used to authenticate with the Swagger UIs that are included in the REST API components.
1. Resetting and configuring Cloudant database.

# Pre-requisites
1. Clone this repository to your local system and navigate to the directory where the code was cloned.
2. This repository leverages common functionality from the [openidl-common-lib](https://git.ng.bluemix.net/openIDL/openidl-common-lib.git) repository. To be able to install this dependency, you should replace `{GITHUB_TOKEN}` in `package.json` and `package-lock.json` with your own Git personal access token. For details on how to get an access token, please see [Personal access tokens](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) on the GitLab site.
3. If you do not have Node.js installed already, [download](https://nodejs.org/en/download/releases/) and install Node.js v8.9.0 (please note that other Node.js versions may not be compatible with this codebase). Also, make sure that the npm version you have is v5.5.1.
4. Execute the following command to install the required Node.js dependencies:

		npm install


## Components

* ### [Creating users for the openIDL UI applications](/server/app/README.md)

* ### [Creating identities for the Fabric client components (registration and enrollment)](/server/fabric/README.md)

* ### [Resetting and configuring Cloudant databases](/server/cloudant/README.md)

* ### [Generating an App ID token for Swagger UI](/server/token/README.md)

* ### [Install and Instantiate](/server/chaincode/README.md)


