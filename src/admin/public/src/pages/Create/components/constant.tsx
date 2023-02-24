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
      run: "echo 'Hi {{ task_id }}'",
    },
    {
      run: "echo 'Hi {{ git.event_name }}'",
    },
    {
      run: "echo 'suceess end'",
    },
  ],
};
