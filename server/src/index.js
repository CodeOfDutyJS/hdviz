// node --experimental-modules ServerModule.js

const express = require('express');
const fs = require('fs');
const MysqlDatabase = require('./modules/MySQLDB');
const MongoDB = require('./modules/MongoDB');
const PostgreDB = require('./modules/PostgreDB');

function getFiles(dir, _files) {
  const localFiles = _files || [];
  const files = fs.readdirSync(dir);
  Object.keys(files).forEach((i) => {
    const name = `${dir}/${files[i]}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, localFiles);
    } else {
      const text = fs.readFileSync(name, 'utf8');
      localFiles.push(JSON.parse(text));
    }
  });
  return localFiles;
}

const configFiles = getFiles(`${__dirname}/config`);

const app = express();
const port = 1337;

const findDB = async (config) => {
  const dbType = {
    mysql: new MysqlDatabase(config),
    mongodb: new MongoDB(config),
    postgresql: new PostgreDB(config),
    default: () => console.log('Error'),
  };
  return dbType[config.DB_Type];
};

function selectConfig(dbname) {
  const keys = Object.keys(configFiles);
  for (let i = 0; i < keys.length; i += 1) {
    if (dbname === configFiles[keys[i]].DB_Name) {
      return configFiles[i];
    }
  }
  return 0;
}

app.listen(port, () => {
  console.log('App is running');
});

app.get('/api/getDatabases', (req, res) => {
  // controllare se qui deve tornare [{"databases":["iris","due"]}]
  res.setHeader('Access-Control-Allow-Origin', '*');
  const databases = [];
  Object.keys(configFiles).forEach((i) => {
    databases[i] = configFiles[i].DB_Name;
  });
  if (databases === '') {
    res.json({
      error: 1,
      msg: 'No configuration found',
    });
    return;
  }
  res.json([{ databases }]);
});

app.get('/api/getTable', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { dbname } = req.query.dbname;

  const configurazione = selectConfig(dbname);
  if (configurazione === 0) {
    res.json({
      error: 1,
      msg: 'No configuration found',
    });
    return;
  }
  try {
    const database = await findDB(configurazione);
    const connection = await Promise.resolve(database.connectTo());
    const tables = await Promise.resolve(database.getTables(connection));
    res.json(tables);
    database.endConnection(connection);
  } catch (e) {
    res.json({
      error: 1,
      msg: e,
    });
  }
});

app.get('/api/getData/', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { dbname } = req.query.dbname;
  const { dbtable } = req.query.dbtable;

  const configurazione = selectConfig(dbname);
  if (configurazione === 0) {
    res.json({
      error: 1,
      msg: 'No configuration found',
    });
    return;
  }
  try {
    const database = await findDB(configurazione);
    const connection = await Promise.resolve(database.connectTo());
    const data = await Promise.resolve(database.getData(connection, dbtable));
    res.json(data);
    database.endConnection(connection);
  } catch (e) {
    res.json({
      error: 1,
      msg: e,
    });
  }
});
