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
      run: 'npm i @serverless-devs/s -g --registry=https://registry.npmmirror.com',
    },
    {
      run: 's -v',
    },
    {
      run: 'echo ${{secrets.ALIYUN_ACCOUNTID}}',
    },
    {
      run: 'echo ${{secrets.ALIYUN_AK}}',
    },
    {
      run: 'echo ${{secrets.ALIYUN_SK}}',
    },
    {
      run: 's config add --AccountID ${{secrets.ALIYUN_ACCOUNTID}}  --AccessKeyID ${{secrets.ALIYUN_AK}}  --AccessKeySecret ${{secrets.ALIYUN_SK}} -a default -f',
    },
    {
      run: 's deploy --use-local -y',
    },
  ],
};
export const SERVERLESS_DEVS_LIST = [
  {
    title: 'Egg.js',
    package: 'start-egg',
    description: '为企业级框架和应用而生（部署到Custom运行时）',
    download: 643,
    logo: 'https://example-static.oss-cn-beijing.aliyuncs.com/serverless-app-store/Egg.js.png',
    demo: '',
    tags: ['Egg', 'Web框架', 'Custom Runtime'],
    url: 'https://github.com/devsapp/start-web-framework/blob/master/web-framework/nodejs/egg/src',
    user: 1,
  },
  {
    title: 'Express.js',
    package: 'start-express',
    description: '基于 Node.js 平台，快速、开放、极简的 Web 开发框架（部署到Custom运行时）',
    download: 17241,
    logo: 'https://example-static.oss-cn-beijing.aliyuncs.com/serverless-app-store/express.png',
    demo: '',
    tags: ['Web框架', 'Express.js', 'Custom Runtime'],
    url: 'https://github.com/devsapp/start-web-framework/tree/master/web-framework/nodejs/express/src',
    user: 1,
  },
  {
    title: 'Docusaurus',
    package: 'website-docusaurus',
    description: '部署Docusaurus 文档系统到函数计算',
    download: 384,
    logo: 'https://example-static.oss-cn-beijing.aliyuncs.com/serverless-app-store/Docusaurus.png',
    demo: '',
    tags: ['静态网站', 'jamstack'],
    url: 'https://github.com/devsapp/start-website/tree/master/website-docusaurus/src',
    user: 1,
  },
  {
    title: 'Koa.js',
    package: 'start-koa',
    description:
      'Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石（部署到Custom运行时）',
    download: 767,
    logo: 'https://example-static.oss-cn-beijing.aliyuncs.com/serverless-app-store/Koa.png',
    demo: '',
    tags: ['Web框架', 'Koa.js', 'Custom Runtime'],
    url: 'https://github.com/devsapp/start-web-framework/blob/master/web-framework/nodejs/koa/src',
    user: 1,
  },
  {
    title: 'Django',
    package: 'start-django',
    description:
      'Django是一个开放源代码的Web应用框架，由Python写成。采用了MTV的框架模式，即模型M，视图V和模版T',
    download: 17900,
    logo: 'https://example-static.oss-cn-beijing.aliyuncs.com/serverless-app-store/django.png',
    demo: '',
    tags: ['Web框架', 'Django'],
    url: 'https://github.com/devsapp/start-web-framework/tree/master/web-framework/python/django/src',
    user: 1,
  },
];

export const TEMPLATE_TABS = [
  {
    key: 'devs',
    name: 'Serverless-Devs模版',
    templateList: SERVERLESS_DEVS_LIST,
  },
  {
    key: 'other',
    name: '其他模版',
    templateList: [],
  },
  {
    key: 'collection',
    name: '收藏模版',
    templateList: [],
  },
];
