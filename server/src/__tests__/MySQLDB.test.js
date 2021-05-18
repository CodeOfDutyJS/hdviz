const MySqlDatabase = require('../modules/MySQLDB');

// const database = require('../modules/Database')

describe('Mysql database test', () => {
  const configTestDB = {
    DB_Name: 'mysql_test_db',
    DB_Address: 'localhost',
    DB_Username: 'root',
    DB_Password: '',
    DB_Type: 'mysql',
  };
  const db = new MySqlDatabase(configTestDB);

  describe('test costruttore', () => {
    it('non lancia errori nel costruttore', () => {
      expect(async () => {
        await new MySqlDatabase(configTestDB);
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
      const test = await db.getTables();
      const result = ['iris_mysql'];
      expect(test).toEqual(result);
    });
  });

  describe('getData', () => {
    it('ritorna i dati', async () => {
      const test1 = await db.getData('iris_mysql');

      expect(test1).toHaveLength(151);
    });
  });
});
