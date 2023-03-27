const request = require("supertest");
const { url } = require('./utile');

describe("Test the root path", () => {
  test("GET /", async () => {
    await request(url).get("/").expect(200);
  });

  test("POST /initialize", async () => {
    const res = await request(url).post("/initialize");
    expect(res.statusCode).toBe(200);
    expect(res.body.code).not.toBe('SystemError');
  });
});
