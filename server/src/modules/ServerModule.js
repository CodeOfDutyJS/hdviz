/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
const mysql = require('mysql');
const MysqlDB = require('./MYSQL_Model');


function connectTo(config) {
  return new Promise((resolve, reject) => {
    switch (config.DB_Type) {
      case 'mysql': resolve(MysqlDB.connect(config)); // .cath( throw error)
      break;

      case 'PostgreSQL':break;

      case 'MongoDB': break;

      case: 'SQLite': break;

      default:
        reject('database type not implemented');
    }
  });
}

function showTables(conn, config) {
  return new Promise((resolve, reject) => {
    switch (config.DB_Type) {
      case 'mysql': resolve(MysqlDB.showTable(conn, config));

      default:
        reject('database type not implemented');
    }
  });
}

// l'if della funzione non ha senso perché l'errore deve essere meneggiato nella cath delle 2 promesse
async function getMetaData(conn, table, config) {
  return new Promise((resolve, reject) => {
    switch (config.DB_Type) {
      case 'mysql': resolve(MysqlDB.getMetaData(conn, table));
      default:
        reject('database type not implemented');
    }
  });
}

module.exports = {
  connectTo,
  showTables,
  getMetaData,
};
