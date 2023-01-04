import { IRouterConfig, lazy } from 'ice';
import { BasicLayout } from '@/layouts/BasicLayout';
import { LoginLayout } from '@/layouts/LoginLayout';

// import AppList from '@/pages/AppList';
// import Login from '@/pages/Login';
// import Signup from '@/pages/Signup';
// import Create from '@/pages/Create';
// import Details from '@/pages/Details';
// import TaskDetails from '@/pages/TaskDetails';
// import Auth from '@/pages/Auth';
// import Tokens from '@/pages/Tokens';
// import Secrets from '@/pages/Secrets';

const AppList = lazy(() => import(/* webpackChunkName: 'user-login' */ '@/pages/AppList'));
const Login = lazy(() => import(/* webpackChunkName: 'Login' */ '@/pages/Login'));
const Signup = lazy(() => import(/* webpackChunkName: 'Signup' */ '@/pages/Signup'));
const Create = lazy(() => import(/* webpackChunkName: 'Create' */ '@/pages/Create'));
const Details = lazy(() => import(/* webpackChunkName: 'Details' */ '@/pages/AppDetail'));
const TaskDetails = lazy(() => import(/* webpackChunkName: 'TaskDetails' */ '@/pages/TaskDetails'));
const Auth = lazy(() => import(/* webpackChunkName: 'Auth' */ '@/pages/Auth'));
const Tokens = lazy(() => import(/* webpackChunkName: 'Tokens' */ '@/pages/Tokens'));
const Secrets = lazy(() => import(/* webpackChunkName: 'Secrets' */ '@/pages/Secrets'));

const routerConfig: IRouterConfig[] = [
  {
    path: '/login',
    component: LoginLayout,
    children: [
      {
        path: '/',
        exact: true,
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
    path: '/settings',
    component: BasicLayout,
    children: [
      {
        path: '/tokens',
        exact: true,
        component: Tokens,
      },
      {
        path: '/secrets',
        exact: true,
        component: Secrets,
      },
    ],
  },
  {
    path: '/application/:appId',
    component: BasicLayout,
    children: [
      {
        path: '/detail',
        exact: true,
        component: Details,
      },
      {
        path: '/detail/:taskId',
        exact: true,
        component: TaskDetails,
      },
      {
        path: '/application/:appId',
        // 重定向
        redirect: '/application',
      },
    ],
  },
  {
    path: '/',
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
        path: '/',
        // 重定向
        redirect: '/application',
      },
    ],
  },
];
export default routerConfig;
