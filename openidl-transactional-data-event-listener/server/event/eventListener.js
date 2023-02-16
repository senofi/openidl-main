const { targetDB } = require('config');
const openidlCommonLib = require('@senofi/openidl-common-lib');

const networkConfig = require('../config/connection-profile.json');
const { createListenerConfig } = require('./listenerConfig');

let DBManagerFactory = openidlCommonLib.DBManagerFactory;
let dbManagerFactoryObject = new DBManagerFactory();

const EventListener = openidlCommonLib.EventListener;

const initEventListener = async () => {
	const options = JSON.parse(process.env.OFF_CHAIN_DB_CONFIG);
	const dbManager = await dbManagerFactoryObject.getInstance(
		{ mongo: options },
		options.persistentStore
	);
	const listenerConfig = await createListenerConfig();
	try {
		await EventListener.init(
			networkConfig,
			listenerConfig,
			dbManager,
			targetDB
		);
		await EventListener.processInvoke();
	} catch (err) {
		logger.error('eventHandler init error' + err);
	}
};

module.exports = {
	initEventListener
};
