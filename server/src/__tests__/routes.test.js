const request = require('supertest');
const app = require("../index");

describe("get", () => {  //fare il mock del config_files
    it("should get", async () => {
        const result = [{"databases":["iris"]}];
       const res = await request(app)
        .get("/api/getDatabases")
        expect(res.body).toEqual(result);
    })
})