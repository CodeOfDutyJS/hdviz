const fs = require('fs');
const MysqlDatabase = require('./modules/MySQLDB');
const MongoDB = require('./modules/MongoDB');
// const PostgreDB = require('./modules/PostgreDB')
;
const MySqlDatabase = require('./modules/MySQLDB');


const findDB = function (config) {
  const dbType = {
    'mysql': () => { return new MySqlDatabase(config)},
    'mongodb': () => { return new MongoDB(config)},
    'default': () => {throw ('Tipo di database non implementato')}
  };
    return (dbType[config.DB_Type] || dbType['default'])();
}


const getFiles = function (dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = `${dir}/${files[i]}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      const text = fs.readFileSync(name, 'utf8');
      files_.push(JSON.parse(text));
    }
  }
  return files_;
};

const config_files = getFiles(__dirname+'/config');

const selectConfig = function(dbname) {

  for ( i in config_files) {
    if (dbname == config_files[i].DB_Name) {
      return config_files[i];
    }
  }
  return 0;
}
 module.exports = {selectConfig, getFiles, findDB}