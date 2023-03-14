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
    // {
    //   run: 's deploy --use-local -y',
    // },
  ],
};
export const SERVERLESS_DEVS_LIST = [
  {
    title: 'Egg.js',
    package: 'start-egg',
    description: '为企业级框架和应用而生（部署到Custom运行时）',
    version: {
      tag_name: '1.2.24',
      name: 'Release 1.2.24',
      created_at: '2023-01-31T09:23:57.086348+00:00',
      published_at: '2023-01-31T09:23:59.604715+00:00',
      zipball_url: 'https://registry.devsapp.cn/simple/start-egg/zipball/1.2.24',
      body: '- 更新帮助文档\n- 发布全新Web-framework解决方案',
    },
    download: 643,
    logo: 'https://example-static.oss-cn-beijing.aliyuncs.com/serverless-app-store/Egg.js.png',
    demo: '',
    collection: 0,
    tags: ['Egg', 'Web框架', 'Custom Runtime'],
    tabs: [4],
    url: 'https://github.com/devsapp/start-web-framework/blob/master/web-framework/nodejs/egg/src',
    user: 1,
  },
  {
    title: 'Express.js',
    package: 'start-express',
    description: '基于 Node.js 平台，快速、开放、极简的 Web 开发框架（部署到Custom运行时）',
    version: {
      tag_name: '1.2.22',
      name: 'Release 1.2.22',
      created_at: '2023-01-30T09:48:44.066555+00:00',
      published_at: '2023-01-30T09:48:46.768832+00:00',
      zipball_url: 'https://registry.devsapp.cn/simple/start-express/zipball/1.2.22',
      body: '- 更新帮助文档\n- 发布全新Web-framework解决方案',
    },
    download: 17241,
    logo: 'https://example-static.oss-cn-beijing.aliyuncs.com/serverless-app-store/express.png',
    demo: '',
    collection: 0,
    tags: ['Web框架', 'Express.js', 'Custom Runtime'],
    tabs: [1, 4],
    url: 'https://github.com/devsapp/start-web-framework/tree/master/web-framework/nodejs/express/src',
    user: 1,
  },
  {
    title: 'Docusaurus',
    package: 'website-docusaurus',
    description: '部署Docusaurus 文档系统到函数计算',
    version: {
      tag_name: '0.1.10',
      name: 'Release 0.1.10',
      created_at: '2022-07-28T07:05:49.476064+00:00',
      published_at: '2022-07-28T07:05:50.990967+00:00',
      zipball_url: 'https://registry.devsapp.cn/simple/website-docusaurus/zipball/0.1.10',
      body: '- 更新帮助文档\n- 发布全新静态网站解决方案',
    },
    download: 384,
    logo: 'https://example-static.oss-cn-beijing.aliyuncs.com/serverless-app-store/Docusaurus.png',
    demo: '',
    collection: 0,
    tags: ['静态网站', 'jamstack'],
    tabs: [4],
    url: 'https://github.com/devsapp/start-website/tree/master/website-docusaurus/src',
    user: 1,
  },
  {
    title: 'Koa.js',
    package: 'start-koa',
    description:
      'Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石（部署到Custom运行时）',
    version: {
      tag_name: '1.2.25',
      name: 'Release 1.2.25',
      created_at: '2023-02-15T07:36:44.885131+00:00',
      published_at: '2023-02-15T07:36:47.599864+00:00',
      zipball_url: 'https://registry.devsapp.cn/simple/start-koa/zipball/1.2.25',
      body: '- 更新帮助文档\n- 发布全新Web-framework解决方案',
    },
    download: 767,
    logo: 'https://example-static.oss-cn-beijing.aliyuncs.com/serverless-app-store/Koa.png',
    demo: '',
    collection: 0,
    tags: ['Web框架', 'Koa.js', 'Custom Runtime'],
    tabs: [4],
    url: 'https://github.com/devsapp/start-web-framework/blob/master/web-framework/nodejs/koa/src',
    user: 1,
  },
  {
    title: 'Django',
    package: 'start-django',
    description:
      'Django是一个开放源代码的Web应用框架，由Python写成。采用了MTV的框架模式，即模型M，视图V和模版T',
    version: {
      tag_name: '1.2.15',
      name: 'Release 1.2.15',
      created_at: '2022-07-29T15:16:59.057708+00:00',
      published_at: '2022-07-29T15:16:59.875738+00:00',
      zipball_url: 'https://registry.devsapp.cn/simple/start-django/zipball/1.2.15',
      body: '- 更新帮助文档\n- 发布全新Web-framework解决方案',
    },
    download: 17900,
    logo: 'https://example-static.oss-cn-beijing.aliyuncs.com/serverless-app-store/django.png',
    demo: '',
    collection: 0,
    tags: ['Web框架', 'Django'],
    tabs: [1, 4],
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
