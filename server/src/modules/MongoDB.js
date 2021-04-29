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

      mongo.connect(this.uri, { useUnifiedTopology: true, }, (err, db) => {
        if (err){resolve({
          msg:"Error connecting to the DB"
        });
      }else resolve(db)
    }

      );

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
