const mysql = require('mysql');
const Database = require('./Database');

module.exports = class MySqlDatabase extends Database {
  async connectTo() {
    return new Promise((resolve) => {
      const connection = mysql.createConnection({
        host: this.config.DB_Address,
        user: this.config.DB_Username,
        password: this.config.DB_Password,
        database: this.config.DB_Name,
      });

      connection.connect((err) => {
        if (err) {
          resolve({
            error: 1,
            msg: 'Error connecting to the DB',
          });
        } else {
          resolve(connection);
        }
      });
    });
  }

  async getTables(conn) {
    return new Promise((resolve) => {
      const table = `SELECT table_name FROM information_schema.tables WHERE table_schema ='${this.config.DB_Name}'`;
      conn.query(table, (error, columns) => {
        if (error) {
          resolve({
            error: 1,
            msg: 'Error executing the query',
          });
        } else {
          resolve(columns.map((res) => res.table_name));
        }
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async getData(conn, table) {
    return new Promise((resolve) => {
      conn.query(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) {
          resolve({
            error: 1,
            msg: 'Error executing the query',
          });
        } else {
          resolve(rows);
        }
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async endConnection(conn) {
    conn.end();
  }
};
