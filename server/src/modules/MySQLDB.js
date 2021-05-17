/* eslint-disable linebreak-style */
// eslint-disable-next-line max-classes-per-file
const mysql = require('mysql');
const Database = require('./Database');

module.exports = class MySqlDatabase extends Database {
  constructor(config) {
    super(config);
  }

  async connectTo() {
    return new Promise( (resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.config.DB_Address,
        user: this.config.DB_Username,
        password: this.config.DB_Password,
        database: this.config.DB_Name,
      });

      connection.connect((err) => {
        if (err) {
          reject("Error connecting to the DB");
        } else {
          resolve(connection);
        }
      });
    });
  }

  async getTables(conn) {
    return new Promise((resolve, reject) => {
        if(conn){
          const table = `SELECT table_name FROM information_schema.tables WHERE table_schema ='${this.config.DB_Name}'`;
            conn.query(table, (error, columns, fields) => {
                if (error) {
                  reject("Error executing the query");
                } else {
                  resolve(columns.map(res => res.table_name));
                }
              });
        }else {
          reject("Error executing the query");
        }
      });
    }

  async getData(conn, table) {
    return new Promise((resolve, reject) => {
      if(conn){
      conn.query(`SELECT * FROM ${table}`, (err, rows, fields) => {
        if (err) {
          reject("Error - unable to get the data");
        } else {
          resolve(rows);
        }
      });
    } else{
      reject("Error - unable to get the data");
    }
    });
  }

  async endConnection(conn) {
    conn.end();
  }
};
