/* eslint-disable default-case */
const mysql = require ('mysql');

function connessione (config) {
   switch (config.DB_Type) {
     case 'mysql':
       
      return mysql.createConnection({
        host: config.DB_Address,
        user: config.DB_Username,
        password: config.DB_Password,
        database: config.DB_Name,
      });

      default:
        console.log ("ERROR CONNESSIONE TYPE");
  }
};
    
module.exports.connessione = connessione;