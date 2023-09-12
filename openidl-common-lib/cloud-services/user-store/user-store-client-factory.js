const MongoUserStoreClient = require(
  './impl/mongo-user-store-client',
);

let instance = null;
let instanceCreationPromise = null;

class UserDataStoreClientFactory {
  static async getInstance() {
    if (instance) {
      return Promise.resolve(instance);
    }
    if (!instanceCreationPromise) {
      instanceCreationPromise = new MongoUserStoreClient().init()
        .then((createdInstance) => {
          instance = createdInstance;
          return instance;
        });
    }

    return instanceCreationPromise;
  }
}

module.exports = UserDataStoreClientFactory;
