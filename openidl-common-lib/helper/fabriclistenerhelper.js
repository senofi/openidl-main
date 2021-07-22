/**
 * Copyright 2018 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */


const log4js = require('log4js');
const config = require('config');
const {
    Gateway
} = require('fabric-network');

const logger = log4js.getLogger('helper -fabriclistenerhelper ');
logger.level = config.logLevel;

const MESSAGE_CONFIG = require('./config/ibp-messages-config.js');


class FabricListenerHelper {
    constructor(org, user, channelName, orgMSPId, wallet, peer, isLocalHost) {
        this.org = org;
        this.user = user;
        this.channelName = channelName;
        this.orgMSPId = orgMSPId;
        this.gateway = new Gateway();
        this.wallet = wallet;
        this.peer = peer;
        this.isLocalHost = isLocalHost;
    }
    init(connProfilePath) {
        this.ccp = connProfilePath;
    }

    async initEventHub() {
        logger.debug('init event hub');
        logger.debug('channel:' + this.channelName);
        logger.debug('user:' + this.user);
        await this.gateway.connect(this.ccp, {
            identity: this.user,
            wallet: this.wallet,
            discovery: { enabled: true, asLocalhost: this.isLocalHost }
        });
        const network = await this.gateway.getNetwork(this.channelName);
        logger.info("Network is " + network);
        const channel = network.getChannel();
        logger.info("channel  is " + channel);
        const peer = channel.getPeersForOrg(this.orgMSPId);

        logger.info("peer  is " + peer[0]);
        this.eventHub = channel.newChannelEventHub(peer[0]);
        //  finally { //TODO need to discuss 
        //   this.gateway.disconnect();
        // }

    }

    handleError(err, retryCountPending) {
        let isMessageFound = false;
        for (let messageIndex = 0; messageIndex < MESSAGE_CONFIG.errorMessages.length; messageIndex++) {
            if (err.message != null && err.message.includes(MESSAGE_CONFIG.errorMessages[messageIndex])) {
                isMessageFound = true;
                break;
            }
        }

        if (isMessageFound) {
            if (retryCountPending == undefined) {
                retryCountPending = MESSAGE_CONFIG.retryCount;
            } else if (retryCountPending == 0) {
                throw new Error(err);
            }
            retryCountPending--;
            return retryCountPending;
        } else {
            throw new Error(err);
        }
    }

    getChannelName() {
        return this.channelName;
    }


    async getBlockDetails(retryCountPending) {
        logger.debug('get block details');
        try {
            await this.gateway.connect(this.ccp, {
                identity: this.user,
                wallet: this.wallet,
                discovery: { enabled: true, asLocalhost: this.isLocalHost }
            });
            const network = await this.gateway.getNetwork(this.channelName);
            const channel = network.getChannel();
            const queryInfo = await channel.queryInfo();
            logger.debug('height');
            logger.debug(queryInfo.height);
            const blockHeight = queryInfo.height.low;
            const promiseArray = [];
            for (let index = blockHeight - 5; index < blockHeight; index++) {
                promiseArray.push(channel.queryBlock(index));
            }
            const blockData = await Promise.all(promiseArray);
            return blockData.map(block => block.header.data_hash);
        } catch (err) {
            logger.error('getBlockDetails error ' + err);
            return this.getBlockDetails(this.handleError(err, retryCountPending));
        } finally {
            this.gateway.disconnect();
        }
    };

    async getBlockHeight(retryCountPending) {
        logger.debug('get block height');
        try {
            // gateway and contract connection
            await this.gateway.connect(this.ccp, {
                identity: this.user,
                wallet: this.wallet,
                discovery: { enabled: true, asLocalhost: this.isLocalHost }
            });
            const network = await this.gateway.getNetwork(this.channelName);
            const channel = network.getChannel();
            const queryInfo = await channel.queryInfo();
            logger.debug('height');
            logger.debug(queryInfo.height);
            return queryInfo.height;
        } catch (err) {
            logger.error('getBlockHeight error ' + err);
            return this.getBlockHeight(this.handleError(err, retryCountPending));
        } finally {
            this.gateway.disconnect();
        }
    }

    async getBlockDataByBlockNumber(blockNumber, retryCountPending) {
        logger.debug('getBlockDataByBlockNumber method entry');
        try {
            // gateway and contract connection
            await this.gateway.connect(this.ccp, {
                identity: this.user,
                wallet: this.wallet,
                discovery: { enabled: true, asLocalhost: this.isLocalHost }
            });
            const network = await this.gateway.getNetwork(this.channelName);
            const channel = network.getChannel();
            const blockData = await channel.queryBlock(blockNumber);
            logger.debug('getBlockDataByBlockNumber method exit');
            return blockData;
        } catch (err) {
            logger.error('getBlockDataByBlockNumber error ' + err);
            return this.getBlockDataByBlockNumber(blockNumber, this.handleError(err, retryCountPending));
        } finally {
            this.gateway.disconnect();
        }
    }

};


module.exports = FabricListenerHelper;