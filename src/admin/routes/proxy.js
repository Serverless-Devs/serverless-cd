const router = require('express').Router();
const httpx = require('httpx');
const { lodash: _ } = require('@serverless-cd/core');
const { NotFoundError } = require('../util/custom-errors');
const { Result } = require("../util");

/**
 * method: POST
 * params:
 * {
 *  type: 'github',
 *  urlPath: 'orgs/serverless-cd-demo/repos'
 * }
 */
// TODO: 缓存到数据库
let appCenterList = [];

router.post('/appCenter', async function (req, res, _next) {
  let baseUrl = '';
  const {type, urlPath } = req.body;
  if(type === 'github') {
    try {
      if(!_.isEmpty(appCenterList)) {
        return res.json(Result.ofSuccess({ appCenterList }));
      }
  
      baseUrl = 'https://api.github.com/';
      const githubUrl = baseUrl + urlPath;
      console.log('proxy url:', githubUrl);
      const response = await httpx.request(githubUrl, {
        method: 'GET',
        timeout: 0,
        headers: {
         "User-Agent": 'serverless-cd' 
        }
      });
      let result = await httpx.read(response, 'utf8');
      const contentType = response.headers['content-type'] || '';
      if (contentType.startsWith('application/json')) {
        // TODO: Need to add additional messages when an error is thrown
        result = JSON.parse(result);
      }
      appCenterList = result;
      return res.json(Result.ofSuccess({ appCenterList }));
    } catch (error) {
      return res.json(Result.ofError(error.message, NotFoundError))
    }
    
  }else {
    return res.json(Result.ofError(error.message, NotFoundError));
  }
});

module.exports = router;