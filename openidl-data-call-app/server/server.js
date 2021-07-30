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


const bodyParser = require('body-parser');
const express = require('express');
const log4js = require('log4js');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const config = require('config');
const cors = require('cors');
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const IBMCloudEnv = require('ibm-cloud-env');
IBMCloudEnv.init();
const routes = require('./routes');
const openidlCommonLib = require('@openidl-org/openidl-common-lib');
const transactionFactory = require('./helpers/transaction-factory');
const networkConfig = require('./config/connection-profile.json');
global.fetch = require('node-fetch');
const logger = log4js.getLogger('server');
logger.level = config.logLevel;

// transactionFactory.init(IBMCloudEnv.getDictionary('aais-db-credentials'), networkConfig);
logger.info('the idp credentials from env/local file');
logger.info(IBMCloudEnv.getDictionary('idp-credentials'));

const authHandler = openidlCommonLib.AuthHandler.setHandler('cognito');
authHandler.init(IBMCloudEnv.getDictionary('idp-credentials'));

const errorHandler = require('./middlewares/error-handler');
const app = express();

app.use(cors());
/**
 * Set up logging
 */


logger.debug('setting up app: registering routes, middleware...');


/**
 * Load swagger document
 */

const swaggerDocument = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../public', 'swaggerapi.yaml'), 'utf8'));

/**
 * Support json parsing
 */
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json({
    limit: '50mb'
}));


logger.debug('setting up app: registering routes, middleware...');

/** 
 * middleware for authentication
 */

app.use(helmet());
app.use(cookieParser());
app.use(helmet.noCache());
app.enable("trust proxy");
app.use(authHandler.configureSSL);
// TODO Unable to move passport related stuff to middleware need expert help 
// TODO discuss on standard session maintenance approach from Node.js for production
app.use(session({
    secret: "123456",
    resave: true,
    saveUninitialized: true
}));

logger.debug('setting up app: initializing passport');
const passport = authHandler.getPassport();
app.use(passport.initialize());
app.use(passport.session());
authHandler.setStrategy(passport);

app.enable('trust proxy');

app.use(function (req, res, next) {
    if (req.secure || process.env.BLUEMIX_REGION === undefined) {
        next();
    } else {
        console.log('redirecting to https');
        res.redirect('https://' + req.headers.host + req.url);
    }
});

/**
 * GET home page
 */
app.get('/', (req, res) => {
    logger.debug('GET /');
    res.redirect('/api-docs');
});

let options = {
    docExpansion: ['tags', 'operations']
}

var swaggerOptions = {
    defaultModelsExpandDepth: -1,
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, false, swaggerOptions));
/**
 * Register routes
 */

app.use('/openidl/api', routes);

/**
 * Error handler
 */
app.use(errorHandler.catchNotFound);
app.use(errorHandler.handleError);

/**
 * Start server
 */
const host = process.env.HOST || config.host;
const port = process.env.PORT || config.port;
if (networkConfig.isLocal) {
    console.log("  local cert config  " + IBMCloudEnv.getDictionary('off-chain-kvs-credentials'));
} else {
    console.log("  cert config  " + IBMCloudEnv.getDictionary('IBM-certificate-manager-credentials'));
}


// use the off chain kvs store for local network
transactionFactory.init(
    IBMCloudEnv.getDictionary(networkConfig.isLocal
        ? 'off-chain-kvs-credentials' : 'IBM-certificate-manager-credentials')
    , networkConfig)
    .then(data => {
        console.log('transaction factory init done');
        app.listen(port, () => {
            logger.info(`app listening on http://${host}:${port}`);
            logger.info(`Swagger UI is available at http://${host}:${port}/api-docs`);
            app.emit("listened", null);
        });
    }).catch(err => {
        logger.error('transaction factory init error' + err);
    });
module.exports = app;