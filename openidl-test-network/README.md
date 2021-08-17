## Intro
This document details the steps necessary for bringing up the Blokchain network and the smart contracts in local evironment. After following this document, you should be able to stand up a Blockchain network that will interact with the Openidl app to submit or query transaction that are to be persisted in the Blockchain.

After introducing Hyperledger Fabric, we will go through the prerequisites, and then will go step by step on how to bring up the network. 

## What is a Hyperledger Fabric Network
Source and more details: https://hyperledger-fabric.readthedocs.io/en/release-2.2/whatis.html
A blockchain is an immutable transaction ledger, maintained within a distributed network of peer nodes. These nodes each maintain a copy of the ledger by applying transactions that have been validated by a consensus protocol, grouped into blocks that include a hash that bind each block to the preceding block.
Hyperledger Fabric is an open source enterprise-grade permissioned distributed ledger technology (DLT) platform, designed for use in enterprise contexts.
Started under the Linux Foundation, Hyperledger Fabric has a mosular architecture that separates the duties of peer, ordering, and ideantity certificates. The Favric platform is **permissioned**, meaning that the participants, even though they may not fully trust each other, can come together under a governance model like a legal agreement and have a framework for handling disputes.

At a high level, a hyperledger Fabric platorm is composed of the following components in addition to the participants("peers"):

1. An ordering service ("orderer") that orders transactions and broadcast them to peets in blocks of transactions.
2. A membership service provider ("Fabric Certificate Authority") for associating entities in the network with cryptographic identities.
3. Smart contracts (“chaincode”) run within a container environment (e.g. Docker) for isolation.

Next, we will go through the steps to stand up the Hyperledger Fabric platform in a local environment.

## Prerequisites
To run the Blockchain network, you will need several applications installed in your device. We will show the commands For Ubuntu Linux and Mac, and the commands for other Oses should be available in the application dcos.
### Install Git
https://git-scm.com/downloads
For ubuntu
```
$ sudo apt install git-all
```
For Mac:
```
$ brew install git
```

### Install Git
https://curl.haxx.se/download.html
For ubuntu
```
$ sudo apt install git-all
```
For Mac:
```
$ brew install git
```

### Install Docker
Please follow the documrntation given below to make sure you have Docker and you have it set up in correct way:
https://hyperledger-fabric.readthedocs.io/en/release-2.2/prereqs.html#docker-and-docker-compose

For more details and troubleshooting, please refer to
https://hyperledger-fabric.readthedocs.io/en/release-2.2/prereqs.html#
 
## TL;DR: One step setup
We will be using HyperLedger Fabric 2.2.

To run through all the steps in one go, from the main directory of this repo:
```
$ cd openidl-test-network
$ ./start.sh
```
This should bring up all the components of the Fabric platform, register the necessary identities, and deploy the Openidl smart contracts, and now it should be ready to interact with the Openidl app,

In the next section, we will go though the steps in details.

## Step by step in detail

## Starting up the base network
First, let's mmake sure we are starting from a blank slate and there are no dangling containers. From the main directory of the repo:
```
$ cd openidl-test-network
$ /network.sh down
```

Next, we will pull all the necessary docker images and binaries 
```
$ ./bootstrap.sh 2.2.3 1.5.0
```
This will pull the Docker images for the Hyperledfer Fabric services (Peers, Certificate Authorities, Orderers etc.) and also the binaries necessary for Fabric management. The version for Fabric would be `2.2.3` and the Certificate Authority (CA) is `1.5.0`

Next, we will start up the network that will comprise of several Docker containers for different Fabric services.

```
$ ./network.sh up -ca -s couchdb
```
This command will create a Hyperledger Fabric network with three different participating organizations:
1. aais
2. carrier
3. analytics

each organization will have one `peer`, each peer will have a `couchdb` database for saving the world state, and each organization will have one certificate authority (`ca`) each. There will also be an `orderer`, a corresponding `ca`, a `fabric-tools` container and a `couchdb` container as the key store.

After the command completes, you can see the list of containers by running
```
$ docker ps -a
```

## Creating Channels
In this step, we will create the necessary channels. A participating orgnazition (peer) needs to join channel in order to create and transfer assets. Channels are private layer of communication between specific organizations, and are invisible to other organiations.

```
# create the defaultchannel
$ ./network.sh createChannel -c defaultchannel -p DefaultChannel

# create the analytics-aais
$ ./network.sh createChannel -c analytics-aais -p AnalyticsAaisChannel

# create the analytics-carrier
$ ./network.sh createChannel -c analytics-carrier -p AnalyticsCarrierChannel

```

These will create 3 channels, `defaultchannel`, `analytics-aais`, and `analytics-carrier`. The `defaultchannel` will include all three organizations, and other two channels will have organizations corresponding to the channel names.

## Package and install Smart Contracts (Chaincodes)
Organizations that want to validate transactions or query the ledger need to install a chaincode on their peers. The Openidl chaincodes are in the `openidl-chaincode` directory.
First, you will need to package the chaincode and install it in peers to prepare it for deployment in the next step.
```
# package and install 'openidl-cc-default' chaincode on aais node
$ ./network.sh deployCC -ccn openidl-cc-default -ccp ../openidl-chaincode/chaincode/openidl -ccl go -ccsd true

# package and install 'openidl-cc-aais-carriers' chaincode on aais, analytics and carrier nodes 
$ ./network.sh deployCC -ccn openidl-cc-aais-carriers -ccp ../openidl-chaincode/chaincode/openidl -ccl go -ccsd true

```

## Deploy the Chaincode
In this step, we will deploy the Chaincodes in the corresponding Channels and corresponding peers. We also need to confifigure the private data collection to be part of the channels:
```
# deploy 'openidl-cc-default' chaincode on 'defaultchannel'
$ ./network.sh deployCC -c defaultchannel -ccn openidl-cc-default -ccp ../openidl-chaincode/chaincode/openidl -ccl go -cci Init -ccsp true

# deploy 'openidl-cc-aais-carriers' chaincode on 'analytics-aais'
$ ./network.sh deployCC -c analytics-aais -ccn openidl-cc-aais-carriers -ccp ../openidl-chaincode/chaincode/openidl -ccl go -cci Init -ccsp true -cccg ../openidl-chaincode/chaincode/openidl/collection-config-analytics-aais.json

# deploy 'openidl-cc-aais-carriers' chaincode on 'analytics-carrier'
$ ./network.sh deployCC -c analytics-carrier -ccn openidl-cc-aais-carriers -ccp ../openidl-chaincode/chaincode/openidl -ccl go -cci Init -ccsp true -cccg ../openidl-chaincode/chaincode/openidl/collection-config-analytics-carrier.json

```
After this step, the Chaincodes will be deployed and ready to process transactions. You can see the new chaincode containers listed in the ```docker ps -a``` command.
## Pre-register Users in Certificate Authorities:
TODO
## Upgrades