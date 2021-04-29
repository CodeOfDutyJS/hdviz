/* eslint-disable linebreak-style */
// eslint-disable-next-line max-classes-per-file
const mysql = require('mysql');
const Database = require('./Database');

module.exports = class MySqlDatabase extends Database {
  constructor(config) {
    super(config);
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
          reject({
            error: 1,
            msg:"Error connecting to the DB"
          });
        } else {
          resolve(connection);
        }
      });
    });
  }

  async getTables(conn) {
    return new Promise((resolve/*, reject*/) => {
      const table = `SELECT table_name FROM information_schema.tables WHERE table_schema ='${this.config.DB_Name}'`;
      conn.query(table, (error, columns, fields) => {
        if (error) {
          reject({
            error: 1,
            msg:"Error executing the query"
          });
        } else {
          resolve(columns.map(res => res.table_name));
        }
      });
    });
  }

  async getData(conn, table) {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT * FROM ${table}`, (err, rows, fields) => {
        if (err) {
          reject({
            error: 1,
            msg:"Error executing the query"
          });
        } else {
          resolve(rows);
        }
      });
    });
  }

  async endConnection(conn) {
    conn.end();
  }
};
