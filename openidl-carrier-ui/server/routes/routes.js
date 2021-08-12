'use strict';
const express = require('express');
const app = express();

const openidlCommonLib = require('@openidl-org/openidl-common-lib');
const idpCredentials = JSON.parse(process.env.IDP_CONFIG);
const authHandler = openidlCommonLib.AuthHandler.setHandler(idpCredentials);
const commonController = require('../controllers/common');
const bodyParser = require('body-parser');
const router = express.Router();

app.use(bodyParser.json());

//module.exports = function(app) {
// Application Login
router.route('/login').post(authHandler.authenticate, authHandler.getUserAttributes, commonController.login);
// /authHandler.authenticate, authHandler.getUserAttributes, authHandler.storeTokenInCookie,

// Application logout
router.route('/logout').post(authHandler.logout, commonController.logout);

// Get data calls according to the params passed eg: status, page index etc
router.route('/list-data-calls-by-criteria').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getDataCalls);

/**
 * Search data call based on wildcard string
 */
router.route('/search-data-calls').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getSearchDataCalls);


// Get LOBs
router.route('/lob').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getLOBs);

// Get Block history
router.route('/block-explorer').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getBlockHistory);

// Data call related tasks such as create, update etc
router.route('/data-call').post(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.dataCall);

// Get draft version
router.route('/data-call-versions/:id').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.dataCallVersions);

// Get like status
router.route('/like-status-data-call/:id/:version/:orgid').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getLikeStatus);

// Get consent status
router.route('/consent-status-data-call/:id/:version/:orgid').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getConsentStatus);

// Get Consent Count
router.route('/consent-count/:id/:version').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getConsentCount);

// Get Like Count
router.route('/like-count/:id/:version').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getLikeCount);

// Like / Unlike a data call
router.route('/like').post(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.likeUnlikeDataCall);

// List likes
router.route('/list-likes-by-data-call/:id/:version').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.listLikes);

// List Consents
router.route('/list-consents-by-data-call/:id/:version').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.listConsents);

// Get Reports
router.route('/report').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getReport);

// Provide consent to a data call
router.route('/consent').post(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.provideConsent);

// Get data call details
router.route('/data-call/:id/:version').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getDataCallDetails);

// Get data call history
router.route('/data-call-log/:id/:version').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getDataCallHistory);

router.route('/list-extraction-patterns').get(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getExtrationPattern);

router.route('/extraction-patterns').post(authHandler.isLoggedIn, authHandler.getUserRole, authHandler.validateToken, commonController.getExtractionPatternsById);

module.exports = router;
//}
