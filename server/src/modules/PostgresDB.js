/* eslint-disable linebreak-style */
// eslint-disable-next-line max-classes-per-file
const {Client} = require('pg')
//const format = require('pg-format');


const Database = require('./Database');
//port = 5432

module.exports = class PostgresDB extends Database{
  constructor(config) {
    super(config);
  }

  async connectTo() {
    return new Promise((resolve, reject) => {
      const conn = new Client({
        user: this.config.DB_Username,
        host: this.config.DB_Address,
        database: this.config.DB_Name,
        password: this.config.DB_Password,
        port: this.config.DB_Port,
      });
;
      conn.connect((err) => {
        if (err) {
          reject('Error - unable to connect to the database');
        } else {
          resolve(conn);
        }
      });

    });
  }

  async getTables(conn) {
    // let conn = await this.connectTo();
    return new Promise((resolve, reject) => {
      //const table = `SELECT table_name FROM information_schema.tables WHERE table_schema ='${this.config.DB_Name}' AND table_type='BASE TABLE'`;
      const table =  `SELECT table_schema,table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_schema,table_name`;
      if(conn){
      conn.query(table, (error, columns, fields) => {
        if (error) {
          reject('Error in the postgresql table query');
        } else {
          resolve(columns.rows.map(res => res.table_name));
        }
      });
      } else {
          reject('Error in the postgresql table query')
      }
    });
  }

  async getData(conn, table){
    return new Promise((resolve, reject) => {
        if(conn){
      conn.query(`SELECT * FROM ${table}`, (err, rows, fields) => {
        if (err) {
          reject('Error - unable to get the data');
        } else {
          resolve(rows.rows);
        }
      });
        }else {
            reject('Error - unable to get the data');
        }
    });
  }

  async endConnection(conn){
    conn.end();
  }
}
