/* eslint-disable linebreak-style */
// eslint-disable-next-line max-classes-per-file
const mysql = require('mysql');

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

class MySqlDatabase {
  constructor(config) {
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
          reject('Error - unable to connect to the database');
        } else {
          resolve(connection);
        }
      });
    });
  }

  async showTable(conn) {
    // let conn = await this.connectTo();
    return new Promise((resolve, reject) => {
      const table = `SELECT table_name FROM information_schema.tables WHERE table_schema ='${this.config.DB_Name}'`;
      conn.query(table, (error, columns, fields) => {
        if (error) {
          reject('Erorr in the mysql table query');
        } else {
          resolve(columns);
        }
      });
    });
  }
  columnData(conn, table) {
    return new Promise((resolve, reject) => {
      conn.query(`SHOW Columns FROM ${table}`, (err, columns, fields) => {
        if (err) {
          reject('error in the columnData query');
        } else {
          const output = {};
          // console.log(columns);
          for (const column of columns) {
            output[column.Field] = column.Type;
          }
          resolve(output);
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
      const promise1 = this.columnData(conn, table).catch((e) => console.log(e)); // non serve await perché fa tutto Promise.all
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
  MySqlDatabase,
};
