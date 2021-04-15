/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
const mongo = require('mongodb').MongoClient;
const Database = require('./Database');

module.exports = class MongoDb extends Database {
  constructor(config) {
    super(config);
    this.uri = config.DB_Address + config.DB_Name;
  }

  async connectTo() {
    return new Promise((resolve, reject) => {

      resolve(new mongo.connect(this.uri, {
        useUnifiedTopology: true,
      }));
    });
  }

  async getTables(conn) {
    return Promise.resolve(conn.db(this.config.DB_Name).listCollections().toArray()).then((res) => res.map( (out) => out.name));
  }

  async getData(conn, collectionName) {
    return new Promise((resolve,reject) => {
      //const coll = Promise.resolve(conn.db(this.config.DB_Name));
      resolve(conn.db(this.config.DB_Name).collection(collectionName).find().toArray());


    });

  }

  async endConnection(conn) {
    conn.close();
  }
};
