/* eslint-disable */
//node --experimental-modules ServerModule.js

const express = require('express');
const fs = require('fs');
const MysqlDatabase = require('./modules/MySQLDB');
const MongoDB = require('./modules/MongoDB');
//const PostgreDB = require('./modules/PostgreDB');


const config_files = getFiles(__dirname+'/config');

const app = express();
const port = 1337;


const findDB = async function (config) {
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  let databases = [];
  for (i in config_files) {
    databases[i] = config_files[i].DB_Name;
  }
  if (databases=="")  {
    res.json({
      error: 1,
      msg:"No configuration found"
    });
    return;
  }
  res.json([{databases}]);
});


app.get('/api/getTable', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  let dbname = req.query.dbname;
  console.log("getTable called");

  const configurazione = selectConfig(dbname);
  if (configurazione == 0) {
    res.json({
      error: 1,
      msg:"No configuration found"
    });
    return;
  }
  try{
    const database = await findDB(configurazione);
    const connection = await Promise.resolve( database.connectTo());
    let tables = await Promise.resolve(database.getTables(connection));
    res.json(tables);
    database.endConnection(connection);
  }
  catch(e){
    res.json({
      error: 1,
      msg: e
    })
  }
});


app.get('/api/getData/',async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  let dbname = req.query.dbname;
  let dbtable = req.query.dbtable;

  const configurazione = selectConfig(dbname);
  if (configurazione == 0) {
    res.json({
      error: 1,
      msg:"No configuration found"
    });
    return;
  }
  try{
    const database = await findDB(configurazione);
    const connection = await Promise.resolve( database.connectTo());
    let data = await Promise.resolve( database.getData(connection, dbtable));
    res.json(data);
    database.endConnection(connection);
  }
  catch{
    res.json({
      error: 1,
      msg: e
    })
  }
});