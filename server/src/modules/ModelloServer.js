/* eslint-disable default-case */

const mysql = require ('mysql');
//const { showTables } = require('./ServerModule');
/*
class  DatabaseInterface {  
  public  connessione();   //crea la connessione
  public  showTables();   //query per i nomi delle tabelle
  public  getMetaData();  //
  public  getData();
}*/

class MysqlDatabase {

construtor(config) {
  this.config = config;
};

 connessione() {
  return mysql.createConnection({
    host: config.DB_Address,
    user: config.DB_Username,
    password: config.DB_Password,
    database: config.DB_Name,
  });
}

 showTable() {
  return `SELECT table_name FROM information_schema.tables WHERE table_schema ='${config.DB_Name}'`

}

}

//module.exports = MysqlDatabase;
module.exports = MysqlDatabase