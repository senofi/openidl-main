
## Resetting and configuring Cloudant databases
The cloudant script, `cloudant.js`, resets & configures the Cloudant databases. This script deletes and recreates the database. 
The script also calculates the count of records in the view created by map reduce.

The script has the following pre-requisite.

1. A running Cloudant service instance on the IBM Cloud.

### Running the script
1. Log on to IBM Cloud and access the **corresponding** Cloudant dashboard.
	* Copy to the clipboard the Cloudant connection credentials. These credentials are found under the `Service credentials` section.
	* Paste the Cloudant credentials into a file named `local-cloudant-config.json` and place this file under the `server/cloudant/config` folder.
2. The configuration file `config.json` is preconfigured with the names of the databases that would be recreated after the script is executed. Please see the  [config.json](https://git.ng.bluemix.net/openIDL/openidl-utilities/blob/develop/server/cloudant/config/config.json) that has the details of the databases that will be impacted.
3. Execute the `cloudant.js` script as follows:
	```script 	
	node server/cloudant/cloudant.js <organization> 
	```
	where:
	* `organization` can be `advisory` for AAIS and `carrier` for Carrier.

## Cloudant history on a document.
	To fetch the cloudant document history
1. Log on to IBM Cloud and access the **corresponding** Cloudant dashboard.
	* Copy to the clipboard the Cloudant connection credentials. These credentials are found under the `Service credentials` section.
	* Paste the Cloudant credentials into a file named `local-cloudant-config.json` and place this file under the `server/cloudant/config` folder.

2. open `constant.js` and update the database name.
3. open `records.json` and update the list of `_Id` for which you the cloudant history.
4. Open `document_updates.js` and run pass the parameter as given below.
	* `{ revs: true }` returns the list of `_rev` id.

	* `{revs_info:true}` returns the list of `_rev` id in sorted order.
	* `{rev:'4-23a19ea6eedcdc709117e29517a5cd05'}` returns the document as the the revision passed in parameter.

5.	 Execute the `document_updates.js` script as follows:
	```script 	
	node server/cloudant/document_updates.js 
	```


### Running the script to get the view count
1. Log on to IBM Cloud and access the **corresponding** Cloudant dashboard.
	* Copy to the clipboard the Cloudant connection credentials. These credentials are found under the `Service credentials` section.
	* Paste the Cloudant credentials into a file named `local-cloudant-config.json` and place this file under the `server/cloudant/config` folder.
2. The constants file `constant.js` is preconfigured with the name of the database and view.
3. Execute the `cloudant.js` script as follows:
	```script 	
	node server/cloudant/cloudant.js View_Count
	```
	