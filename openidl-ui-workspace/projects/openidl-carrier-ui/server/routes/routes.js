'use strict';
const express = require('express');
const app = express();
const openidlCommonApp = require('../../../openidl-common-ui/server/index');
const userAuthHandler = openidlCommonApp.UserAuthHandler;
const apiAuthHandler = openidlCommonApp.ApiAuthHandler;
const commonController = require('../controllers/common');
const NODE_ENV = process.env.NODE_ENV || 'development';
const router = express.Router();
const API_URL = '/api';
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//module.exports = function(app) {
// Application Login
router.route(API_URL + '/login').post(userAuthHandler.authenticate, userAuthHandler.getUserAttributes, apiAuthHandler.getApiToken, commonController.login);
// /userAuthHandler.authenticate, userAuthHandler.getUserAttributes, apiAuthHandler.getApiToken, userAuthHandler.storeTokenInCookie,

// Application logout
router.route(API_URL + '/logout').post(userAuthHandler.logout, commonController.logout);

// Get data calls according to the params passed eg: status, page index etc
router.route(API_URL + '/list-data-calls-by-criteria').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getDataCalls);

/**
 * Search data call based on wildcard string
 */
router.route('/search-data-calls').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getSearchDataCalls);


// Get LOBs
router.route(API_URL + '/lob').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getLOBs);

// Get Block history
router.route(API_URL + '/block-explorer').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getBlockHistory);

// Data call related tasks such as create, update etc
router.route(API_URL + '/data-call').post(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.dataCall);

// Get draft version
router.route(API_URL + '/data-call-versions/:id').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.dataCallVersions);

// Get like status
router.route(API_URL + '/like-status-data-call/:id/:version/:orgid').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getLikeStatus);

// Get consent status
router.route(API_URL + '/consent-status-data-call/:id/:version/:orgid').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getConsentStatus);

// Get Consent Count
router.route(API_URL + '/consent-count/:id/:version').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getConsentCount);

// Get Like Count
router.route(API_URL + '/like-count/:id/:version').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getLikeCount);

// Like / Unlike a data call
router.route(API_URL + '/like').post(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.likeUnlikeDataCall);

// List likes
router.route(API_URL + '/list-likes-by-data-call/:id/:version').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.listLikes);

// List Consents
router.route(API_URL + '/list-consents-by-data-call/:id/:version').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.listConsents);

// Get Reports
router.route(API_URL + '/report').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getReport);

// Provide consent to a data call
router.route(API_URL + '/consent').post(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.provideConsent);

// Get data call details
router.route(API_URL + '/data-call/:id/:version').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getDataCallDetails);

// Get data call history
router.route(API_URL + '/data-call-log/:id/:version').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getDataCallHistory);

router.route(API_URL + '/list-extraction-patterns').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getExtrationPattern);

router.route(API_URL + '/extraction-patterns').post(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getExtractionPatternsById);

module.exports = router;
//}
