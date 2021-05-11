/* eslint-disable */
//node --experimental-modules ServerModule.js

const express = require('express');
const fs = require('fs');
//const PostgreDB = require('./modules/PostgreDB');
const {findDB}  = require("./utils");
const { getFiles} = require("./utils");


const config_files = getFiles(__dirname+'/config');

const app = express();
const port = 1337;


const selectConfig = function(dbname) {

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
  console.log("getData");
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
  catch(e){
    res.json({
      error: 1,
      msg: e
    })
  }
});

module.exports = {
  getFiles, findDB, selectConfig
}