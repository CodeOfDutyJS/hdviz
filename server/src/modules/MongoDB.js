const mongo = require('mongodb').MongoClient;
const Database = require('./Database');

module.exports = class MongoDb extends Database {
  constructor(config) {
    super();
    this.config = config;
    this.uri = config.DB_Address + config.DB_Name;
  }

  async connectTo() {
    return new Promise((resolve, reject) => {
      mongo.connect(this.uri, { useUnifiedTopology: true }, (err, db) => {
        if (err) {
          reject(new Error('connecting to the DB'));
        } else resolve(db);
      });
    });
  }

  async getTables() {
    const conn = await this.connectTo();
    return new Promise((resolve, reject) => {
      if (conn) {
        conn.db(this.config.DB_Name).listCollections().toArray()
          .then((res) => res.map((out) => out.name))
          .then((res) => {
            if (res.length === 0) {
              reject(new Error('executing the query'));
            } else resolve(res);
          });
      } else {
        reject(new Error('executing the query'));
      }
    });
  }

  async getData(collectionName) {
    const conn = await this.connectTo();
    return new Promise((resolve, reject) => {
      if (conn && collectionName) {
        conn.db(this.config.DB_Name).collection(collectionName).find().toArray()
          .then((res) => {
            if (res.length === 0) {
              reject(new Error('unable to get the data'));
            } else resolve(res);
          });
      } else {
        reject(new Error('unable to get the data'));
      }
    });
  }
};
