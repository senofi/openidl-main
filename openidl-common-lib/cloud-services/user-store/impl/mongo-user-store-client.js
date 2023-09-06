const log4js = require('log4js');
const config = require('config');
const { MongoClient } = require('mongodb');

const AbstractUserStoreClient = require(
  '../abstract-user-store-client',
);

const logger = log4js.getLogger('mongdb-user-store-client');
logger.level = config.logLevel;

class MongoUserStoreClient extends AbstractUserStoreClient {
  constructor() {
    super();
    this.collection = null;
    this.collectionName = 'users';
  }

  async init() {
    const offChainDbConfig = JSON.parse(process.env.OFF_CHAIN_DB_CONFIG);
    const mongoConfig = offChainDbConfig.mongo;

    const client = new MongoClient(mongoConfig.simpleURI);
    await client.connect();

    this.db = client.db(mongoConfig.mongodb);

    this.collection = await this._createOrUpdateCollection();

    return this;
  }

  async _createOrUpdateCollection() {
    const validator = {
      $jsonSchema: {
        bsonType: 'object',
        title: 'User Validation',
        required: ['username', 'stateName', 'stateCode', 'role', 'organizationId'],
        properties: {
          username: {
            bsonType: 'string',
            description: '\'username\' must be a string and is required',
          },
          stateName: {
            bsonType: 'string',
            description: '\'stateName\' must be a string and is required',
          },
          stateCode: {
            bsonType: 'string',
            description: '\'stateCode\' must be a string and is required',
          },
          role: {
            bsonType: 'string',
            description: '\'role\' must be a string and is required',
          },
          organizationId: {
            bsonType: 'string',
            description: '\'organizationId\' must be a string and is required',
          },
        },
      },
    };

    // Check if the collection exists
    const collections = await this.db.listCollections({ name: this.collectionName })
      .toArray();

    let collection = null;

    if (collections.length === 0) {
      // Collection does not exist, create it
      await this.db.createCollection(this.collectionName, { validator });
      collection = this.db.collection(this.collectionName);
      collection.createIndex({ username: 1 }, { unique: true });
      logger.info(`Collection ${this.collectionName} created with validator.`);
    } else {
      // Collection exists, update its validator
      await this.db.command({
        collMod: this.collectionName,
        validator,
      });
      collection = this.db.collection(this.collectionName);
      console.log(`Validator for collection ${this.collectionName} updated.`);
    }
    return collection;
  }

  async getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      try {
        this.collection
          .findOne({ username }, (error, result) => {
            if (error) {
              logger.error(`Error fetching user by username ${username} from MongoDB! Error:`, error);
              reject(error);
            } else {
              logger.debug(`User with username ${username} fetched successfully from MongoDB!`);
              resolve(result);
            }
          });
      } catch (err) {
        logger.error('Error updating record in mongodb', err);
        reject(err);
      }
    });
  }

  async storeUser(user) {
    return new Promise((resolve, reject) => {
      try {
        this.collection
          .insertOne(user, (error, result) => {
            if (error) {
              logger.error(`Error storing user ${user} in MongoDB! Error:`, error);
              reject(error);
            } else {
              logger.debug(`User ${user} stored successfully in MongoDB!`);
              resolve(result);
            }
          });
      } catch (err) {
        logger.error('Error updating record in mongodb', err);
        reject(err);
      }
    });
  }

  async upsertUser(user) {
    return new Promise((resolve, reject) => {
      try {
        this.collection
          .updateOne({ username: user.username }, user, { upsert: true }, (error, result) => {
            if (error) {
              logger.error(`Error upserting user ${user} in MongoDB! Error:`, error);
              reject(error);
            } else {
              logger.debug(`User ${user} upserted successfully in MongoDB!`);
              resolve(result);
            }
          });
      } catch (err) {
        logger.error('Error updating record in mongodb', err);
        reject(err);
      }
    });
  }

  async updateUser(user) {
    return new Promise((resolve, reject) => {
      try {
        this.collection
          .updateOne({ username: user.username }, user, (error, result) => {
            if (error) {
              logger.error(`Error updating user ${user} in MongoDB! Error:`, error);
              reject(error);
            } else {
              logger.debug(`User ${user} updated successfully in MongoDB!`);
              resolve(result);
            }
          });
      } catch (err) {
        logger.error('Error updating record in mongodb', err);
        reject(err);
      }
    });
  }

  async deleteUser(user) {
    return new Promise((resolve, reject) => {
      try {
        this.collection
          .deleteOne({ username: user.username }, (error, result) => {
            if (error) {
              logger.error(`Error deleting user ${user} in MongoDB! Error:`, error);
              reject(error);
            } else {
              logger.debug(`User ${user} deleted successfully in MongoDB!`);
              resolve(result);
            }
          });
      } catch (err) {
        logger.error('Error updating record in mongodb', err);
        reject(err);
      }
    });
  }
}

module.exports = MongoUserStoreClient;
