# openIDL utilities

[![Platform](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)

This repository contains scripts for:

* Creating users for the openIDL UI applications
* Creating identities for the Fabric client components (i.e. blockchain identities for application components)
* Generating an access token that can be used to authenticate with the Swagger UIs that are included in the REST API components.
* Resetting and configuring Cloudant database.

## Installing openidl-common-lib npm module

### Using the published version of openidl-common-lib

This repository leverages common functionality from [openidl-common-lib](https://github.com/openidl-org/openidl-main/tree/main/openidl-common-lib) . To install this dependency, replace `{GITHUB_TOKEN}` in `.npmrc` with your own Git personal access token. For details on how to get an access token, please see [Personal access tokens](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) on the GitHub site. Access Token should have at least `read:packages` permissions

### Using the local version of openidl-common-lib

For local development especially when changes to the openidl-common-lib have to be made, the local version of openidl-common-lib can be used. To do that, follow the steps below:

* Link the openidl-common-lib to the local npm registry and install its node modules:
  * `cd openidl-common-lib`
  * `npm link`
  * `npm install`
* Link the openidl-common-lib to the openidl-utilities:
  * `cd openidl-utilities`
  * `npm @senofi/openidl-common-lib`

#### To undo the above steps (when the local version of openidl-common-lib is no longer needed), follow the steps below:
* To unlink the openidl-common-lib from the openidl-utilities:
  * `cd openidl-utilities`
  * `npm unlink @senofi/openidl-common-lib`
* To unlink the openidl-common-lib from the local npm registry:
  * `cd openidl-common-lib`
  * `npm unlink`

# Pre-requisites
1. Clone this repository to your local system and navigate to the directory where the code was cloned.
2. This repository leverages common functionality from the [openidl-common-lib](https://github.com/openidl-org/openidl-main/tree/main/openidl-common-lib) repository.
3. If you do not have Node.js installed already, [download](https://nodejs.org/en/download/releases/) and install Node.js v14.17.x (please note that other Node.js versions may not be compatible with this codebase). Also, make sure that the npm version you have is v6.14.x.
4. Execute the following command to install the required Node.js dependencies:

		npm install


## Components

* ### [Creating users for the openIDL UI applications](/server/app/README.md)

* ### [Creating identities for the Fabric client components (registration and enrollment)](/server/fabric/README.md)

* ### [Resetting and configuring Cloudant databases](/server/cloudant/README.md)


