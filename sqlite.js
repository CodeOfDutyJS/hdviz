const mysql = require('sqlite3').verbose();

module.exports = class MySqlDatabase extends Database {
  async connectTo() {
    return new Promise((resolve) => {
      const db = newsqlie3.Database(this.config.DB_Address);
	  return db;
    });
  }

  async getTables(conn) {
    return new Promise((resolve) => {
      const table = `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`;
      conn.each(table, (error, columns) => {
        if (error) {
          reject({
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
          reject({
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