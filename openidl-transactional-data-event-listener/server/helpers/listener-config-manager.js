const {mainEvent} = require('.././event/event-handler');
const openidlCommonLib = require('@senofi/openidl-common-lib');
const channelConfig = require('.././config/listener-channel-config.json');
const log4js = require('log4js');
const walletHelper = openidlCommonLib.Wallet;
const logger = log4js.getLogger('index');

export async function setListenerConfig() {
    const listenerConfig = {};
    listenerConfig.listenerChannels = channelConfig.listenerChannels.map(listenerChannel => {
        const {channelName, event} = listenerChannel;
        logger.debug(`channelName: ${channelName}`);

        const events = event.map(eventName => {
            logger.debug(`EVENT NAME: ${Object.keys(eventName)}`);
            return {[Object.keys(eventName)]: mainEvent.eventFunction[Object.keys(eventName)]};
        });
        logger.debug(`listenerChannel: ${listenerChannel}`);
        return {channelName, events};
    });
    await walletHelper.init(JSON.parse(process.env.KVS_CONFIG));
    const idExists = await walletHelper.identityExists(channelConfig.identity.user);
    if (!idExists) {
        throw new Error("Invalid Identity, no certificate found in certificate store");
    }
    const wallet = walletHelper.getWallet();
    const identity = {
        user: channelConfig.identity.user,
        wallet,
    };
    listenerConfig.applicationName = channelConfig.applicationName;
    listenerConfig.identity = identity;

    return listenerConfig;
}
