const MysqlDatabase = require('../modules/MySQLDB');
const MongoDB = require('../modules/MongoDB');
const PostgreDB = require('../modules/PostgreSDB');

//const mymock = require('../__mocks__/MyMocks');
const {selectConfig, getFiles, findDB} = require('../utils');
jest.mock('../utils');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('findDB testing', () => {

  test('trovato db mysql', () => {
    const config_test = {
      "DB_Name": "iris_mysql",
      "DB_Address": "localhost",
      "DB_Username": "root",
      "DB_Password": "",
      "DB_Type": "mysql"
    }

    const mysqlTest = new MysqlDatabase(config_test);

    expect(findDB(config_test)).toEqual(mysqlTest);
  });

  test('trovato db mongo', () => {
    const data =  {
      "DB_Name": "mongodb_test_db",
      "DB_Address": "mongodb://localhost:27017/",
      "DB_Type": "mongodb"
    };

    const mongoTest = new MongoDB(data);

    expect(findDB(data)).toEqual(mongoTest);
  });

  test('trovato db postgresql', () => {
    const data =    {
      "DB_Name": "postgres_test_db",
      "DB_Address": "localhost",
      "DB_PORT": 5432,
      "DB_Username": "postgres",
      "DB_Password": "password",
      "DB_Type": "postgres"
    }
    
    const postgre_test = new PostgreDB(data);
    expect(findDB(data)).toEqual(postgre_test);
  })

  test('errore - tipo database non implementato', () => {
    const dataError = {
      "DB_Name": 'iris_mysql',
      "DB_Address": 'localhost',
      "DB_Username": 'root',
      "DB_Password": '',
      "DB_Type": 'error'
    };
    expect(() => {findDB(dataError)}).toThrowError('Tipo di database non implementato');
  });
/*
  describe('getFiles', () => {
    it('should return the files', () => {
      const res = [{ 
      "DB_Name": 'iris',
      "DB_Address": 'localhost',
      "DB_Username": 'root',
      "DB_Password": '',
      "DB_Type": 'mysql'
    },  
    {
      "DB_Name": "Mongodb",
      "DB_Address": "mongodb://localhost:27017/",
      "DB_Type": "mongodb"
    }];
      expect( getFiles() ).toEqual(res);
    })
  })*/

});

