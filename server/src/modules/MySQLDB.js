const mysql = require('mysql');
const Database = require('./Database');

module.exports = class MySqlDatabase extends Database {
  constructor(config) {
    super();
    this.config = config;
  }

  async connectTo() {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.config.DB_Address,
        user: this.config.DB_Username,
        password: this.config.DB_Password,
        database: this.config.DB_Name,
      });

      connection.connect((err) => {
        if (err) {
          reject(new Error('Error connecting to the DB'));
        } else {
          resolve(connection);
        }
      });
    });
  }

  async getTables() {
    const conn = await this.connectTo();
    return new Promise((resolve, reject) => {
      if (conn) {
        const table = `SELECT table_name FROM information_schema.tables WHERE table_schema ='${this.config.DB_Name}'`;
        conn.query(table, (error, columns) => {
          if (error) {
            reject(new Error('executing the query'));
          } else {
            resolve(columns.map((res) => res.table_name));
          }
        });
      } else {
        reject(new Error('executing the query'));
      }
      conn.end();
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
            resolve(rows);
          }
        });
      } else {
        reject(new Error('unable to get the data'));
      }
      conn.end();
    });
  }
};
