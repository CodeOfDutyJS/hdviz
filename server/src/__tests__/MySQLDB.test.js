const request = require('supertest');
const MySqlDatabase = require('../modules/MySQLDB');

// const database = require('../modules/Database')

describe('Mysql database test', () => {
  const config_test_db = {
    DB_Name: 'iris',
    DB_Address: 'localhost',
    DB_Username: 'root',
    DB_Password: '',
    DB_Type: 'mysql'
  };
  describe('test costruttore', () => {
    it('non lancia errori nel costruttore', () => {
      expect(() => {
        new MySqlDatabase(config_test_db);
      }).not.toThrowError();
    });
  });

  describe('test connectTo', () => {
    it('connette correttamente', () => {
      const testdb = new MySqlDatabase(config_test_db);

      expect(async () => {
        await testdb.connectTo();
      }).not.toThrowError();
    });
  });

  describe('getTable', () => {
    it('ritorna correttamente le tabelle', async () => {
      const db = new MySqlDatabase(config_test_db);
      const conn = await db.connectTo();
      const test = await db.getTables(conn);
      const result = ['tabella2', 'tbl_name'];
      expect(test).toEqual(result);
    });

    it('lancia errore', async () => {
      const db = new MySqlDatabase(config_test_db);
      const error_msg = {
        error: 1,
        msg: 'Error executing the query',
      };
      try {
        await db.getTables();
      } catch (e) {
        expect(e).toEqual(error_msg);
      }
    });
  });

  describe('getData', () => {
    it('ritorna i dati', async() => {
      const db = new MySqlDatabase(config_test_db);
      const conn = await db.connectTo();
      const test1 = await db.getData(conn, "tbl_name");
      const test2 = await db.getData(conn, "tabella2");

      expect(test1).toHaveLength(151);
      expect(test2).toHaveLength(0);
    })

    it('ritorna un errore nel prendere i dati', async() => {
      const db = new MySqlDatabase(config_test_db);
      const error_msg = {
        error: 1,
        msg: 'Error getting the data',
      };
      try{
        await db.getData();
      } catch(e){
        expect(e).toEqual(error_msg);
      }
    })
  })

});
