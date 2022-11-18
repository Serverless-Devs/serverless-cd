const session = require('express-session');
const { COOKIE_SECRET } = require('../config');
const { lodash: _ } = require('@serverless-cd/core');
const expressOtsSession = require('@serverless-cd/express-ots-session');


const { OTS, CREDENTIALS, OTS_SESSION, SESSION_EXPIRATION } = require('../config');

const options = {
  config: {
    ...OTS,
    ...CREDENTIALS,
  },
  tableName: OTS_SESSION['name'],
  indexName: OTS_SESSION['index'],
  expiration: Number(SESSION_EXPIRATION),
};

module.exports = function (req, res, next) {
  if (_.isEmpty(req.headers.cd_token)) {
    const OtsStore = expressOtsSession(session);
    const store = new OtsStore(options, {
      session_id: 'id',
      expire_date: 'expire_time',
      session_data: 'session_data',
    });
    
    session({
      store,
      secret: COOKIE_SECRET,
      resave: false,
      saveUninitialized: true,
    })(req, res, next);
  } else {
    next();
  }
};
