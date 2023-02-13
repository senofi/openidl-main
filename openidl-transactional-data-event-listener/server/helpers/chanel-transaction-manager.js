import {Transaction} from "@senofi/openidl-common-lib";
import networkConfig from "../config/connection-profile.json";

const targetChannelConfig = require('../config/target-channel-config');
export default function setChanelTransaction() {
    let ChannelTransactionMap = new Map();
    const org = targetChannelConfig.users[0].org;
    const user = targetChannelConfig.users[0].user;
    const orgMSPId = targetChannelConfig.users[0].mspId;
    targetChannelConfig.targetChannels.forEach(targetChannel => {
        const targetChannelTransaction = new Transaction(org, user, targetChannel.channelName, targetChannel.chaincodeName, orgMSPId);
        targetChannelTransaction.init(networkConfig);
        ChannelTransactionMap.set(targetChannel.channelName, targetChannelTransaction);
    });
    return ChannelTransactionMap;
}
