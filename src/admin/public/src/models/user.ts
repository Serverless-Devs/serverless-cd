import { IRootDispatch } from '@/store';
import { userInfo } from '@/services/user';
import { githubRepos } from '@/services/git';
// https://ice.work/docs/guide/basic/store
export default {
  // 定义 model 的初始 state
  state: {
    name: 'user',
    userInfo: {}, // 用户信息
    userRepos: [], // 用户仓库
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
    async getUserInfo() {
      const result = await userInfo();
      dispatch.user.update({
        userInfo: result,
      });
      return result;
    },
    async getUserRepos() {
      const { data = [] } = await githubRepos();
      dispatch.user.update({
        userRepos: data,
      });
      return data;
    },
    async removeStateInfo() {
      dispatch.user.update({
        userRepos: [],
        userInfo: {},
      });
    },
  }),
};
