const express = require('express');
const { findDB, getFiles, selectConfig } = require('./utils');
const { port } = require('./config.json');

const app = express();

const configFiles = getFiles(`${__dirname}/config`);
app.listen(port, () => { console.log(`Server start at port ${port}`); });

app.get('/api/getDatabases', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const databases = [];

  let i = 0;
  while (i < configFiles.length) {
    databases[i] = configFiles[i].DB_Name;
    i += 1;
  }
  if (databases === '') {
    res.json({
      error: 1,
      msg: 'No configuration file found',
    });
    return;
  }
  res.json([{ databases }]);
});

app.get('/api/getTables', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { dbname } = req.query;
  const configurazione = selectConfig(dbname);

  if (configurazione === 0) {
    res.json({
      error: 1,
      msg: 'No configuration file found',
    });
    return;
  }
  try {
    const db = findDB(configurazione);
    const tables = await db.getTables();
    res.json(tables);
  } catch (e) {
    res.json({
      error: 1,
      msg: e,
    });
  }
});

app.get('/api/getData/', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { dbname } = req.query;
  const { dbtable } = req.query;
  const configurazione = selectConfig(dbname);

  if (configurazione === 0) {
    res.json({
      error: 1,
      msg: 'No configuration found',
    });
    return;
  }
  try {
    const db = await findDB(configurazione);
    const data = await db.getData(dbtable);
    res.json(data);
  } catch (e) {
    res.json({
      error: 1,
      msg: e,
    });
  }
});

module.exports = app;
