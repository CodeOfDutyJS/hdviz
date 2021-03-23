/* eslint-disable */

const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

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

let config_files = getFiles(__dirname+'/config');

function selectConfig(dbname) {
  for (const i in config_files) {
    if (dbname == config_files[i].DB_Name) {
      return config_files[i];
    }
  }
  return 0;
}

app.get('/api/getDatabases/', (req, res) => {
  console.log('api/getDatabases/ called');
  config_files = getFiles(__dirname+'/config');
  let databases = [];
  for (const i in config_files) {
    databases = config_files[i].DB_Name;
  }
  const output = { databases };
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json([output]);
  //res.send([output]);
  console.log('api/getDatabases/ terminated successfully');
});

app.get('/api/getTables/', (req, res) => {
  let dbname = req.params('dbname');
  console.log('api/getTables/ called');
  // const dbname = 'prova';

  const configurazione = selectConfig(dbname);
  if (configurazione == 0) {
    res.json({});
    return;
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
    }
  });
  connection.query('SELECT table_name FROM information_schema.tables WHERE table_schema = ?', [dbname] , (error, columns, fields) => {
    if (error) {
      console.log('error in the query');
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(columns);
    }
    // connection.end();
  });
  console.log('api/getDatabases/ terminated successfully');
  connection.end();
});

const getMetaData = (connection, tableName, cb) => {
  connection.query(`SHOW Columns FROM ?`, [tableName], (err, columns, fields) => {
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
  connection.query(`SELECT * FROM ?`, [tableName] , (err, rows, fields) => {
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
  let dbname = req.params('dbname');
  let dbtable = req.params('dbtable');
  //const dbname = 'prova';
  //const dbtable = 'Candidato';

  const configurazione = selectConfig(dbname);
  if (configurazione == 0) {
    res.json({});
    return;
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
    connection.end();
  });
});

app.listen(port, () => {
  console.log('App is running');
});

// Nome DB, nome collonne, descrizione query
