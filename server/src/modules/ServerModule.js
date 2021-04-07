/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
const mysql = require('mysql');
//const { resolve } = require('node:path');
const MysqlDatabase = require('./ModelloServer');

function connectTo(config) {
  switch (config.DB_Type) {
    case 'mysql':

      return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
          host: config.DB_Address,
          user: config.DB_Username,
          password: config.DB_Password,
          database: config.DB_Name,
        });

        connection.connect((err) => {
          if (err) {
            reject(err);
          } else {
            resolve(connection);
          }
        });
      });
      break;

    default:
      console.log('ERROR CONNESSIONE TYPE');
  }
}

function showTables(conn, config) {
  switch (config.DB_Type) {
    case 'mysql':
      return new Promise((resolve, reject) => {
        const table = `SELECT table_name FROM information_schema.tables WHERE table_schema ='${config.DB_Name}'`;
        conn.query(table, (error, columns, fields) => {
          if (error) {
            reject('ORRORE in the query');
          } else {
            resolve(columns);
          }
        });
      });
      // break;

    default:
      console.log('ERRORE query showTable');
  }
}



function columnData(conn, table) {
  return new Promise((resolve, reject) => {
    conn.query(`SHOW Columns FROM ${table}`, (err, columns, fields) => {
      if (err) {
        reject(err);
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

function rowData(conn, table) {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM ${table}`, (err, rows, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getMetaData(conn, table, config) {
  switch (config.DB_Type) {
    case 'mysql':
      return new Promise((resolve, reject) => {
        const promise1 = columnData(conn, table);
        const promise2 = rowData(conn, table);

        Promise.all([promise1, promise2]).then(values => resolve(values) );
        });
  }
}


module.exports = {
  connectTo,
  showTables,
  getMetaData,
};
