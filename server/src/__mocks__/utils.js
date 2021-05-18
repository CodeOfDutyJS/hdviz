const MysqlDatabase = require('../modules/MySQLDB');
const MongoDB = require('../modules/MongoDB');
const PostgresDB = require('../modules/PostgresDB');
const SqliteDB = require('../modules/SqliteDB');

const findDB = function (config) {
  const dbType = {
    'mysql': () => { return new MysqlDatabase(config)},
    'mongodb': () => { return new MongoDB(config)},
    'postgres': () => {return new PostgresDB(config)},
    'sqlite': () => {return new SqliteDB(config)},
    'default': () => {throw ('Tipo di database non implementato')}
  };
  return (dbType[config.DB_Type] || dbType['default'])();
};

const getFiles = jest.fn().mockImplementation((dir, files_) => [
  {
    DB_Name: 'mongodb_test_db',
    DB_Address: 'mongodb://localhost:27017/',
    DB_Type: 'mongodb',
  },
  {
    DB_Name: 'mysql_test_db',
    DB_Address: 'localhost',
    DB_Username: 'root',
    DB_Password: '',
    DB_Type: 'mysql',
  },
  {
    DB_Name: 'postgres_test_db',
    DB_Address: 'localhost',
    DB_PORT: '5432',
    DB_Username: 'postgres',
    DB_Password: 'password',
    DB_Type: 'postgres',
  },
  {
    DB_Name: 'sqlite_test_db',
    DB_Address: "C:/Users/Matteo/Desktop/sqlite_db/sqlite_test_db.db",
    DB_Type: 'sqlite',
  }
]);

const selectConfig = function (dbname) {
  const config = getFiles();
  for (i in config) {
    if (dbname == config[i].DB_Name) {
      return config[i];
    }
  }
  return 0;
};
module.exports = { selectConfig, getFiles, findDB };
