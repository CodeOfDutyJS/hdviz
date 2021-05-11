const MysqlDatabase = require('./modules/MySQLDB');
const MongoDB = require('./modules/MongoDB');
//const PostgreDB = require('./modules/PostgreDB');
const fs = require('fs');


module.exports.findDB = function (config) {
    const dbType = {
      mysql: new MysqlDatabase(config),
      mongodb: new MongoDB(config),
      //postgresql: new PostgreDB(config),
      default: function(){
        console.log('Error')
      }
    };
    return dbType[config.DB_Type];
  };

  
  module.exports.getFiles = function(dir, files_) {
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
  }