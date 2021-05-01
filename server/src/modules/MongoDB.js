import { MongoClient } from 'mongodb';
import Database from './Database';

export default class MongoDb extends Database {
  constructor(config) {
    super(config);
    this.uri = config.DB_Address + config.DB_Name;
  }

  async connectTo() {
    return new Promise((resolve) => {
      resolve(MongoClient.connect(this.uri, {
        useUnifiedTopology: true,
      }));
    });
  }

  async getTables(conn) {
    return Promise
      .resolve(
        conn.db(this.config.DB_Name)
          .listCollections()
          .toArray(),
      ).then((res) => res.map((out) => out.name));
  }

  async getData(conn, collectionName) {
    return new Promise((resolve) => {
      // const coll = Promise.resolve(conn.db(this.config.DB_Name));
      resolve(conn.db(this.config.DB_Name).collection(collectionName).find().toArray());
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async endConnection(conn) {
    conn.close();
  }
}
