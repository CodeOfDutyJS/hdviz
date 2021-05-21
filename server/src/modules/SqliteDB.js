const sqlite = require('sqlite3');
const DataBase = require('./Database');

module.exports = class SQLite extends DataBase {
  constructor(config) {
    super();
    this.config = config;
  }

  async connectTo() {
    return new Promise((resolve, reject) => {
      const db = new sqlite.Database(this.config.DB_Adress, (err) => {
        if (err) {
          reject(new Error('impossibile creare la connessione'));
        }
      }); resolve(db);
    });
  }

  async getTables() {
    const conn = await this.connectTo();
    return new Promise((resolve, reject) => {
      if (conn) {
        const table = 'SELECT name FROM sqlite_master WHERE type=\'table\' AND name NOT LIKE \'sqlite_%\' ORDER BY name';
        conn.each(table, (error, columns) => {
          if (error) {
            reject(new Error('executing the query'));
          } else {
            resolve([columns.name]);
          }
        });
      } else {
        reject(new Error('executing the query'));
      }
    });
  }

  async getData(table) {
    const conn = await this.connectTo();
    return new Promise((resolve, reject) => {
      if (conn && table) {
        conn.all(`SELECT * FROM ${table}`, (err, rows) => {
          if (err) {
            reject(new Error('unable to get the data'));
          } else {
            resolve(rows);
          }
        });
      } else {
        reject(new Error('unable to get the data'));
      }
      conn.close();
    });
  }
};
