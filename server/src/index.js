const { findDB, getFiles, selectConfig } = require('./utils');

const app = express();
const port = 1337;

const configFiles = getFiles(`${__dirname}/config`);
app.listen(port, () => {});

app.get('/api/getDatabases', (req, res) => { // controllare se qui deve tornare [{"databases":["iris","due"]}]
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
