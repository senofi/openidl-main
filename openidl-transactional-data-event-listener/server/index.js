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
const bodyParser = require('body-parser');
const openidlCommonLib = require('@senofi/openidl-common-lib');

const { initCronJob } = require('./cron/cronJob');
const httpsRedirect = require('./express/middleware/httpsRedirect');
const { initEventListener } = require('./service/eventListenerService');
const expressRoutes = require('./express');

// Init common lib
openidlCommonLib.EnvConfig.init();

//Set up logging
const logger = log4js.getLogger('index');
logger.level = config.logLevel;
const expressLogger = log4js.getLogger('express');

// Setup express
const app = express();
app.use(bodyParser);
app.use(httpsRedirect);
app.use(log4js.connectLogger(expressLogger, { level: 'auto' }));
app.enable('trust proxy');

expressRoutes(app);

const host = process.env.HOST || config.host;
const port = process.env.PORT || config.port;

app.listen(port, () => {
	logger.info(`app listening on http://${host}:${port}`);
	app.emit('listened', null);
});

// Init cron job
initCronJob();

// Init Event listener
initEventListener();
