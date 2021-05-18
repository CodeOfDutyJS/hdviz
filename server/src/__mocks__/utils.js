const MysqlDatabase = require('../modules/MySQLDB');
const MongoDB = require('../modules/MongoDB');
const PostgresDB = require('../modules/PostgresDB');
const SqliteDB = require('../modules/SqliteDB');

const findDB = function findDB(config) {
  const dbType = {
    mysql: () => new MysqlDatabase(config),
    mongodb: () => new MongoDB(config),
    postgres: () => new PostgresDB(config),
    sqlite: () => new SqliteDB(config),
    default: () => { throw new Error('Tipo di database non implementato'); },
  };
  return (dbType[config.DB_Type] || dbType.default)();
};

const getFiles = jest.fn().mockImplementation(() => [
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
    DB_Address: 'C:/Users/Matteo/Desktop/sqlite_db/sqlite_test_db.db',
    DB_Type: 'sqlite',
  },
]);

const selectConfig = function selectConfig(dbname) {
  const configFiles = getFiles(`${__dirname}/config`);
  let i = 0;
  while (i < configFiles.length) {
    if (dbname === configFiles[i].DB_Name) {
      return configFiles[i];
    }
    i += 1;
  }
  return 0;
};
module.exports = { selectConfig, getFiles, findDB };
