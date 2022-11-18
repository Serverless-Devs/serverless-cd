import { createStore, IStoreModels, IStoreDispatch, IStoreRootState } from 'ice';
import user from './models/user';
import login from './models/login';

interface IAppStoreModels extends IStoreModels {
  user: typeof user;
  login: typeof login;
}

const appModels: IAppStoreModels = {
  user,
  login
};

const store = createStore(appModels);

export default store;

export type IRootDispatch = IStoreDispatch<typeof appModels>;
export type IRootState = IStoreRootState<typeof appModels>;
