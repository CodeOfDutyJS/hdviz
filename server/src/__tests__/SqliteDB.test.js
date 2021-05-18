const SqliteDB = require('../modules/SqliteDB');

describe('sqlite database test', () => {
  const configTestDB = {
    DB_Name: 'sqlite_test_db',
    DB_Adress: 'C:/Users/Matteo/Desktop/sqlite_db/sqlite_test_db.db',
    DB_Type: 'sqlite',
  };
  const db = new SqliteDB(configTestDB);
  describe('SQlite', () => {
    describe('test costruttore', () => {
      it('non lancia errori nel costruttore', () => {
        expect(async () => {
          await new SqliteDB(configTestDB);
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
        const test = await db.getTables();
        const result = ['iris_sqlite'];
        expect(test).toEqual(result);
      });
    });

    describe('getData', () => {
      it('ritorna i dati', async () => {
        const test1 = await db.getData('iris_sqlite');

        expect(test1).toHaveLength(150);
      });
    });
  });
});
