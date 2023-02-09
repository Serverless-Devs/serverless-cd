import { createStore, IStoreModels, IStoreDispatch, IStoreRootState } from 'ice';
import user from './models/user';

interface IAppStoreModels extends IStoreModels {
  user: typeof user;
}

const appModels: IAppStoreModels = {
  user,
};

const store = createStore(appModels);

export default store;

export type IRootDispatch = IStoreDispatch<typeof appModels>;
export type IRootState = IStoreRootState<typeof appModels>;
