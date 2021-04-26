/* eslint-disable linebreak-style */
// eslint-disable-next-line max-classes-per-file
const { Client } = require('pg')
const format = require('pg-format')

class Database {
  constructor(config) {
    if (this.constructor == Database) {
      throw new Error('Can\'t instatiate abstract class Database');
    }
  }

  async connectTo() {
    throw new Error('Can\'t connect to abstract class Database');
  }

  async showTable(database) {
    throw new Error('Can\'t SHOW to abstract class Database');
  }

  async getMetadata(database){
    throw new Error('Can\'t get datas from an abstract class Database');
  }

  endConnection(conn){
    throw new Error('Can\'t end an abstract class Database');
  }
}

class SqlDatabase {
  constructor(config) {
    this.config = config;
  }

  async connectTo() {
    return new Promise((resolve, reject) => {

      console.log('Connessione in postgres');
      let connstring = 'postgres://'+this.config.DB_Username+':'+this.config.DB_Password+'@'+this.config.DB_Address+':'+this.config.DB_Port+'/'+this.config.DB_Name;
      const conn = new Client({
        connectionString: connstring
      });
      console.log('Sto per avviare la connessione');
      resolve(conn);/*
      connection.connect((err) => {
        if (err) {
          reject('Error - unable to connect to the database');
        } else {
          console.log('ho ritornato la connessione');
          resolve(connection);
        }
      });*/

    });
  }

  async showTable(conn) {
    // let conn = await this.connectTo();
    return new Promise((resolve, reject) => {
      console.log('Sto per eseguire la query');
      const table = `SELECT table_name FROM information_schema.tables WHERE table_schema ='${this.config.DB_Name}'`;
      console.log('Query Eseguita');
      conn.query(table, (error, columns, fields) => {
        if (error) {
          reject('Erorr in the postgresql table query');
        } else {
          console.log('columns');
          resolve(columns);
        }
      });
    });
  }
  rowData(conn, table) {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT * FROM ${table}`, (err, rows, fields) => {
        if (err) {
          reject('Error in the rowData query');
        } else {
          resolve(rows);
        }
      });
    });
  }
  async getMetadata(conn, table){
    return new Promise((resolve, reject) => {
      const promise2 = this.rowData(conn, table).catch((e) => console.log(e));

      Promise.all([promise1, promise2]).then((values) => resolve(values));
    });
  }

  async endConnection(conn){
    conn.end();
  }
}

module.exports = {
  Database,
  SqlDatabase,
};
