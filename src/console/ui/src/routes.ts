import { IRouterConfig, lazy } from "ice";
import { BasicLayout } from "@/layouts/BasicLayout";
import { LoginLayout } from "@/layouts/LoginLayout";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const Create = lazy(() => import("@/pages/Create"));
const Details = lazy(() => import("@/pages/Details"));
const TaskDetails = lazy(() => import("@/pages/TaskDetails"));
const Auth = lazy(() => import("@/pages/Auth"));
const Tokens = lazy(() => import("@/pages/Tokens"));
const Secrets = lazy(() => import("@/pages/Secrets"));

const routerConfig: IRouterConfig[] = [
  {
    path: "/login",
    component: LoginLayout,
    children: [
      {
        path: "/",
        exact: true,
        component: Login,
      },
    ],
  },
  {
    path: "/signUp",
    component: LoginLayout,
    children: [
      {
        path: "/",
        exact: true,
        component: Signup,
      },
    ],
  },
  {
    path: "/auth",
    component: LoginLayout,
    children: [
      {
        path: "/:provider/callback",
        exact: true,
        component: Auth,
      },
    ],
  },
  {
    path: "/settings",
    component: BasicLayout,
    children: [
      {
        path: "/tokens",
        exact: true,
        component: Tokens,
      },
      {
        path: "/secrets",
        exact: true,
        component: Secrets
      },
    ],
  },
  {
    path: "/application/:appId",
    component: BasicLayout,
    children: [
      {
        path: "/detail",
        exact: true,
        component: Details,
      },
      {
        path: "/detail/:taskId",
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
    path: "/",
    component: BasicLayout,
    children: [
      {
        path: "/application",
        exact: true,
        component: Dashboard,
      },
      {
        path: "/create",
        exact: true,
        component: Create,
      },
      {
        path: '/',
        // 重定向
        redirect: '/application',
      },
    ],
  }
];
export default routerConfig;
