const PostgresDB = require('../modules/PostgresDB');

// const database = require('../modules/Database')

describe('Postgres database test', () => {
  const configTestDB = {
    DB_Name: 'postgres_test_db',
    DB_Address: 'localhost',
    DB_PORT: 5432,
    DB_Username: 'postgres',
    DB_Password: 'password',
    DB_Type: 'postgres',
  };
  const db = new PostgresDB(configTestDB);

  describe('test costruttore', () => {
    it('non lancia errori nel costruttore', () => {
      expect(async () => {
        await new PostgresDB(configTestDB);
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
      const result = ['iris_postgres'];
      expect(test).toEqual(result);
    });
  });

  describe('getData', () => {
    it('ritorna i dati', async () => {
      const test1 = await db.getData('iris_postgres');

      expect(test1).toHaveLength(150);
    });
  });
});
