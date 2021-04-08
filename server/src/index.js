/* eslint-disable */
//node --experimental-modules ServerModule.js

const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const serverModule = require ('./modules/ServerModule');

const app = express();
const port = 1337;


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

const config_files = getFiles('C:/Users/Matteo/Documents/HD VIZ/hdviz/hdviz/server/src/config');

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
  console.log('api/getDatabases/ called');
  // res.send(getFiles('config').sort((a,b) => a.length - b.length));
  //config_files = getFiles('C:/Users/Matteo/Documents/HD VIZ/hdviz/hdviz/server/src/config');
  let databases = [];
  console.log(config_files);
  for (i in config_files) {
    databases[i] = config_files[i].DB_Name;
  }
  const output = { databases };
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json([output]);
  console.log('api/getDatabases/ terminated successfully');

});


app.get('/api/getTable', async (req, res) => {
  var dbname = req.param('dbname');
  //var dbname = req.body.name;                     //verificare se il modo in cui si fa fetch va bene da parte client
  console.log('api/getTables/ called');



  const configurazione = selectConfig(dbname);
  if (configurazione == 0) {
    res.send(0); // Si Può?
  }

/*
serverModule.connectTo(configurazione).then(conn => serverModule.showTables(conn,configurazione).then(col => {
  res.setHeader('Access-Control-Allow-Origin', '*');
   res.json(col);
   
}
).then(conn.end() )); */  //volendo usare await per codice più leggibile

const connection = await serverModule.connectTo(configurazione).catch(e => console.log(e));
let colonne = await serverModule.showTables(connection,configurazione).catch(e => console.log(e));;
res.setHeader('Access-Control-Allow-Origin', '*');
res.json(colonne);
connection.end();


  console.log('api/getTables/ terminated successfully');

});


app.get('/api/getData/',async (req, res) => {
  console.log('api/getData/ called');
  var dbname = req.param('dbname');
  var dbtable = req.param('dbtable')

  const configurazione = selectConfig(dbname);
  if (configurazione == 0) {
    res.send(0); // Si Può?
  }
/*
  serverModule.connectTo(configurazione).then(conn => serverModule.getMetaData( conn,dbtable,configurazione).then( data => {
    res.setHeader('Access-Control-Allow-Origin', '*');  //inserire la promessa in getMetaData()
  res.json(data);
  }) );*/

  const connection = await serverModule.connectTo(configurazione).catch(e => console.log(e));;
  let data = await serverModule.getMetaData(connection, dbtable, configurazione).catch(e => console.log(e));;
  res.setHeader('Access-Control-Allow-Origin', '*');  //inserire la promessa in getMetaData()
  res.json(data);
  connection.end();


console.log('api/getDatabases/ terminated successfully');


    });


// Nome DB, nome collonne, descrizione query
