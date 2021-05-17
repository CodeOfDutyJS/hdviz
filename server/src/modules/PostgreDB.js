const { Client } = require('pg');

module.exports = class PostgreDB {
  constructor(config) {
    this.config = config;
  }

  async connectTo() {
    return new Promise((resolve, reject) => {
      console.log('Connessione in postgres');
      const connstring = `postgres://${this.config.DB_Username}:${this.config.DB_Password}@${this.config.DB_Address}:${this.config.DB_Port}/${this.config.DB_Name}`;
      const conn = new Client({
        connectionString: connstring,
      });
      console.log('Sto per avviare la connessione');
      conn.connect((err) => {
        if (err) {
          reject(new Error('Error - unable to connect to the database'));
        } else {
          console.log('ho ritornato la connessione');
          resolve(conn);
        }
      });
    });
  }

  async showTable(conn) {
    // let conn = await this.connectTo();
    return new Promise((resolve, reject) => {
      console.log('Sto per eseguire la query');
      const table = `SELECT table_name FROM information_schema.tables WHERE table_schema ='${this.config.DB_Name}'`;
      console.log('Query Eseguita');
      conn.query(table, (error, columns) => {
        if (error) {
          reject(new Error('Erorr in the postgresql table query'));
        } else {
          console.log('columns');
          resolve(columns);
        }
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  rowData(conn, table) {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) {
          reject(new Error('Error in the rowData query'));
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getMetadata(conn, table) {
    return new Promise((resolve) => {
      const promise = this.rowData(conn, table).catch((e) => console.log(e));
      Promise.all([promise]).then((values) => resolve(values));
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async endConnection(conn) {
    conn.end();
  }
};
