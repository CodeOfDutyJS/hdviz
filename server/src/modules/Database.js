/* eslint-disable class-methods-use-this */
module.exports = class Database {
  constructor(config) {
    this.config = config;
  }

  // implement the connection to the type of server
  async connectTo() {
    throw new Error('Can\'t connect to abstract class Database');
  }

  // implement showTable to return all the tables of the database
  async getTables() {
    throw new Error('Can\'t SHOW to abstract class Database');
  }

  // implement getMetadata to return the nome of the columns and all the data of it
  async getData() {
    throw new Error('Can\'t get datas from an abstract class Database');
  }

  // implement the ending of the connection
  endConnection() {
    throw new Error('Can\'t end an abstract class Database');
  }
};
