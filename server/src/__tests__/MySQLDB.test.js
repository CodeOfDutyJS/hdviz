
const MySqlDatabase = require('../modules/MySQLDB');

// const database = require('../modules/Database')

describe('Mysql database test', () => {
  const config_test_db = {
    DB_Name: 'mysql_test_db',
    DB_Address: 'localhost',
    DB_Username: 'root',
    DB_Password: '',
    DB_Type: 'mysql'
  };
  const db = new MySqlDatabase(config_test_db);

  describe('test costruttore', () => {
    it('non lancia errori nel costruttore', () => {
      expect(() => {
        new MySqlDatabase(config_test_db);
      }).not.toThrowError();
    });
  });

  describe('test connectTo', () => {
    it('connette correttamente', () => {
      expect(async () => {
        await db.connectTo();
      }).not.toThrowError();
    });
  });

  describe('getTable', () => {
    it('ritorna correttamente le tabelle', async () => {
      const conn = await db.connectTo();
      const test = await db.getTables(conn);
      const result = ['iris_mysql'];
      expect(test).toEqual(result);
    });

    it('lancia errore', async () => {
      try {
        await db.getTables();
      } catch (e) {
        expect(e).toEqual('Error executing the query');
      }
    });
  });

  describe('getData', () => {
    it('ritorna i dati', async() => {
      const conn = await db.connectTo();
      const test1 = await db.getData(conn, "iris_mysql");

      expect(test1).toHaveLength(151);
    })

    it('ritorna un errore nel prendere i dati', async() => {
      try{
        await db.getData();
      } catch(e){
        expect(e).toEqual('Error - unable to get the data');
      }
    })
  })

});
