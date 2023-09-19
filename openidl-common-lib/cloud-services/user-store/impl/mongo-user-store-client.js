const log4js = require('log4js');
const config = require('config');
const { MongoClient } = require('mongodb');

const AbstractUserStoreClient = require(
  '../abstract-user-store-client',
);

const logger = log4js.getLogger('mongodb-user-store-client');
logger.level = config.logLevel;

class MongoUserStoreClient extends AbstractUserStoreClient {
  constructor() {
    super();
    this.collection = null;
    this.collectionName = 'users';
    this.adminAttributes = {};
  }

  async init() {
    const offChainDbConfig = JSON.parse(process.env.OFF_CHAIN_DB_CONFIG);
    this.adminAttributes = offChainDbConfig.admin;

    const mongoConfig = offChainDbConfig.mongo;
    const { simpleURI } = mongoConfig;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    let connectionURI = simpleURI;

    if (!simpleURI) {
      const ca = mongoConfig.connection.mongodb.certificate.certificate_base64;

      options.ssl = true;
      options.sslValidate = false;
      options.sslCA = ca;

      connectionURI = mongoConfig.connection.mongodb.composed[0];
    }

    const client = await MongoClient.connect(connectionURI, options);

    this.db = client.db(mongoConfig.mongodb);

    // eslint-disable-next-line no-underscore-dangle
    await this._createOrUpdateCollection();

    return this;
  }

  // eslint-disable-next-line no-underscore-dangle
  async _createOrUpdateCollection() {
    const validator = {
      $jsonSchema: {
        bsonType: 'object',
        title: 'User Validation',
        required: ['userId', 'stateName', 'stateCode', 'role', 'organizationId'],
        properties: {
          userId: {
            bsonType: 'string',
            description: '\'userId\' must be a string and is required',
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

    if (collections.length === 0) {
      // Collection does not exist, create it
      await this.db.createCollection(this.collectionName, { validator });
      this.collection = await this.db.collection(this.collectionName);
      await this.collection.createIndex({ userId: 1 }, { unique: true });
      // eslint-disable-next-line no-underscore-dangle
      await this._insertAdmin();
      logger.info(`Collection ${this.collectionName} created with validator.`);
    } else {
      // Collection exists, update its validator
      await this.db.command({
        collMod: this.collectionName,
        validator,
      });
      this.collection = this.db.collection(this.collectionName);
      logger.info(`Validator for collection ${this.collectionName} updated.`);
    }
  }

  // eslint-disable-next-line no-underscore-dangle
  async _insertAdmin() {
    const admin = {
      ...this.adminAttributes,
      role: 'admin',
    };
    return this.collection.insertOne(admin);
  }

  async getUserById(userId) {
    return new Promise((resolve, reject) => {
      try {
        this.collection
          .findOne({ userId }, (error, result) => {
            if (error) {
              logger.error(`Error fetching user by ID ${userId} from MongoDB! Error:`, error);
              reject(error);
            } else {
              logger.debug(`User with ID ${userId} fetched successfully from MongoDB!`);
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
          .updateOne({ userId: user.userId }, user, { upsert: true }, (error, result) => {
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
          .updateOne({ userId: user.userId }, user, (error, result) => {
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
          .deleteOne({ userId: user.userId }, (error, result) => {
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
