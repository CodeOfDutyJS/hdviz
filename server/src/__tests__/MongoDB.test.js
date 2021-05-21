const MongoDB = require('../modules/MongoDB');

describe('testing mongo db', () => {
  const configTestDB = {
    DB_Name: 'mongodb_test_db',
    DB_Address: 'mongodb://localhost:27017/',
    DB_Type: 'mongodb',
  };
  const db = new MongoDB(configTestDB);

  describe('test costruttore', () => {
    it('non lancia errori nel costruttore', () => {
      expect(async () => {
        await new MongoDB(configTestDB);
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
      const result = ['iris_mongodb'];
      expect(test).toEqual(result);
    });
  });

  describe('getData', () => {
    it('ritorna i dati', async () => {
      const test1 = await db.getData('iris_mongodb');

      expect(test1).toHaveLength(150);
    });
  });
});
