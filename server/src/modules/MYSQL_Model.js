/* eslint-disable linebreak-style */
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

const connect = (config) => new Promise((resolve, reject) => {
  const connection = mysql.createConnection({
    host: config.DB_Address,
    user: config.DB_Username,
    password: config.DB_Password,
    database: config.DB_Name,
  });

  connection.connect((err) => {
    if (err) {
      reject('Error - unable to connect to the database');
    } else {
      resolve(connection);
    }
  });
});
/*
function connect(config) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: config.DB_Address,
      user: config.DB_Username,
      password: config.DB_Password,
      database: config.DB_Name,
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
*/
function showTable(conn, config) {
  return new Promise((resolve, reject) => {
    const table = `SELECT table_name FROM information_schema.tables WHERE table_schema ='${config.DB_Name}'`;
    conn.query(table, (error, columns, fields) => {
      if (error) {
        reject('Erorr in the mysql table query');
      } else {
        resolve(columns);
      }
    });
  });
}

function columnData(conn, table) {
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

function rowData(conn, table) {
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

function getMetaData(conn, table) {
  return new Promise((resolve, reject) => {
    const promise1 = columnData(conn, table).catch((e) => console.log(e)); // non serve await perché fa tutto Promise.all
    const promise2 = rowData(conn, table).catch((e) => console.log(e));

    if (!promise1 || !promise2)reject('Error in column or roe data');
    Promise.all([promise1, promise2]).then((values) => resolve(values));
  });
}

module.exports = {
  connect,
  showTable,
  getMetaData,
};
