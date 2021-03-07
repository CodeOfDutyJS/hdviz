const express = require('express');
const fs = require('fs');
const mysql = require ('mysql');
const app = express();
const port = 3000;
var config_files = getFiles('config');

app.get('/api/getDatabases/', (req,res) => {
  console.log('api/getDatabases/ called')
  //res.send(getFiles('config').sort((a,b) => a.length - b.length));
  config_files=getFiles('config');
  var databases = [];
  for ( var i in config_files){
    databases=config_files[i].DB_Name;
  }
  const output = {databases: databases}
  res.send(JSON.stringify(output))
  console.log('api/getDatabases/ terminated successfully');
});


app.get('/api/getTables/', function(req, res) {
  //var dbname = req.param('dbname');
  console.log('api/getTables/ called')
  var dbname = 'TestHDViz';

  var configurazione = selectConfig(dbname);
  if (configurazione==0){
    res.send(0); //Si Può?
  }
  var connection = mysql.createConnection({
      host: configurazione.DB_Address,
      user: configurazione.DB_Username,
      password: configurazione.DB_Password,
      database: configurazione.DB_Name
      });
  connection.connect((err) => {
      if (err){
          console.log(err);
      } else {
          console.log('Connected to the DB');
      }
  })
  var showtables = "SELECT table_name FROM information_schema.tables WHERE table_schema ='" + dbname + "'";
  connection.query(showtables, function(error,columns,fields){
    if(error){
      console.log('error in the query');
    }
    else {
      res.send(columns);
    }
  })
  console.log('api/getDatabases/ terminated successfully');
})

const getMetaData = (connection, tableName, cb) => {
    connection.query("SHOW Columns FROM " + tableName, function(err, columns, fields) {
      if(err){
          console.log('error in the query');
          cb(err)
      } else {
          var output = {}
          console.log(columns)
          for(var column of columns) {
            output[column.Field] = column.Type
          }
          cb(null, output)
      }
    })
}
const getData = (connection, tableName, cb) => {
    connection.query("SELECT * FROM " + tableName, function(err, rows, fields) {
      if(err){
          console.log('error in the query');
          cb(err)
      } else {
          cb(null, rows)
      }
    })
}

app.get('/api/getData/', function(req,res){
  console.log('api/getData/ called')
  /*var dbname = req.param('dbname');
  var dbtable = req.param('dbtable');*/
  var dbname = 'TestHDViz';
  var dbtable = 'citta';

  var configurazione = selectConfig(dbname);
  if (configurazione==0){
    res.send(0); //Si Può?
  }
  var connection = mysql.createConnection({
      host: configurazione.DB_Address,
      user: configurazione.DB_Username,
      password: configurazione.DB_Password,
      database: configurazione.DB_Name
      });
  connection.connect((err) => {
      if (err){
          console.log(err);
      } else {
          console.log('Connected to the DB');

          getMetaData(connection, dbtable, function(err, columns) {
            if(err) {
              console.log(err);
            } else {
              getData(connection, dbtable, function(err2, rows) {
                if(err2) {
                  console.log(err2)
                } else {
                  const output = {cols: columns, rows: rows}
                  res.send(JSON.stringify(output))
                  console.log('api/getDatabases/ terminated successfully');
                }
              })
            }

          })
      }
  })
})

app.listen(port, () => {
  console.log('App is running')
})


//Nome DB, nome collonne, descrizione query


function selectConfig(dbname){
  for (var i in config_files)
  {
    if(dbname == config_files[i].DB_Name)
    {
      return config_files[i];
    }
  }
  return 0;
}

function getFiles(dir,files_){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()){
      getFiles(name, files_);
    } else {
      var text = fs.readFileSync(name,'utf8');
      files_.push(JSON.parse(text));
    }
  }
  return files_;
}
