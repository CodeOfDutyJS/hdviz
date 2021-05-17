
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
  describe('test costruttore', () => {
    it('non lancia errori nel costruttore', () => {
      expect(() => {
        new PostgresDB(config_test_db);
      }).not.toThrowError();
    });
  });

  describe('test connectTo', () => {
    it('connette correttamente', () => {
      const testdb = new PostgresDB(config_test_db);

      expect(async () => {
        await testdb.connectTo();
      }).not.toThrowError();
    });
  });

  describe('getTable', () => {
    it('ritorna correttamente le tabelle', async () => {
      const db = new PostgresDB(config_test_db);
      const conn = await db.connectTo();
      const test = await db.getTables(conn);
      const result = ['tabella2', 'tbl_name'];
      expect(test).toEqual(result);
    });

    it('lancia errore', async () => {
      const db = new PostgresDB(config_test_db);
      try {
        await db.getTables();
      } catch (e) {
        expect(e).toEqual('Error in the postgresql table query');
      }
    });
  });

  describe('getData', () => {
    it('ritorna i dati', async() => {
      const db = new PostgresDB(config_test_db);
      const conn = await db.connectTo();
      const test1 = await db.getData(conn, "iris_postgres_2");

      expect(test1).toHaveLength(151);
    })

    it('ritorna un errore nel prendere i dati', async() => {
      const db = new PostgresDB(config_test_db);
      try{
        await db.getData();
      } catch(e){
        expect(e).toEqual('Error - unable to get the data');
      }
    })
  })

});
