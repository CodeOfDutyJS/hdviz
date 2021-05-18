/* eslint-disable */

const express = require('express');
const fs = require('fs');
//const PostgreDB = require('./modules/PostgreDB');



const {findDB, getFiles, selectConfig}  = require("./utils");


const app = express();
const port = 1337;


const config_files = getFiles(__dirname+'/config');
app.listen(port, () => {
  console.log('App is running');
});

app.get('/api/getDatabases', (req, res) => {   //controllare se qui deve tornare [{"databases":["iris","due"]}]

  let databases = [];
if(config_files){
  for (i in config_files) {
    databases[i] = config_files[i].DB_Name;
  }
  res.json([{databases}]);
}else{
    res.json({
        error: 1,
        msg:"No configuration file found"
      });
}

});


app.get('/api/getTable', async (req, res) => {

  const dbname = req.query.dbname;
  console.log("getTable called");

  const configurazione = selectConfig(dbname,config_files);
  if (configurazione == 0) {
    res.json({
      error: 1,
      msg:"No configuration found"
    });
    return;
  }
  try{
    const database = findDB(configurazione);
    const connection = await Promise.resolve( database.connectTo());
    const tables = await Promise.resolve(database.getTables(connection));
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
  console.log("getData");
  res.setHeader('Access-Control-Allow-Origin', '*');
  const dbname = req.query.dbname;
  const dbtable = req.query.dbtable;

  const configurazione = selectConfig(dbname,config_files);
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
    const data = await Promise.resolve( database.getData(connection, dbtable));
    res.json(data);
    database.endConnection(connection);
  }
  catch(e){
    res.json({
      error: 1,
      msg: e
    })
  }
});

module.exports = app;