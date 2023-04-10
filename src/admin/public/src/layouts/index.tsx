import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import BasicLayout from '@/layouts/BasicLayout';
import store from '@/store';
import { get, isEmpty } from 'lodash';
import { getOrgName, localStorageSet } from '@/utils';

const AppList = React.lazy(() => import(/* webpackChunkName: 'user-login1' */ '@/pages/AppList') as any);
const Login = React.lazy(() => import(/* webpackChunkName: 'Login' */ '@/pages/Login'));
const Signup = React.lazy(() => import(/* webpackChunkName: 'Signup' */ '@/pages/Signup'));
const Create = React.lazy(() => import(/* webpackChunkName: 'Create' */ '@/pages/Create'));
const EnvDetail = React.lazy(() => import(/* webpackChunkName: 'AppDetail' */ '@/pages/EnvDetail'));
const CicdDetail = React.lazy(() => import(/* webpackChunkName: 'AppDetail' */ '@/pages/CicdDetail'));
const OperationDetail = React.lazy(() => import(/* webpackChunkName: 'AppDetail' */ '@/pages/OperationDetail'));
const TaskDetails = React.lazy(() => import(/* webpackChunkName: 'TaskDetails' */ '@/pages/TaskDetails'));
const Auth = React.lazy(() => import(/* webpackChunkName: 'Auth' */ '@/pages/Auth'));
const OrgSettings = React.lazy(() => import(/* webpackChunkName: 'OrgSettings' */ '@/pages/OrgSettings'));
const Members = React.lazy(() => import(/* webpackChunkName: 'Members' */ '@/pages/Members'));
const Secrets = React.lazy(() => import(/* webpackChunkName: 'Secrets' */ '@/pages/Secrets'));
const Bind = React.lazy(() => import(/* webpackChunkName: 'Secrets' */ '@/pages/Bind'));
const NoAuth = React.lazy(() => import(/* webpackChunkName: 'NotAuth' */ '@/pages/NoAuth'));
const Team = React.lazy(() => import(/* webpackChunkName: 'Team' */ '@/pages/Team'));
const CreateOrg = React.lazy(() => import(/* webpackChunkName: 'CreateOrg' */ '@/pages/CreateOrg'));
const UpdateOrg = React.lazy(() => import(/* webpackChunkName: 'CreateOrg' */ '@/pages/UpdateOrg'));

const OrgVerify = ({
  history,
  match: {
    params: { orgName },
  } }
) => {
  const [userState] = store.useModel('user');
  const userInfo: any = get(userState, 'userInfo', {});
  /**
   * 未请求到用户信息时，不渲染页面
   */
  if (isEmpty(userInfo)) return null;
  if (isEmpty(orgName)) {
    const newOrgName = getOrgName();
    if (newOrgName) {
      return history?.push(`/${newOrgName}/application`);
    }
    localStorageSet(userInfo.id, userInfo.username);
    return history?.push(`/${userInfo.username}/application`);
  }

  return null;
}

const App = (props) => {
  return (
    <BasicLayout {...props} >
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path={'/noAuth'} exact component={NoAuth} />
          <Route path={'/login'} exact component={Login} />
          <Route path={'/signUp'} exact component={Signup} />
          <Route path={'/auth'} exact component={Auth} />
          <Route path={'/organizations/create'} exact component={CreateOrg} />
          <Route path={'/organizations'} exact component={OrgSettings} />
          <Route path={'/:orgName/application/:appId/:envName/overview'} exact component={EnvDetail} />
          <Route path={'/:orgName/application/:appId/:envName/cicd'} exact component={CicdDetail} />
          <Route path={'/:orgName/application/:appId/:envName/operation'} exact component={OperationDetail} />
          <Route path={'/:orgName/application/:appId/:envName/:taskId'} exact component={TaskDetails} />
          <Route path={'/:orgName/application'} exact component={AppList} />
          <Route path={'/:orgName/create'} component={Create} />
          <Route path={'/:orgName/setting/members'} exact component={Members} />
          <Route path={'/:orgName/setting/secrets'} exact component={Secrets} />
          <Route path={'/:orgName/setting/bind'} exact component={Bind} />
          <Route path={'/:orgName/setting/org'} exact component={UpdateOrg} />
          <Route path={'/:orgName/team'} exact component={Team} />
          <Route path={'/:orgName/profile/organizations'} exact component={OrgSettings} />
          <Route path={'/:orgName/profile/account_information'} exact component={Team} />
          <Route path={'/'} component={OrgVerify} />
        </Switch>
      </Suspense>
    </BasicLayout>
  );
}


export default App