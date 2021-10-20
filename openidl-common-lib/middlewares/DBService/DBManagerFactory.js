const log4js = require('log4js');
const CloudantDBManager = require('./cloudantDBManager');
const MongoDBManager = require('./mongoDBManager');
const logger = log4js.getLogger('DBManagerFactory');
logger.level = process.env.LOG_LEVEL || 'debug';

class DBManagerFactory {
    constructor() {
    }
    async getInstance(options) {
        if (!options || !options.persistentStore) {
            logger.error('Database config not found!!');
        }
        logger.info('Inside DBManagerFactory getInstance');
        logger.info('Persistent store selected', options.persistentStore);
        try {
            switch (options.persistentStore) {
                case "mongo":
                    let mongoDBInstance = new MongoDBManager(options);
                    let mongoDBName = options.mongodb;
                    let simpleURI = options.simpleURI
                    if (simpleURI) {  // use the simple db connection
                        mongoDBInstance.initSimpleMongoDBConnection(mongoDBName, simpleURI)
                    } else {  // use the cloud db connection
                        await mongoDBInstance.initMongoDBConnection(mongoDBName);
                    }
                    return mongoDBInstance;
                case "cloudant":
                    return new CloudantDBManager(options)
                default:
                    logger.error("Incorrect Usage of database type. Refer README for more details");
                    break;
            }
        } catch (error) {
            throw error;
        }
    }
}
module.exports = DBManagerFactory;
