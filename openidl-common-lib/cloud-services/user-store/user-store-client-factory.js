const MongoUserStoreClient = require(
  './impl/mongo-user-store-client',
);

let instance = null;

class UserDataStoreClientFactory {
  static async getInstance() {
    if (instance) {
      return instance;
    }

    instance = await new MongoUserStoreClient().init();
    return instance;
  }
}

module.exports = UserDataStoreClientFactory;
