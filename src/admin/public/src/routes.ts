import { IRouterConfig, lazy } from 'ice';
import { BasicLayout } from '@/layouts/BasicLayout';
import { LoginLayout } from '@/layouts/LoginLayout';

// import AppList from '@/pages/AppList';
// import Login from '@/pages/Login';
// import Signup from '@/pages/Signup';
// import Create from '@/pages/Create';
// import AppDetail from '@/pages/AppDetail';
// import TaskDetails from '@/pages/TaskDetails';
// import Auth from '@/pages/Auth';
// import Tokens from '@/pages/Tokens';
// import Secrets from '@/pages/Secrets';

const AppList = lazy(() => import(/* webpackChunkName: 'user-login' */ '@/pages/AppList'));
const Login = lazy(() => import(/* webpackChunkName: 'Login' */ '@/pages/Login'));
const Signup = lazy(() => import(/* webpackChunkName: 'Signup' */ '@/pages/Signup'));
const Create = lazy(() => import(/* webpackChunkName: 'Create' */ '@/pages/Create'));
const EnvDetail = lazy(() => import(/* webpackChunkName: 'AppDetail' */ '@/pages/EnvDetail'));
const TaskDetails = lazy(() => import(/* webpackChunkName: 'TaskDetails' */ '@/pages/TaskDetails'));
const Auth = lazy(() => import(/* webpackChunkName: 'Auth' */ '@/pages/Auth'));
const UserSettings = lazy(() => import(/* webpackChunkName: 'Secrets' */ '@/pages/UserSettings'));
const OrgSettings = lazy(() => import(/* webpackChunkName: 'Secrets' */ '@/pages/OrgSettings'));
const NoAuth = lazy(() => import(/* webpackChunkName: 'NotAuth' */ '@/pages/NoAuth'));

const routerConfig: IRouterConfig[] = [
  {
    path: '/noAuth',
    component: LoginLayout,
    children: [
      {
        path: '/',
        exact: true,
        component: NoAuth,
      },
    ],
  },
  {
    path: '/login',
    component: LoginLayout,
    children: [
      {
        path: '/',
        exact: false,
        component: Login,
      },
    ],
  },
  {
    path: '/signUp',
    component: LoginLayout,
    children: [
      {
        path: '/',
        exact: true,
        component: Signup,
      },
    ],
  },
  {
    path: '/auth',
    component: LoginLayout,
    children: [
      {
        path: '/:provider/callback',
        exact: true,
        component: Auth,
      },
    ],
  },
  {
    path: '/:orgName/application/:appId',
    component: BasicLayout,
    children: [
      {
        path: '/:envName',
        exact: true,
        component: EnvDetail,
      },
      {
        path: '/:envName/:taskId',
        exact: true,
        component: TaskDetails,
      },
    ],
  },
  {
    path: '/organizations',
    component: BasicLayout,
    children: [
      {
        path: '/',
        exact: true,
        component: UserSettings,
      },
    ],
  },
  {
    path: '/:orgName',
    component: BasicLayout,
    children: [
      {
        path: '/application',
        exact: true,
        component: AppList,
      },
      {
        path: '/create',
        exact: true,
        component: Create,
      },
      {
        path: '/settings',
        exact: true,
        component: OrgSettings,
      },
      {
        path: '/',
        // 重定向
        redirect: '/:orgName/application',
      },
    ],
  },
  {
    path: '/',
    exact: true,
    component: AppList,
  },
];
export default routerConfig;
