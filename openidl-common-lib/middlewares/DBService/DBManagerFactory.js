const log4js = require('log4js');
const config = require('config');
const lodash = require('lodash');
const CloudantDBManager = require('./cloudantDBManager');
const MongoDBManager = require('./mongoDBManager');
const logger = log4js.getLogger('DBManagerFactory');
logger.level = config.logLevel;

class DBManagerFactory {
    constructor() {
        this.option = null;
        this.instance = null;
    }
    async getInstance(config) {
        if (!config || !config.databaseService) {
            logger.info('DBConfig not found!!');
        }
        logger.info('Inside DBManagerFactory getInstance');
        logger.info('Persistent store selected', config.persistentStore);
        try {
            this.option = config.persistentStore;
            let dbservice = lodash.filter(config.databaseService, { 'name': this.option });
            let mongoDBInstance = new MongoDBManager(dbservice);
            switch (this.option) {
                case "mongo":
                    let mongoDBName = config.databaseService[0].mongodb;
                    let simpleURI = config.databaseService[0].simpleURI
                    if (simpleURI) {  // use the simple db connection
                        mongoDBInstance.initSimpleMongoDBConnection(mongoDBName, simpleURI)
                    } else {  // use the cloud db connection
                        await mongoDBInstance.initMongoDBConnection(mongoDBName);
                    }
                    return mongoDBInstance;
                case "cloudant":
                    return new CloudantDBManager(dbservice)
            }
        } catch (error) {
            throw error;
        }

    }


}
module.exports = DBManagerFactory;
