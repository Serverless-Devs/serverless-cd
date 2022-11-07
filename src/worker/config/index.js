const os = require('os');

const { CD_PIPLINE_YAML, DOWNLOAD_CODE_DIR, ACCESS_KEY_ID, ACCESS_KEY_SECRET, OSS_BUCKET, REGION, OTS_INSTANCE_NAME, OTS_TASK_TABLE_NAME, OTS_TASK_INDEX_NAME, OTS_APP_INDEX_NAME, OTS_APP_TABLE_NAME } = process.env;

module.exports = {
  CD_PIPLINE_YAML,
  CODE_DIR: DOWNLOAD_CODE_DIR || os.tmpdir(),
  CREDENTIALS: {
    accessKeyId: ACCESS_KEY_ID,
    accessKeySecret: ACCESS_KEY_SECRET,
  },
  OSS_CONFIG: {
    bucket: OSS_BUCKET,
    region: REGION,
  },
  OTS: {
    region: REGION,
    instanceName: OTS_INSTANCE_NAME,
  },
  OTS_TASK: {
    name: OTS_TASK_TABLE_NAME,
    index: OTS_TASK_INDEX_NAME,
  },
  OTS_APP: {
    name: OTS_APP_TABLE_NAME,
    index: OTS_APP_INDEX_NAME,
  },
};
