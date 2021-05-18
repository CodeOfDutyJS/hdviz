module.exports = class Database {
  // implement the connection to the type of server
  static async connectTo() {
    throw new Error('Can\'t connect to abstract class Database');
  }

  // implement showTable to return all the tables of the database
  static async getTables() {
    throw new Error('Can\'t get datas from an abstract class Database');
  }

  // implement getMetadata to return the nome of the columns and all the data of it
  static async getData() {
    throw new Error('Can\'t get datas from an abstract class Database');
  }
};
