let connection;

function getTables(dbname,config,conn){
  const showtables = `SELECT table_name FROM information_schema.tables WHERE table_schema ='${dbname}'`;
  return new Promise ((resolve, reject) => {
        conn.query(showtables, (error, columns, fields) => {
        return error ? reject(error) : resolve(columns);
      });
    }
  );
  conn.end();
}

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


function getDatas(dbname, dbtable){
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
}




module.exports = {
  getTables,
};
