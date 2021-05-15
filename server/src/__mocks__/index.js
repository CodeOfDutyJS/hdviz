/* eslint-disable */

const express = require('express');
const fs = require('fs');
//const PostgreDB = require('./modules/PostgreDB');
jest.mock('../utils');
const {findDB, getFiles, selectConfig}  = require("./utils");


const app = express();
const port = 1337;



app.listen(port, () => {
  console.log('App is running');
});

app.get('/api/getDatabases', (req, res) => {   //controllare se qui deve tornare [{"databases":["iris","due"]}]


  const config_files = req.query.test;
  let databases = [];
if(config_files){
    let i = 0;
  while (config_files[i]) {
    databases[i] = config_files[i].DB_Name;
    i = i+1;
  }
  res.json([{databases}]);
}else{
    res.json({
        error: 1,
        msg:"No configuration found"
      });
}

});


app.get('/api/getTable', async (req, res) => {

  const dbname = req.query.dbname;
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

  const dbname = req.query.dbname;
  const dbtable = req.query.dbtable;

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