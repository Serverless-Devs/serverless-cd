const ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
};

const PROVIDER = {
  GITHUB: 'github',
};

const TABLE = {
  USER: 'user',
  ORG: 'org',
  TASK: 'task',
  APPLICATION: 'application',
};

module.exports = {
  // 用户在组织的角色
  ROLE,
  // 支持代码仓库
  PROVIDER,
  // 数据库表名称
  TABLE,
  // cd 的 pipeline 文件名称
  CD_PIPELINE_YAML: 'serverless-pipeline.yaml',
  // 组织拥有者字段枚举
  OWNER_ROLE_KEYS: [ROLE.OWNER],
  // 组织管理者字段枚举
  ADMIN_ROLE_KEYS: [ROLE.OWNER, ROLE.ADMIN],
  // 登陆超时时间
  SESSION_EXPIRATION: 7 * 24 * 60 * 60 * 1000,
  // webhook 事件支持
  WEBHOOK_EVENTS: ['push', 'pull_request'],
  // 不验证登陆的路由
  EXCLUDE_AUTH_URL: ['/auth/login', '/auth/signUp'],
};
