/* eslint-disable */
//import {createConnection, Connection} from "typeorm";
//import "reflect-metadata";


const express = require('express');
//var bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');


const app = express();
app.use(express.json())
app.use(express.json({
  type: ['application/json', 'text/plain']
}));


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

let config_files = getFiles('C:/Users/Matteo/Documents/HD VIZ/hdviz/hdviz/server/src/config');

function selectConfig(dbname) {
  for (const i in config_files) {
    if (dbname == config_files[i].DB_Name) {
      return config_files[i];
    }
  }
  return 0;
}

app.get('/api/getDatabases', (req, res) => {
  console.log('api/getDatabases/ called');
  // res.send(getFiles('config').sort((a,b) => a.length - b.length));
  config_files = getFiles('C:/Users/Matteo/Documents/HD VIZ/hdviz/hdviz/server/src/config');
  let databases = [];
  for (const i in config_files) {
    databases = config_files[i].DB_Name;
  }
  const output = { databases };
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json([output]);
  console.log('api/getDatabases/ terminated successfully');

});


app.get('/api/getTable', (req, res) => {
  
  var dbname = req.body.name;
  console.log('api/getTables/ called');
  console.log(dbname);
  // const dbname = 'prova';


  const configurazione = selectConfig(dbname);

  
  /*
  if (configurazione == 0) {
    res.send(0); // Si Può?
  }
  */
  const connection = mysql.createConnection({
    host: configurazione.DB_Address,
    user: configurazione.DB_Username,
    password: configurazione.DB_Password,
    database: configurazione.DB_Name,
  });

  connection.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to the DB');
    }
  });
  const showtables = `SELECT table_name FROM information_schema.tables WHERE table_schema ='iris'`;
  
  connection.query(showtables, (error, columns, fields) => {
    if (error) {
      console.log('error in the query');
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(columns);
    }
    // connection.end();
  });
  console.log('api/getTables/ terminated successfully');

});

const getMetaData = (connection, tableName, cb) => {
  connection.query(`SHOW Columns FROM ${tableName}`, (err, columns, fields) => {
    if (err) {
      console.log('error in the query');
      cb(err);
    } else {
      const output = {};
      console.log(columns);
      for (const column of columns) {
        output[column.Field] = column.Type;
      }
      cb(null, output);
    }
  });
};

const getData = (connection, tableName, cb) => {
  connection.query(`SELECT * FROM ${tableName}`, (err, rows, fields) => {
    if (err) {
      console.log('error in the query');
      cb(err);
    } else {
      cb(null, rows);
    }
  });
};

app.get('/api/getData/', (req, res) => {
  console.log('api/getData/ called');
  var dbname = req.body.name;
  var dbtable = req.body.table;

  // const dbname = 'prova';
  // const dbtable = 'Candidato';

  const configurazione = selectConfig(dbname);
  if (configurazione == 0) {
    res.send(0); // Si Può?
  }

  const connection = mysql.createConnection({
    host: configurazione.DB_Address,
    user: configurazione.DB_Username,
    password: configurazione.DB_Password,
    database: configurazione.DB_Name,
  });
  
  connection.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to the DB');

      getMetaData(connection, dbtable, (err, columns) => {
        if (err) {
          console.log(err);
        } else {
          getData(connection, dbtable, (err2, rows) => {
            if (err2) {
              console.log(err2);
            } else {
              const output = { cols: columns, rows };
              res.setHeader('Access-Control-Allow-Origin', '*');

              res.json(output);
              console.log('api/getDatabases/ terminated successfully');
            }
          });
        }
      });
    }
    // connection.end();
  });
});

app.listen(port, () => {
  console.log('App is running');
});

// Nome DB, nome collonne, descrizione query
