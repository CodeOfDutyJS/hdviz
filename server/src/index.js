/* eslint-disable */
//node --experimental-modules ServerModule.js

const express = require('express');
const fs = require('fs');
//const bodyParser = require('body-parser');

const MysqlDatabase = require('./modules/MySQLDB');
const MongoDB = require('./modules/MongoDB');


const app = express();
const port = 1337;


const findDB = async function (config) {
  const dbType = {
    MySQL: new MysqlDatabase(config),
    MongoDB: new MongoDB(config),
    default: function(){
      console.log('ERROREEEEEEEEEEEEE')}
  };
  return dbType[config.DB_Type];
};



function getFiles(dir, files_) {
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

const config_files = getFiles(__dirname+'/config');

 function selectConfig(dbname) {
  for ( i in config_files) {
    if (dbname == config_files[i].DB_Name) {
      return config_files[i];
    }
  }
  return 0;
}

app.listen(port, () => {
  console.log('App is running');
});

app.get('/api/getDatabases', (req, res) => {   //controllare se qui deve tornare [{"databases":["iris","due"]}]

  let databases = [];
  for (i in config_files) {
    databases[i] = config_files[i].DB_Name;
  }
  const output = { databases };
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json([output]);
  console.log('api/getDatabases/ terminated successfully');

});


app.get('/api/getTable', async (req, res) => {
  console.log("getTable called");
  let dbname = req.query.dbname;

  const configurazione = selectConfig(dbname);
  if (configurazione == 0) {
    res.send(0); // Si Può?
  }


const database = await findDB(configurazione);
const connection = await Promise.resolve( database.connectTo());
let tables = await Promise.resolve(database.getTables(connection));
res.setHeader('Access-Control-Allow-Origin', '*');
res.json(tables);
database.endConnection(connection);

});


app.get('/api/getData/',async (req, res) => {
console.log("getData called");
  let dbname = req.query.dbname;
  let dbtable = req.query.dbtable;



  const configurazione = selectConfig(dbname);
  if (configurazione == 0) {
    res.send(0); // Si Può?
  }



  const database = await findDB(configurazione);
const connection = await Promise.resolve( database.connectTo());

let data = await Promise.resolve( database.getData(connection, dbtable));
res.setHeader('Access-Control-Allow-Origin', '*');  //inserire la promessa in getMetaData()
res.json(data);
database.endConnection(connection);

    });
