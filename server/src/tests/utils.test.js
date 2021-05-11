const MysqlDatabase = require('../modules/MySQLDB');
const MongoDB = require('../modules/MongoDB');

const {findDB}  = require("../utils");
const { getFiles} = require("../utils");

test('should create a db', () => {  //fare anche gli altri test dei db implementati

   let config_mysql = {
        "DB_Name": "iris",
        "DB_Address": "localhost",
        "DB_Username": "root",
        "DB_Password": "",
        "DB_Type": "mysql"
      };
       let config_mongo = {
      "DB_Name": "Mongodb",
      "DB_Address": "mongodb://localhost:27017/",
      "DB_Type": "mongodb"
    };
      
    const mysqlTest = new MysqlDatabase(config_mysql);
    const mongoTest = new MongoDB(config_mongo);

    expect(findDB(config_mysql)).toEqual(mysqlTest);
    expect(findDB(config_mongo)).toEqual(mongoTest);
})