/* eslint-disable default-case */

const mysql = require('mysql');
// const { showTables } = require('./ServerModule');
/*
class  DatabaseInterface {
  public  connessione();   //crea la connessione
  public  showTables();   //query per i nomi delle tabelle
  public  getMetaData();  //
  public  getData();
} */

class MysqlDatabase {
  constructor(config) {
    this.config = config;
  }

  connessione() {
    return mysql.createConnection({
      host: this.config.DB_Address,
      user: this.config.DB_Username,
      password: this.config.DB_Password,
      database: this.config.DB_Name,
    });
  }

  getMetaData = (connection, tableName, cb) => {
    connection.query(`SHOW Columns FROM ${tableName}`, (err, columns, fields) => {
      if (err) {
        console.log('error in the query');
        cb(err);
      } else {
        const output = {};
        //console.log(columns);
        for (const column of columns) {
          output[column.Field] = column.Type;
        }
        cb(null, output);
      }
    });
  };

  getData = (connection, tableName, cb) => {
    connection.query(`SELECT * FROM ${tableName}`, (err, rows, fields) => {
      if (err) {
        console.log('error in the query');
        cb(err);
      } else {
        cb(null, rows);
      }
    });
  };

  showTable() {
    return `SELECT table_name FROM information_schema.tables WHERE table_schema ='${config.DB_Name}'`;
  }
}

// module.exports = MysqlDatabase;
module.exports = MysqlDatabase;
