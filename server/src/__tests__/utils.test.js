const MysqlDatabase = require('../modules/MySQLDB');
const MongoDB = require('../modules/MongoDB');
const PostgreDB = require('../modules/PostgresDB');

const { selectConfig, findDB } = require('../utils');

jest.mock('../utils');

describe('findDB testing', () => {
  test('trovato db mysql', () => {
    const configTest = {
      DB_Name: 'iris_mysql',
      DB_Address: 'localhost',
      DB_Username: 'root',
      DB_Password: '',
      DB_Type: 'mysql',
    };

    const mysqlTest = new MysqlDatabase(configTest);

    expect(findDB(configTest)).toEqual(mysqlTest);
  });

  test('trovato db mongo', () => {
    const data = {
      DB_Name: 'mongodb_test_db',
      DB_Address: 'mongodb://localhost:27017/',
      DB_Type: 'mongodb',
    };

    const mongoTest = new MongoDB(data);

    expect(findDB(data)).toEqual(mongoTest);
  });

  test('trovato db postgresql', () => {
    const data = {
      DB_Name: 'postgres_test_db',
      DB_Address: 'localhost',
      DB_PORT: 5432,
      DB_Username: 'postgres',
      DB_Password: 'password',
      DB_Type: 'postgres',
    };

    const postgreTest = new PostgreDB(data);
    expect(findDB(data)).toEqual(postgreTest);
  });

  test('errore - tipo database non implementato', () => {
    expect(() => { findDB('dataError'); }).toThrowError('Tipo di database non implementato');
  });
});

describe('selectConfig', () => {
  test('should return the db', async () => {
    const sqliteTest = {
      DB_Name: 'sqlite_test_db',
      DB_Address: 'C:/Users/Matteo/Desktop/sqlite_db/sqlite_test_db.db',
      DB_Type: 'sqlite',
    };
    expect(selectConfig('sqlite_test_db')).toEqual(sqliteTest);
  });

  test('should return zero', () => {
    expect(selectConfig('dbNonPresente')).toBe(0);
  });
});
