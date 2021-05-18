
const PostgresDB = require('../modules/PostgresDB');

// const database = require('../modules/Database')

describe('Postgres database test', () => {
  const config_test_db = {
    "DB_Name": "postgres_test_db",
    "DB_Address": "localhost",
    "DB_PORT": 5432,
    "DB_Username": "postgres",
    "DB_Password": "password",
    "DB_Type": "postgres"
  };
  const db = new PostgresDB(config_test_db);

  describe('test costruttore', () => {
    it('non lancia errori nel costruttore', () => {
      expect(() => {
        new PostgresDB(config_test_db);
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
      const result = ['iris_postgres'];
      expect(test).toEqual(result);
    });

    it('lancia errore', async () => {
      try {
        await db.getTables();
      } catch (e) {
        expect(e).toEqual('Error in the postgresql table query');
      }
    });
  });

  describe('getData', () => {
    it('ritorna i dati', async() => {
      const conn = await db.connectTo();
      const test1 = await db.getData(conn, "iris_postgres");

      expect(test1).toHaveLength(150);
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
