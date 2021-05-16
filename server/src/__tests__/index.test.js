
const request = require('supertest');
const app = require('../index');
const fs = require('fs');

//const mymock = require('../__mocks__/MyMocks');
jest.mock('../utils');
jest.mock('../index');
const {findDB, getFiles, selectConfig}  = require("../__mocks__/utils");


jest.mock('../utils', () => ({
  current: jest.fn(),
}));

describe('getDatabases', () => {
  const err = {
    "error": 1,
    "msg":"No configuration file found"
  }; 

  it('should get the databases', async () => {
    
    const databases_test = [{ databases: ['iris','Mongodb']}]; //aggiungere i test per gli altri tipi di db
    const res = await request(app)
      .get('/api/getDatabases');
    expect(res.body).toEqual(databases_test);
  });

  it('should return an error if there is no db', async () => {
    getFiles.mockImplementationOnce(() => {
      return 0;
    })
    const res = await request(app)
  .get('/api/getDatabases');
expect(res.body).toEqual(err);
});

});

describe('getTable', () => {
  it('should return the tables', async()=>{
    const res = await request(app)
    .get('/api/getTable?dbname=Mongodb');
  expect(res.body).toEqual(["collezione1"]);
  })

  it('should get error from getTable', async()=>{
    const err_msg={
      error: 1,
      msg:"No configuration found"
    }
    const res = await request(app)
    .get('/api/getTable?dbname=niente');
  expect(res.body).toEqual(err_msg);
  })
})


describe('getData', ()=>{
  const err_msg = {
    error: 1,
    msg:"No configuration found"
  }

  it('should get the databases available', async()=>{
    const res = await request(app)
    .get('/api/getData?dbname=Mongodb&dbtable=collezione1');
  expect(res.body).toHaveLength(150);
  })

  it('should get an error - db name not existing', async()=> {
    const res = await request(app)
    .get('/api/getData?dbname=nonPresente=collezione1');
  expect(res.body).toEqual(err_msg);
  })

  it('should get an error - table not existing', async()=> {
  
    const res = await request(app)
    .get('/api/getData?dbname=Mongodb=noCollection');
  expect(res.body).toEqual(err_msg);
  })
})
