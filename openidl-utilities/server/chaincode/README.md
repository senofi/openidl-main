## Install and Instantiate PDC collection configuration
Chaincode is software that encapsulates the business logic and transactional instructions for creating and modifying assets in the ledger. Chaincode can be written in different languages, and IBM® Blockchain Platform supports Go and Node.js chaincode. A chaincode runs in a Docker container that is associated with any peer that needs to interact with it.
Chaincode is installed on a peer, then instantiated on a channel. All members that want to submit transactions or read data by using a chaincode need to install the chaincode on their peer. A chaincode is defined by its name and version. Both the name and version of the installed chaincode need to be consistent across the peers on a channel.

After chaincode is installed on the peers, a single network member instantiates the chaincode on the channel. The network member needs to have joined the channel in order to perform this action. Instantiation will input the initial data used by the chaincode, and then start the chaincode containers on peers joined to the channel with the chaincode installed. The peers can then use the running containers to transact. Note that only one network member needs to instantiate a chaincode. If a peer with a chaincode installed joins a channel where it has already been instantiated, the chaincode container will start automatically.

The combination of installation and instantiation is a powerful feature because it allows for a peer to use a single chaincode across many channels. Peers may want to join multiple channels that use the same chaincode, but with different sets of network members able to access the data. A peer can the install the chaincode once, and then use the same chaincode container on any channel where it has been instantiated. This lightweight approach saves compute and storage space, and helps you scale your network.

### Install Chaincode on a Peer

Chaincode installation is simply uploading the chaincode source and dependencies to the peers. This operation is "channel-agnostic" and is performed on a peer-by-peer basis. Only the peer organization's `ADMIN` identities are allowed to perform this operation. 

#### Steps to install chaincode on peers.
1. Log on to IBM Cloud and access your IBP Console.
2. Download the connection profile.
	* Navigate to smart contracts tab.
	* Go to installed smart contracts section.
	![](./Readme/img1.png)

	* Click on the overflow menu against the contract name which you want ot connect with and click on `connect with sdk` button.
	![](./Readme/img2.png)

	* Select the `msp` and `CA` details then click on `download connection profile`. 
	![](./Readme/img3.png)
3. Copy the file into the `server/chaincode/config` folder and name it `aais-network-config.json`, `faircover-network-config.json`.
4. Log on to IBM Cloud and access your IBP Blockchain Dashboard.
5. Download the admin credentials from wallet tab.
	* Click on wallet tab
	 ![](./Readme/img4.png)

	 * Click on export identity button
	 ![](./Readme/img5.png)
6. Copy the file into the `server/chaincode/config` and name it `admin-aais.json` for aais and `admin-faircover` for faircover.
```
{
    "name": "",
    "mspid": "",
    "private_key": "",
    "cert": ""
}
```
	
	
* Add a property `mspid` which contain the mspid for the organisation.

7. Create a config file `chainConfig.json`.
```
{
    "peers": [{
            "request": {
                "targets": [""],
                "chaincodePath": "",
                "chaincodeId": "",
                "chaincodeVersion": "",
                "chaincodeType": "",
                "txId": ""
            },
            "networkConfigName": "",
            "adminCertName": ""
        }
    ]
}
```
 * The `ChaincodePath` pick the chaincode from the `goPath`, so it should be set before running the script. goPath will contain the `Chaincode`.
 * This Config contains a property `peers` which contains array of request Object.
 * Each request Object contains `request`, `networkConfigName`, `adminCertName`.
 * The `request` property  contains the chaincode request object. please see  [ChaincodeInstallRequest](https://fabric-sdk-node.github.io/release-1.4/global.html#ChaincodeInstallRequest).
 * The `networkConfigName` contains the name of the `connection-profile` define in `mapping.json` file.
 * The `adminCertName` conatins the `admin-credentials` define in `mapping.json`.  
  * `txId` will be a empty string. It will get generate during runtime.

8. Run the script to `install` the chaincode.
```
	node server/chaincode/install.js.
```

#### Instantiate Chaincode
Sends a chaincode `instantiate` proposal to one or more `endorsing peers`. A chaincode must be instantiated on a `channel-by-channel` basis before it can be used. The chaincode must first be installed on the endorsing peers. 
#### Steps to install chaincode on peers
1. Create the file into the `server/chaincode/config` and name it `instantiateConfig.json`.
```
{
    "channel": [{
        "request": {
            "chaincodeId": "",
            "chaincodeType": "",
            "chaincodeVersion": "",
            "txId": ""
        },
        "channelName": ["channel1", "channel2", "channel3"],
        "networkConfigName": "",
        "adminCertName": ""
    }]
}
```
* The `channel` array containts four property, `request`, `channelName`, `networkConfigName`, `adminCertname`.
* The `request` property  contains the chaincode request object. please see  [ChaincodeInstantiateUpgradeRequest](https://fabric-sdk-node.github.io/release-1.4/global.html#ChaincodeInstantiateUpgradeRequest).
* The `channelName` contains the channel to be instantiate.
* The `networkConfigName` contains the name of the `connection-profile` define in `mapping.json` file.
* The `adminCertName` contains the `admin-credentials` define in `mapping.json`.
* The `ordererName` contains the name of the orderer.
 
 * `txId` will be a empty string. It will get generate during runtime.

 2. Create a file `collection-config.json` with cotaints `PDC` `Private data collection` config. 

 3. Run the script to `Instantiate` the chaincode.
```
	node server/chaincode/instantiate.js <option>
```
where option can be either `-i` to instantiate or `-u` to upgrade chaincode.
