const MongoDB = require('../modules/MongoDB');

describe('testing mongo db',() => {
    const config_test_db ={
            "DB_Name": "Mongodb",
            "DB_Address": "mongodb://localhost:27017/",
            "DB_Type": "mongodb"
          }

          describe('test costruttore', () => {
            it('non lancia errori nel costruttore', () => {
              expect(() => {
                new MongoDB(config_test_db);
              }).not.toThrowError();
            });
          });
        
          describe('test connectTo', () => {
            it('connette correttamente', () => {
              const testdb = new MongoDB(config_test_db);
        
              expect(async () => {
                await testdb.connectTo();
              }).not.toThrowError();
            });
          });
        
          describe('getTable', () => {
            it('ritorna correttamente le tabelle', async () => {
              const db = new MongoDB(config_test_db);
              const conn = await db.connectTo();
              const test = await db.getTables(conn);
              const result = ['collezione1'];
              expect(test).toEqual(result);
            });
        
            it('lancia errore', async () => {
              const db = new MongoDB(config_test_db);
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
              const db = new MongoDB(config_test_db);
              const conn = await db.connectTo();
              const test1 = await db.getData(conn, "collezione1");
        
              expect(test1).toHaveLength(150);
            })
        
            it('ritorna un errore nel prendere i dati', async() => {
              const db = new MongoDB(config_test_db);
              const error_msg = {
                error: 1,
                msg: 'Error - unable to get the data',
              };
              try{
                await db.getData();
              } catch(e){
                expect(e).toEqual(error_msg);
              }
            })
          })

} )