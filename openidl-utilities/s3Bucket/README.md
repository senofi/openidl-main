# S3 Bucket Utility

This is a utility node.js application which retrieves number of records inserted in s3 bucket for a given key. 

---

## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environement.

### Node 
Make sure to you are installing Node.js v8.9.0 (please note that other Node.js versions may not be compatible with this codebase). Also, make sure that the npm version you have is v5.5.1.

- #### Node installation on Windows
Go to [official Node.js website](https://nodejs.org/en/download/) and download the installer.

Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

If the installation was successful, you should be able to run the following command.

$ node --version

$ npm --version


## Project setup

$ git clone `git@us-south.git.cloud.ibm.com:openIDL/openidl-utilities.git`

or , `https://us-south.git.cloud.ibm.com/openIDL/openidl-utilities.git`

$ cd openidl-utilities/s3Bucket/

$ npm install

### Configure app

Navigate to `openidl-utilities/s3Bucket/s3Bucket-config.json` and provide below properties.

```json
{
"accessKeyId":  "value",
"secretAccessKey":  "value",
"bucketName":  "value",
"prefix":  "carrierId-dataCallId"
}
```

## Running the project

$ cd openidl-utilities/s3Bucket/

$ node index


