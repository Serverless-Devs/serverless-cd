const request = require("supertest");
const { url, user } = require('./utile');

describe("Test user authentication", () => {

});

describe("Test the application path", () => {
  test("GET /", async () => {
    await request(url).get("/").expect(200);
  });
});
