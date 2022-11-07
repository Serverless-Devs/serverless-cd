import { IRootDispatch } from '@/store';
import { getSupportLoginTypes } from '@/services/auth';

// https://ice.work/docs/guide/basic/store
export default {
  // 定义 model 的初始 state
  state: {
    name: 'login',
    supportLoginTypes: {} as any // 支持登录类型
  },

  // 定义改变该模型状态的纯函数
  reducers: {
    update(prevState, payload) {
      return {
        ...prevState,
        ...payload,
      };
    },
  },
  // 定义处理该模型副作用的函数
  effects: (dispatch: IRootDispatch) => ({
    async getModelsSupportLoginTypes() {
      const result = await getSupportLoginTypes();
      dispatch.login.update({
        supportLoginTypes: result.data
      });
    }
  }),
};
