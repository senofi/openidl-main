# Chaincode Event Listener

The chaincode event listener in openIDL-common-lib repository includes functionality for:
* Long term monitoring and fault tolerance: 
This means it can resume and process any chaincode events that may have been lost because the listener component was down.
* Persist the block number: In order to achieve fault tolerance, we need to keep track the last block that was processed. Cloudant database is used to persist the block record.


## Leverage the Event Listener

To leverage the event listener, you need to invoke the `init` function from `EventListener` with all mandatory parameters. After init you need to start the process by invoking `processInvoke`.

```javascript
EventListener.init(JSON networkConfig, JSON listenerConfig, Object blockManagementDB) 
```
where:

* `listenerConfig` is a JSON object that can contain an array of `listenerChannels` objects, `identity` and `applicationName` for your Blockchain network.  The element `listenerChannels` are the channels where a chaincode event occurs and is captured. The
 element `identity` contain the details of the user identity for an organization. The element `applicationName` contain the name of the application.

 ```json 
				{
				"listenerChannels": [{
					"channelName": "channel name where you receive an event notification",
					"events": [{"<event name1>": "<eventHandler1>"},
						{"<event name1>": "<eventHandler1>" }]
					}],
				"identity": {
					"user": "<username>",
					"wallet":"<wallet>"},
				"applicationName": "<application name>"}
```
where:
   * `<wallet>` is the object returned from the invocation of the walletHelper.getWallet() function.
	* `<application name>` is just a string with the application name.
	* `<eventHandler1>` is simply a closure that conforms to a predefined method signature.

			```javascript
					function(payload, blockNumber);
			```
				
				where:	
				* `paylod` is the payload returned when an event occurs on an event listener channel.
				* `blockNumber` is the block header number of the block being processed.
	

* `blockManagementDB` is a reference to the Cloudant database that is created for storing the last processed block number.
You need to initialize the client code with a reference to the cloudant database and pass this reference to the `init` function of the `eventHandler`. The below code snippete provides details on how to get a reference to the database.

	```javascript
	// Load the Cloudant library.
	const cloudant = require('@cloudant/cloudant')(IBMCloudEnv.getDictionary('cloudant-credentials'));
	const blockManagementDB = cloudant.db.use("<name of the database>");
	```
	If you need more information on node-Cloudant-SDK, read [here](https://github.com/cloudant/nodejs-cloudant). For configuring the Cloudant database credentials `cloudant-credentials` on local refer to the section below.


## Chaincode Event Listener Lifecycle

### Process Start  
The function `processInvoke` sets main handler map `mainHandlerStartedMap` for a corresponding channel to true and then initiates the main handler `mainHandler`. This function gets the number of the last block processed from Cloudant. If there is no record in Cloudant yet, then start with the first block in the ledger. The main handler then starts the execution of a loop handler `loopHandler`.

### Execution of loop handler 
The loop hander traverses the ledger and for each block that the loop handler is iterating over, the loop handler invokes the event verification handler `eventVerificationHandler` to determine whether the transaction is a chaincode event or not (a block contains one or more transactions).
If it is a chaincode event, the event verification handler invokes the functionality handler. The functionality handler is defined in the application client program in the `eventFunction` object. The functionality handler contains the corresponding logic for processing the chaincode event. Only after the functionality handler has completed its processing, the event verification handler should then update Cloudant to record the number of the block that was just processed. Hence, this implies that the loop handler should not start processing the next block until processing of the current block is completed. When the event verification handler and functionality handler have both completed executing, the loop handler moves on to read the next committed block.

### Process End 
When the loop handler has finished running and has processed the last committed block in the ledger, the main handler then sets the value of `mainHandlerStartedMap` to false. This concludes the execution of the main handler.
