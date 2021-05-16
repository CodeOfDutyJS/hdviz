
const MysqlDatabase = require('../modules/MySQLDB');
const MongoDB = require('../modules/MongoDB');
// const PostgreDB = require('./modules/PostgreDB')
;


const findDB = function (config) {
  const dbType = {
    'mysql': () => { return new MysqlDatabase(config)},
    'mongodb': () => { return new MongoDB(config)},
    'default': () => {throw ('Tipo di database non implementato')}
  };
    return (dbType[config.DB_Type] || dbType['default'])();
};

const getFiles = jest.fn((dir, files_)=> {

  return [{
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
});



const selectConfig = function(dbname) {
  const config_files = getFiles(__dirname+'/config');

  for ( i in config_files) {
    if (dbname == config_files[i].DB_Name) {
      return config_files[i];
    }
  }
  return 0;
}
 module.exports = {selectConfig, getFiles, findDB}