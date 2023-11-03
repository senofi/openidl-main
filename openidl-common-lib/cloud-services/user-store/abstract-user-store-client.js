class AbstractUserStoreClient {
  constructor() {
    if (new.target === AbstractUserStoreClient) {
      throw new TypeError('Cannot construct AbstractUserStoreClient instances directly');
    }
  }

  async init() {
    throw new Error('Must override init method');
  }

  async getUserById(userId) {
    throw new Error('Must override getUserById method');
  }

  async storeUser(user) {
    throw new Error('Must override storeUser method');
  }

  async upsertUser(user) {
    throw new Error('Must override upsertUser method');
  }

  async updateUser(user) {
    throw new Error('Must override updateUser method');
  }

  async deleteUser(user) {
    throw new Error('Must override deleteUser method');
  }
}

module.exports = AbstractUserStoreClient;
