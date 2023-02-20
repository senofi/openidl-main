/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const express = require('express');
const log4js = require('log4js');
const config = require('config');
const openidlCommonLib = require('@senofi/openidl-common-lib');
openidlCommonLib.EnvConfig.init();

const EventListener = openidlCommonLib.EventListener;
const walletHelper = openidlCommonLib.Wallet;
const channelConfig = require('./config/listener-channel-config.json');
const networkConfig = require('./config/connection-profile.json');
const mainEvent = require('./event/event-handler');

let DBManagerFactory = openidlCommonLib.DBManagerFactory;
let dbManagerFactoryObject = new DBManagerFactory();

const app = express();
const logger = log4js.getLogger('index');
// setup logging
logger.level = config.logLevel;
app.enable('trust proxy');

app.use(function (req, res, next) {
    if (req.secure || process.env.BLUEMIX_REGION === undefined) {
        next();
    } else {
        logger.info('Redirecting to https..')
        res.redirect('https://' + req.headers.host + req.url);
    }
});

const host = process.env.HOST || config.host;
const port = process.env.PORT || config.port;

app.get('/health', (req, res) => {
    logger.info("Health api Invoked");
    res.json({
        'message': 'Data call mood listener is alive.'
    });
})


app.listen(port, () => {
    logger.info(`app listening on http://${host}:${port}`);
    app.emit("listened", null);
});

async function init() {
    const options = JSON.parse(process.env.OFF_CHAIN_DB_CONFIG);

    let dbManager = await dbManagerFactoryObject.getInstance(options);
    logger.debug("dbManager instance " + dbManager);
    let listenerConfig = {};
    let listernerChannels = new Array();
    for (let index = 0; index < channelConfig.listenerChannels.length; index++) {
        let channelName = channelConfig.listenerChannels[index].channelName;
        let listenerChannel = {};
        logger.debug("channelName" + channelName);
        listenerChannel["channelName"] = channelName;

        let events = [];
        for (let index1 = 0; index1 < channelConfig.listenerChannels[index].events.length; index1++) {
            let eventName = channelConfig.listenerChannels[index].events[index1];
            logger.debug("EVENT NAME " + Object.keys(eventName));
            let event = {};
            event[Object.keys(eventName)] = mainEvent.eventFunction[Object.keys(eventName)];
            events.push(event)
        }
        listenerChannel["events"] = events;
        logger.debug("listenerChannel" + listenerChannel);
        listernerChannels.push(listenerChannel);

    }
    listenerConfig['listenerChannels'] = listernerChannels;
    await walletHelper.init(JSON.parse(process.env.KVS_CONFIG));
    var idExists = await walletHelper.identityExists(channelConfig.identity.user);
    if (!idExists) {
        throw new Error("Invalid Identity, no certificate found in certificate store");
    }
    const wallet = walletHelper.getWallet();
    let identity = {};
    logger.debug(channelConfig.identity.user);
    identity['user'] = channelConfig.identity.user;
    identity['wallet'] = wallet;
    let applicationName = channelConfig.applicationName;
    listenerConfig["applicationName"] = applicationName;
    listenerConfig['identity'] = identity;
    logger.debug('Listener Config', listenerConfig);

    try {
        await EventListener.init(networkConfig, listenerConfig, dbManager, config.targetDB);
        await EventListener.processInvoke();
    } catch (err) {
        logger.error('eventHandler init error' + err);
    }
}

init();