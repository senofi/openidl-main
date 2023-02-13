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
const cron = require('node-cron');
const schedule = require('node-schedule');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()


const openidlCommonLib = require('@senofi/openidl-common-lib');
const cronHandler = require('./cron/cron-handler');
openidlCommonLib.EnvConfig.init();

const EventListener = openidlCommonLib.EventListener;
const networkConfig = require('./config/connection-profile.json');
const {setListenerConfig} = require("./helpers/listener-config-manager");
let DBManagerFactory = openidlCommonLib.DBManagerFactory;
let dbManagerFactoryObject = new DBManagerFactory();

const app = express();
//Set up logging
const logger = log4js.getLogger('index');
logger.level = config.logLevel;
app.enable('trust proxy');

app.use(function (req, res, next) {
    if (req.secure || process.env.BLUEMIX_REGION === undefined) {
        next();
    } else {
        logger.info('redirecting to https');
        res.redirect('https://' + req.headers.host + req.url);
    }
});

app.get('/health', (req, res) => {
    res.json({
        'message': 'Data call trasactional event listener is alive.'
    });
})

app.post('/start-consent-processing', jsonParser, async (req, res) => {
    logger.info("Starting Manual Consent Processing")
    logger.info("request.body: ", req.body)
    await cronHandler.pollForMaturedDataCall(req.body)
    res.json({
        'message': 'Done'
    });
})

const host = process.env.HOST || config.host;
const port = process.env.PORT || config.port;

app.listen(port, () => {
    logger.info(`app listening on http://${host}:${port}`);
    app.emit("listened", null);
});

async function init() {
    cronHandler.init();
    const pollIntervalString = config.pollIntervalString;
    logger.info("poll interval config: ", pollIntervalString);
    const job = schedule.scheduleJob(pollIntervalString, async () => await cronHandler.pollForMaturedDataCall());
    logger.info("job scheduling done  ", job);
    let dbManager = await dbManagerFactoryObject.getInstance(JSON.parse(process.env.OFF_CHAIN_DB_CONFIG));
    let listenerConfig = await setListenerConfig();
    try {
        await EventListener.init(networkConfig, listenerConfig, dbManager, config.targetDB);
        await EventListener.processInvoke();
    } catch (err) {
        logger.error('eventHandler init error' + err);
    }
}

init();
