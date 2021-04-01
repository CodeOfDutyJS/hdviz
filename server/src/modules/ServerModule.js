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

function showTables(conn, config) {

  switch (config.DB_Type) {
    case 'mysql':

      const table = `SELECT table_name FROM information_schema.tables WHERE table_schema ='${config.DB_Name}'`;
      conn.query(table, (error, columns, fields) => {
        if (error){
          console.log('error in the query');
        } else{
          return columns;
        }
      });
      break;
      
      

    default:
      console.log('ERRORE query showTable');
  }
}

module.exports = {
  connectTo, showTables,
};
