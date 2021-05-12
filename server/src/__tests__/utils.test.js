const MysqlDatabase = require('../modules/MySQLDB');
const MongoDB = require('../modules/MongoDB');

const { findDB, getFiles, selectConfig } = require('../utils');

describe('findDB testing', () => {
  test('trovato db mysql', () => {
    const data = {
      "DB_Name": "iris",
      "DB_Address": "localhost",
      "DB_Username": "root",
      "DB_Password": "",
      "DB_Type": "mysql"
    };    

    const mysqlTest = new MysqlDatabase(data);

    expect(findDB(data)).toEqual(mysqlTest);
  });

  test('trovato db mongo', () => {
    let mockData = {
      "DB_Name": 'Mongodb',
      "DB_Address": 'mongodb://localhost:27017/',
      "DB_Type": 'mongodb'
    };

    let mongoTest = new MongoDB(mockData);

    expect(findDB(mockData)).toEqual(mongoTest);
  });

  test('tipo database non implementato', () => {
    let dataError = {
      "DB_Name": 'iris',
      "DB_Address": 'localhost',
      "DB_Username": 'root',
      "DB_Password": '',
      "DB_Type": 'error'
    };
    expect(() => {findDB(dataError)}).toThrowError('Tipo di database non implementato');
  });

});

