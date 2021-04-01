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
    console.log(this.config);
    return mysql.createConnection({
      host: this.config.DB_Address,
      user: this.config.DB_Username,
      password: this.config.DB_Password,
      database: this.config.DB_Name,
    });
  }

  showTable() {
    return `SELECT table_name FROM information_schema.tables WHERE table_schema ='${config.DB_Name}'`;
  }
}

// module.exports = MysqlDatabase;
module.exports = MysqlDatabase;
