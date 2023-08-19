const log4js = require('log4js');
const config = require('config');
const mongoDBManagerInstance = require("mongodb").MongoClient;
const DBCollection = config.transactionalDataManagerDB;
const AbstractTransactionalDataStorageClient = require(
    '../abstract-insurance-data-store-client');

const logger = log4js.getLogger('mongodb-manager');
logger.level = config.logLevel;
let mongodb;

class MongoInsuranceDataStoreClient extends AbstractTransactionalDataStorageClient {

  constructor() {
    super();
  }

  async init() {
    logger.info('Inside init mongodb connection');
    const mongoconfig = JSON.parse(process.env.OFF_CHAIN_DB_CONFIG);
    const ca = mongoconfig.connection.mongodb.certificate.certificate_base64;
    const options = {
      ssl: true,
      sslValidate: false,
      sslCA: ca,
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    const connectionString = mongoconfig.connection.mongodb.composed[0];
    const mongoDBClient = await mongoDBManagerInstance.connect(connectionString,
        options);
    mongodb = mongoDBClient.db(mongoconfig.mongodb);
    return this;
  }

  async saveTransactionalData(input) {
    logger.debug('Inside saveTransactionalData');
    return new Promise(function (resolve, reject) {
      try {
        logger.info("Inside mongodb insert ", input._id);
        mongodb.collection(DBCollection).update({_id: input._id}, input,
            {upsert: true}, (error, result) => {
              if (error) {
                logger.error('Error inserting records:' + error);
                reject(error);
              } else {
                logger.debug('Records Inserted Successfully');
                resolve(result);
              }
            });
      } catch (err) {
        logger.error('Error updating record in mongodb', err);
        reject(err);
      }
    });
  }

  async getTransactionalData(id) {
    logger.debug("inside getTransactionalData");
    return new Promise(function (resolve, reject) {
      mongodb.collection(DBCollection)
      .find({_id: id})
      .toArray(function (err, results) {
        if (err) {
          logger.debug('No record found' + err);
          reject('error');
        } else {
          logger.debug(
              "inside getTransactionalData Record exist, upadting in mongo");
          resolve(results[0]);
        }
      });
    });
  }

  async getTransactionalDataByDataCall(prefix) {
    // As mentioned, this is a non-standard use of MongoDB.
    // This method fetches documents with _ids starting with the provided prefix.
    return new Promise((resolve, reject) => {
      mongodb.collection(DBCollection)
      .find({_id: new RegExp(`^${prefix}`)})
      .toArray((err, results) => {
        if (err) {
          logger.debug('Error fetching records' + err);
          reject('error');
        } else {
          resolve(results);
        }
      });
    });
  }

  async uploadStream(id, streamData) {
    const serializedStream = JSON.stringify(streamData);
    return this.saveObject(id, {streamData: serializedStream});
  }

}

module.exports = MongoInsuranceDataStoreClient;
