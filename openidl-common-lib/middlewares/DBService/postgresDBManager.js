const log4js = require('log4js');
const { Pool } = require('pg');
// const Cursor = require('pg-cursor');

const logger = log4js.getLogger('postgres-db-manager');

logger.level = process.env.LOG_LEVEL || 'debug';

class PostgresDBManager {
  constructor(dbService) {
    this.dbService = dbService;
    this.createView = false;
    this.name = 'postgres';

    this.pool = new Pool({
      host: this.dbService.host,
      port: this.dbService.port,
      // database: this.dbService.database,
      user: this.dbService.username,
      password: this.dbService.password,
      max: 1,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }


  async executeSql(sqlScript) {
    logger.debug('Execute SQL: ', sqlScript);

    try {
      const result = await this.pool.query(sqlScript);
      logger.trace('Result: ', result);
      return result;
    } catch (err) {
      logger.error('ERROR executing query', err);
      return false;
    }
  }
}
module.exports = PostgresDBManager;
