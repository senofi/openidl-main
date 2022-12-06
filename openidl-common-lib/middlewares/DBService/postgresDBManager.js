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
      user: this.dbService.username,
      port: this.dbService.port,
      database: this.dbService.database,
      password: this.dbService.password,
      max: 1,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async executeExtractionPattern(extractionPattern) {
    const extractionPatternSql = extractionPattern.viewDefinition.map;
    logger.debug('Execute extraction pattern: ', extractionPatternSql);
    logger.debug(`Initialize postgres: ${JSON.stringify(this.dbService)} - ${JSON.stringify(this.pool)}`);

    try {
      const result = await this.pool.query(extractionPatternSql);
      logger.debug('Result: ', result);
      return result;
    } catch (err) {
      logger.error('ERROR executing query', err);
      throw err;
    }
  }
}
module.exports = PostgresDBManager;
