const log4js = require('log4js');
const { Pool } = require('pg');
const Cursor = require('pg-cursor');

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
      connectionTimeoutMillis: 10000,
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

  /**
   * Executes the given SQL script with cursor.
   * @param {String} sqlScript 
   * @returns Cursor object that can be used to read the result set in chunks.
   */
  async executeSqlWithCursor(sqlScript) {
    const client = await this.pool.connect()
    logger.debug('Execute SQL with cursor: ', sqlScript);

    try {
      const cursor = await client.query(new Cursor(sqlScript));
      client.release();
      return cursor;
    } catch (err) {
      logger.error('ERROR executing query with cursor', err);
      return false;
    }
  }
}
module.exports = PostgresDBManager;
