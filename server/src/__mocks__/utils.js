
const MysqlDatabase = require('../modules/MySQLDB');
const MongoDB = require('../modules/MongoDB');
const PostgresDB = require('../modules/PostgresDB');
const Sqlite = require('../modules/SqliteDB');
const fs = require('fs');
;


const findDB = function (config) {
  const dbType = {
    'mysql': () => { return new MysqlDatabase(config)},
    'mongodb': () => { return new MongoDB(config)},
    'postgres': () => { return new PostgresDB(config)},
    'sqlite': () => { return new Sqlite(config)},
    'default': () => {throw ('Tipo di database non implementato')}
  };
    return (dbType[config.DB_Type] || dbType['default'])();
};

const getFiles = jest.fn().mockImplementation((dir, files_)=> {

  return [
    {
      DB_Name: 'Mongodb',
      DB_Address: 'mongodb://localhost:27017/',
      DB_Type: 'mongodb'
    },
    {
      DB_Name: 'iris',
      DB_Address: 'localhost',
      DB_Username: 'root',
      DB_Password: '',
      DB_Type: 'mysql'
    },
    {
      DB_Name: 'postgres_test_db',
      DB_Address: 'localhost',
      DB_PORT: '5432',
      DB_Username: 'postgres',
      DB_Password: 'password',
      DB_Type: 'postgres'
    },
    {
      DB_Name: 'sqlite_test_db',
      DB_Address: 'C:/Users/Matteo/Desktop/sqlite_db/sqlite_test_db.db',
      DB_Type: 'sqlite'
    }
  ]
  
});


const selectConfig = function(dbname,confg_f) {

  for ( i in confg_f) {
    if (dbname == confg_f[i].DB_Name) {
      return confg_f[i];
    }
  }
  return 0;
}
 module.exports = {selectConfig, getFiles, findDB}