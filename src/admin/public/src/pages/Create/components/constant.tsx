export enum CREATE_TYPE {
  Template = 'template',
  Repository = 'repository',
}

export enum PUSH {
  SPECIFY = 'specify',
  NEW = 'new',
}

export const DEFAULT_NEW_BRANCH = 'serverless-cd-project-setup';

export enum TRIGGER_TYPE {
  PUSH = 'push',
  RELEASE = 'release',
}

export enum IFilterType {
  BRANCH = 'branch',
  INPUT = 'input',
}
export const REGISTRY_URL = 'https://registry.devsapp.cn/console/applications?type=fc&lang=zh';

export const SERVERLESS_DEVS_LIST_PACKAGE = [
  'start-egg',
  'start-express',
  'website-docusaurus',
  'start-koa',
  'start-django',
];

export const SERVERLESS_PIPELINE_CONTENT = {
  env: {
    name: 'serverless-cd',
    age: 30,
  },
  steps: [
    {
      run: "echo 'Hi {{ env.name }}'",
    },
    {
      run: "echo 'Hi {{ env.name }}'",
      env: {
        name: 'Tony',
      },
    },
    {
      run: "echo 'Hi {{ task.id }}'",
    },
    {
      run: "echo 'Hi {{ git.event_name }}'",
    },
    {
      run: "echo 'suceess end'",
    },
  ],
};

export const SERVERLESS_PIPELINE_CONTENT_TEMPLATE = {
  name: 'Deploy Express application to FC',
  steps: [
    {
      name: '缓存 npm 依赖包',
      plugin: '@serverless-cd/cache',
      id: 'npmCache',
      inputs: {
        key: "${{hashFile('./code/package.json')}}",
        path: './code/node_modules',
      },
    },
    {
      run: 'npm i @serverless-devs/s -g --registry=https://registry.npmmirror.com',
    },
    {
      run: 's -v',
    },
    {
      name: '安装代码包依赖',
      run: 'npm install --production --registry=https://registry.npmmirror.com',
      'working-directory': './code',
      if: "${{steps.npmCache.outputs['cache-hit'] != true}} ",
    },
    {
      name: '部署函数',
      run: 's deploy --use-local -y -a default_serverless_devs_access',
      env: {
        default_serverless_devs_access:
          '{"AccountID":"${{cloudSecrets.AccountID}}","AccessKeyID":"${{cloudSecrets.AccessKeyID}}","AccessKeySecret":"${{cloudSecrets.AccessKeySecret}}"}',
      },
    },
    {
      run: 's deploy --use-local -y',
    },
  ],
};

export const TEMPLATE_TABS = [
  {
    key: 'devs',
    name: 'Serverless-Devs模版',
    templateList: [],
  },
  {
    key: 'other',
    name: '其他模版',
    templateList: [],
  },
];
