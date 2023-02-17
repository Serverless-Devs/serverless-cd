export const FORM_ITEM_LAYOUT = {
  labelCol: {
    fixedSpan: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

export interface IUrlParams {
  productName: string;
}

export enum DEPLOY {
  INIT = 'init',
  SUCCESS = 'success',
  PENDING = 'pending',
  FAILURE = 'failure',
  SKIP = 'skipped',
  CANCEL = 'cancelled',
  RUNNING = 'running',
}

export const DEPLOY_STATUS = {
  [DEPLOY.INIT]: {
    // icon: 'loading',
    label: '暂未部署',
  },
  [DEPLOY.PENDING]: {
    icon: 'clock1',
    color: 'color-warning',
    label: '等待部署',
  },
  [DEPLOY.SUCCESS]: {
    icon: 'success-filling',
    color: 'color-success',
    label: '部署成功',
  },
  [DEPLOY.FAILURE]: {
    icon: 'error',
    color: 'color-error',
    label: '部署失败',
  },
  [DEPLOY.CANCEL]: {
    icon: 'prompt',
    color: 'color-gray',
    label: '已取消部署',
  },
  [DEPLOY.SKIP]: {
    icon: 'minus-circle-fill',
    label: '跳过部署',
  },
  [DEPLOY.RUNNING]: {
    icon: 'loading',
    label: '部署中',
  },
};

export const pollingStatus = ['pending', 'running'];

export enum ROLE {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}
