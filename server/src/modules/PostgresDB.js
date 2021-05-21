const { Client } = require('pg');
const Database = require('./Database');

module.exports = class PostgresDB extends Database {
  constructor(config) {
    super();
    this.config = config;
  }

  async connectTo() {
    return new Promise((resolve, reject) => {
      const conn = new Client({
        user: this.config.DB_Username,
        host: this.config.DB_Address,
        database: this.config.DB_Name,
        password: this.config.DB_Password,
        port: this.config.DB_Port,
      });

      conn.connect((err) => {
        if (err) {
          reject(new Error('unable to connect to the database'));
        } else {
          resolve(conn);
        }
      });
    });
  }

  async getTables() {
    const conn = await this.connectTo();
    return new Promise((resolve, reject) => {
      const table = 'SELECT table_schema,table_name FROM information_schema.tables WHERE table_schema=\'public\' ORDER BY table_schema,table_name';
      if (conn) {
        conn.query(table, (error, columns) => {
          if (error) {
            reject(new Error('in the postgresql table query'));
          } else {
            resolve(columns.rows.map((res) => res.table_name));
          }
        });
      } else {
        reject(new Error('in the postgresql table query'));
      }
    });
  }

  async getData(table) {
    const conn = await this.connectTo();
    return new Promise((resolve, reject) => {
      if (conn && table) {
        conn.query(`SELECT * FROM ${table}`, (err, rows) => {
          if (err) {
            reject(new Error('unable to get the data'));
          } else {
            resolve(rows.rows);
          }
        });
      } else {
        reject(new Error('unable to get the data'));
      }
    });
  }
};
