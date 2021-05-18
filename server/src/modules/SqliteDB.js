const sqlite = require('sqlite3');
const DataBase = require('./Database');

module.exports = class SQLite extends DataBase {
  constructor(config) {
    super(config);
  }

  async connectTo() {
    return new Promise((resolve, reject) => {
      const db = new sqlite.Database(this.config.DB_Adress, (err) => {
        if (err){
           reject('impossibile creare la connessione');
        }
      });
	  resolve(db);
    });
  }

  async getTables(conn) {
    return new Promise( (resolve, reject) => {
      if (conn) {
        const table = 'SELECT name FROM sqlite_master WHERE type=\'table\' AND name NOT LIKE \'sqlite_%\' ORDER BY name';
        conn.each(table, (error, columns) => {
          if (error) {
            reject('Error executing the query');
          } else {
            resolve([columns.name]);
          }
        });
      } else {
        reject('Error executing the query');
      }
    });
  }

  async getData(conn, table) {
    return new Promise((resolve, reject) => {
      if (conn) {
        conn.all(`SELECT * FROM ${table}`, (err, rows) => {
          if (err) {
            reject('Error - unable to get the data');
          } else {
            resolve(rows);
          }
        });
      } else {
        reject('Error - unable to get the data');
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async endConnection(conn) {
    conn.close();
  }
};
