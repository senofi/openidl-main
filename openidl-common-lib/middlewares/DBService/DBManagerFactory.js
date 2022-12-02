const log4js = require('log4js');
const CloudantDBManager = require('./cloudantDBManager');
const MongoDBManager = require('./mongoDBManager');
const PostgresDBManager = require('./postgresDBManager');

const logger = log4js.getLogger('DBManagerFactory');
logger.level = process.env.LOG_LEVEL || 'debug';

class DBManagerFactory {
  async getInstance(options) {
    if (!options || !options.persistentStore) {
      logger.error('Database config not found!!');
    }
    logger.info('Inside DBManagerFactory getInstance');
    logger.info('Persistent store selected', options.persistentStore);
    try {
      switch (options.persistentStore) {
        case 'mongo':
          const mongoDBInstance = new MongoDBManager(options);
          return mongoDBInstance;
        case 'cloudant':
          return new CloudantDBManager(options);
        case 'postgres':
          return new PostgresDBManager(options);
        default:
          logger.error('Incorrect Usage of database type. Refer README for more details');
          break;
      }
    } catch (error) {
      throw error;
    }
  }
}
module.exports = DBManagerFactory;
