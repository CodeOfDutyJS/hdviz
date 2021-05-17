const sqlite = require('sqlite3').verbose();
const Database = require('./Database');

module.exports = class SQLite extends Database {
  async connectTo() {
    return new Promise((resolve, reject) => {
      const db = new sqlite.Database(this.config.DB_Address, (err) => {
        if(err) reject('impossibile creare la connessione');
      });
	  resolve(db);
    });
  }

  async getTables(conn) {
    return new Promise((resolve) => {
      const table = `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`;
      conn.each(table, (error, columns) => {
        if (error) {
          reject({
            error: 1,
            msg: 'Error executing the query',
          });
        } else {
          resolve(columns);
        }
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async getData(conn, table) {
    return new Promise((resolve, reject) => {
      if(conn){
      conn.all(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) {
          reject('Error executing the query');
        } else {
          resolve(rows);
        }
      });
    } else {
      reject('Error executing the query');
    }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async endConnection(conn) {
    conn.close();
  }
};