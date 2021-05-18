const request = require('supertest');
const app = require('../index');

jest.mock('../index');
jest.mock('../utils');

describe('index.js test', () => {

describe('getDatabases', () => {
  it('should get the databases', async () => {
    const dbTest = [{ databases: ['mongodb_test_db', 'mysql_test_db', 'postgres_test_db', 'sqlite_test_db'] }]; // aggiungere i test per gli altri tipi di db
    const res = await request(app)
      .get('/api/getDatabases');
    expect(res.body).toEqual(dbTest);
  });
});

describe('getTable', () => {
  it('should return the tables - mongo', async () => {
    const res = await request(app)
      .get('/api/getTable?dbname=mongodb_test_db');
    expect(res.body).toEqual(['iris_mongodb']);
  });

  it('should return the tables - mysql', async () => {
    const res = await request(app)
      .get('/api/getTable?dbname=mysql_test_db');
    expect(res.body).toEqual(['iris_mysql']);
  });

  it('should return the tables - postgres', async () => {
    const res = await request(app)
      .get('/api/getTable?dbname=postgres_test_db');
    expect(res.body).toEqual(['iris_postgres']);
  });
/*
  it('should return the tables - sqlite', async()=>{
    const res = await request(app)
    .get('/api/getTable?dbname=sqlite_test_db');
  expect(res.body).toEqual(["iris_sqlite"]);
  }) */
});

describe('getData', () => {
  it('should get the databases available - mysql', async () => {
    const res = await request(app)
      .get('/api/getData?dbname=mysql_test_db&dbtable=iris_mysql');
    expect(res.body).toHaveLength(151);
  });
  it('should get the databases available - mongodb', async () => {
    const res = await request(app)
      .get('/api/getData?dbname=mongodb_test_db&dbtable=iris_mongodb');
    expect(res.body).toHaveLength(150);
  });
  it('should get the databases available - postgres', async () => {
    const res = await request(app)
      .get('/api/getData?dbname=postgres_test_db&dbtable=iris_postgres');
    expect(res.body).toHaveLength(150);
  });
  /*
    it('should get the databases available - sqlite', async()=>{
      const res = await request(app)
      .get('/api/getData?dbname=sqlite_test_db&dbtable=iris_sqlite');
    expect(res.body).toHaveLength(150);
    }) */
});

describe('errors', () => {
  it('should get error from getTable', async () => {
    const err_msg = {
      error: 1,
      msg: 'No configuration found',
    };
    const res = await request(app)
      .get('/api/getTable?dbname=niente');
    expect(res.body).toEqual(err_msg);
  });

  it('should get an error - db name not existing', async () => {
    const err_msg = {
      error: 1,
      msg: 'No configuration found',
    };
    const res = await request(app)
      .get('/api/getData?dbname=nonPresente&dbtable=collezione1');
    expect(res.body).toEqual(err_msg);
  });

  it('should get an error - table not existing', async () => {
    const err_msg = {
      error: 1,
      msg: 'No configuration found',
    };

    const res = await request(app)
      .get('/api/getData?dbname=Mongodb=noCollection');
    expect(res.body).toEqual(err_msg);
  });
});
})