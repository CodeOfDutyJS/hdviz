const fs = require('fs');
const MySqlDatabase = require('./modules/MySQLDB');
const MongoDB = require('./modules/MongoDB');
const PostgresDB = require('./modules/PostgresDB');
const SqliteDB = require('./modules/SqliteDB');

const findDB = function finDB(config) {
  const dbType = {
    mysql: () => new MySqlDatabase(config),
    mongodb: () => new MongoDB(config),
    postgres: () => new PostgresDB(config),
    sqlite: () => new SqliteDB(config),
    default: () => { throw new Error('Tipo di database non implementato'); },
  };
  return (dbType[config.DB_Type] || dbType.default)();
};

const getFiles = function getFiles(dir) {
  const myFiles = [];
  const files = fs.readdirSync(dir);
  let i = 0;
  while (i < files.length) {
    const name = `${dir}/${files[i]}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, myFiles);
    } else {
      const text = fs.readFileSync(name, 'utf8');
      myFiles.push(JSON.parse(text));
    }
    i += 1;
  }
  return myFiles;
};

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
