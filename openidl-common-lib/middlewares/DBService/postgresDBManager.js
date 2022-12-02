const log4js = require('log4js');
const { Pool } = require('pg');
// const Cursor = require('pg-cursor');

const logger = log4js.getLogger('postgres-db-manager');

logger.level = process.env.LOG_LEVEL || 'debug';

let postgres;
class PostgresDBManager {
  constructor(dbService) {
    this.DBService = dbService;
    this.createView = false;
    this.name = 'postgres';

    postgres = new Pool({
      host: dbService.connection.postgres.host,
      user: dbService.user,
      port: dbService.port,
      password: dbService.password,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async executeExtractionPattern(extractionPattern) {
    const result = await postgres.query(extractionPattern)
      .catch(err => console.error('Error executing query', err.stack));
    return result;
  }
}
module.exports = PostgresDBManager;
