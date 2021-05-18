const MongoDB = require('../modules/MongoDB');

describe('testing mongo db', () => {
  const config_test_db = {
    DB_Name: 'Mongodb',
    DB_Address: 'mongodb://localhost:27017/',
    DB_Type: 'mongodb',
  };
  const db = new MongoDB(config_test_db);

  describe('test costruttore', () => {
    it('non lancia errori nel costruttore', () => {
      expect(() => {
        new MongoDB(config_test_db);
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
      const result = ['iris_mongodb'];
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
    it('ritorna i dati', async () => {
      const conn = await db.connectTo();
      const test1 = await db.getData(conn, 'iris_mongodb');

      expect(test1).toHaveLength(150);
    });
    // scrivere test per collezione vuota -> da errore

    it('ritorna un errore nel prendere i dati', async () => {
      try {
        await db.getData();
      } catch (e) {
        expect(e).toEqual('Error - unable to get the data');
      }
    });
  });
});
