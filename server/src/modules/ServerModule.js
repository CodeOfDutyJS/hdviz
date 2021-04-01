/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
// const mysql = require ('mysql');
const MysqlDatabase = require('./ModelloServer');

function connectTo(config) {
  switch (config.DB_Type) {
    case 'mysql':
      const database = new MysqlDatabase(config);
      const connection = database.connessione();
      connection.connect((err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Connected to the DB');
        }
      });
      return connection;

    default:
      console.log('ERROR CONNESSIONE TYPE');
  }
}

function showTables(config) {
  switch (config.DB_Type) {
    case 'mysql':
      return `SELECT table_name FROM information_schema.tables WHERE table_schema ='${config.DB_Name}'`;

    default:
      console.log('ERRORE query shoeTable');
  }
}

module.exports = {
  connectTo, showTables,
};
