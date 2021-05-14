 jest.mock('../utils');

const request = require('supertest');
const app = require('../index');


describe('getDatabases', () => {

  it('should get the databases', async () => {


    const result = [{ databases: ['iris'] }]; //aggiungere i test per gli altri tipi di db

    const res = await request(app)
      .get('/api/getDatabases');
    expect(res.body).toEqual(result);
  });
/*
  it('should return an error if there is no db', async () => {
    const err = {
        "error": 1,
        "msg":"No configuration found"
      };  //modificare il mock
    const res = await request(app)
      .get('/api/getDatabases');
    expect(res.body).toEqual(err);
  });*/
});
