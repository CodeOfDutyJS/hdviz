const SqliteDB = require('../modules/SqliteDB');

describe('sqlite database test', () => {
  const config_test_db = {
    DB_Name: 'sqlite_test_db',
    DB_Adress: 'C:/Users/Matteo/Desktop/sqlite_db/sqlite_test_db.db',
    DB_Type: 'sqlite',
  };
  const db = new SqliteDB(config_test_db);
describe('SQlite', () => {
  describe('test costruttore', () => {
    it('non lancia errori nel costruttore', () => {
      expect(() => {
        new SqliteDB(config_test_db);
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

  describe('getTables', () => {
    it('ritorna correttamente le tabelle', async () => {
      const conn = await db.connectTo();
      const test = await db.getTables(conn);
      const result = ['iris_sqlite'];
      expect(test).toEqual(result);
    });

  });

  describe('getData', () => {
    it('ritorna i dati', async () => {
      const conn = await db.connectTo();
      const test1 = await db.getData(conn, 'iris_sqlite');

      expect(test1).toHaveLength(150);
    });

    it('ritorna un errore nel prendere i dati', async () => {
      try {
        await db.getData();
      } catch (e) {
        expect(e).toEqual('Error - unable to get the data');
      }
    });
  });
});
})
