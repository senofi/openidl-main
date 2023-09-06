class AbstractUserStoreClient {
  constructor() {
    if (new.target === AbstractUserStoreClient) {
      throw new TypeError('Cannot construct AbstractUserStoreClient instances directly');
    }
  }

  async init() {
    throw new Error('Must override init method');
  }

  async getUserByUsername(username) {
    throw new Error('Must override getUserByUsername method');
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
