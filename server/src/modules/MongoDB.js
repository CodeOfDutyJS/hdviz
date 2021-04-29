/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
const ObjectId = require('mongodb').ObjectID;
const mongo = require('mongodb').MongoClient;
const Database = require('./Database');

module.exports = class MongoDb extends Database {
  constructor(config) {
    super(config);
    this.uri = config.DB_Address + config.DB_Name;
  }

  async connectTo() {
    return new Promise((resolve, reject) => {
      mongo.connect(this.uri, { useUnifiedTopology: true }, (err, db) => {
        if (err) {
          reject({
            error: 1,
            msg: 'Error connecting to the DB',
          });
        } else resolve(db);
      });
    });
  }

  async getTables(conn) {
    return new Promise((resolve, reject) => {
      // return Promise.resolve(conn.db("gigi").listCollections().toArray()).then((res) => res.map( out => out.name));
      conn.db(this.config.DB_Name).listCollections().toArray().then((res) => res.map((out) => out.name)).then(res =>{
        if(res.length != 0){ //non esiste un database mongo senza alcuna collezione
          resolve(res);
        } else  reject({
          error: 1,
          msg: 'Error connecting to the DB',
        });
      });
  });
}

  async getData(conn, collectionName) {
    return new Promise((resolve, reject) => {
      // const coll = Promise.resolve(conn.db(this.config.DB_Name));
      conn.db(this.config.DB_Name).collection(collectionName).find().toArray().then(res =>{
        if(res.length != 0 ){  //da errore anche se la collezione non ha nessun oggeto, andrà bene?
          resolve(res)
        }else reject({
          error: 1,
          msg:"Error executing the query"
        });
      });
    })
  }

  async endConnection(conn) {
    conn.close();
  }
};
