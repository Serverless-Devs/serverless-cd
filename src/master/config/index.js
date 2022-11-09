const {
  ACCESS_KEY_ID,
  ACCESS_KEY_SECRET,
  ACCOUNTID,
  OTS_INSTANCE_NAME,
  OTS_USER_TABLE_NAME,
  OTS_USER_INDEX_NAME,
  OTS_APP_TABLE_NAME,
  OTS_APP_INDEX_NAME,
  WORKER_FUNCTION_NAME,
  SERVICE_NAME,
  REGION,
  CD_PIPLINE_YAML,
} = process.env;

module.exports = {
  CD_PIPLINE_YAML,
  CREDENTIALS: {
    accountId: ACCOUNTID,
    accessKeyId: ACCESS_KEY_ID,
    accessKeySecret: ACCESS_KEY_SECRET,
  },
  OTS: {
    region: REGION,
    instanceName: OTS_INSTANCE_NAME,
  },
  OTS_USER: {
    name: OTS_USER_TABLE_NAME,
    index: OTS_USER_INDEX_NAME,
  },
  OTS_APPLICATION: {
    name: OTS_APP_TABLE_NAME,
    index: OTS_APP_INDEX_NAME,
  },
  FC: {
    workerFunction: {
      region: REGION,
      serviceName: SERVICE_NAME,
      functionName: WORKER_FUNCTION_NAME,
    },
  }
}
