const request = require("supertest");
const _ = require('lodash');
const { url, login } = require('./utile');

const applicationCreate = `/api/application/create`;

describe("Test the application path", () => {
  let jwt;
  let username;
  beforeAll(async () => {
    const loginResult = await login();
    jwt = loginResult.jwt;
    username = loginResult.username;
  });

  test(`POST ${applicationCreate}`, async () => {
    const payload = {
      "name": "xxxxx2",
      "provider": "github",
      "repo_url": "https://github.com/wss-git/fc-puppeteer-demo.git",
      "repo": "fc-puppeteer-demo",
      "repo_owner": "wss-git",
      "repo_id": "307883743",
      "environment": {
        "default": {
          "type": "testing",
          "trigger_spec": {
            "github": {
              "push": {
                "branches": {
                  "precise": [
                    "serverless-cd-project-setup"
                  ]
                }
              }
            }
          },
          "secrets": {},
          "cd_pipeline_yaml": "serverless-pipeline.yaml"
        }
      }
    };
    const res = await request(url).post(`${applicationCreate}?orgName=${username}`)
      .set('Cookie', [`jwt=${jwt}`])
      .send(payload)
      .expect(200);
    expect(_.get(res, 'body.success')).toBeTruthy();
  });
});
