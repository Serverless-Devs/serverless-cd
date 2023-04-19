import React from 'react';
import { Link } from 'ice';
import { get, startsWith } from 'lodash';
import BasicInfo from '@/components/BasicInfo';
import Status from '@/components/DeployStatus';
import RefreshButton from '@/components/RefreshButton';
import CommitId from '@/components/CommitId';
import { formatTime } from '@/utils';
import EnvType from '@/components/EnvType';
import { C_REPOSITORY } from '@/constants/repository';
import CodeSource from '@/components/CodeSource';
import TaskList from '@/components/TaskList';
import CloudUserPanel from './CloudUserPanel'

interface Props {
  data: object;
  refreshCallback: Function;
  envName: string;
  orgName: string;
}

const BasicInfoDetail = (props: Props) => {
  const { data, refreshCallback, envName, orgName } = props;
  const provider = get(data, 'provider', '');
  const envInfo = get(data, `environment.${envName}`);
  const cloudAlias = get(envInfo, 'cloud_alias');
  const repo_name = get(data, 'repo_name', '');
  const repo_owner = get(data, 'repo_owner');
  const repo_url = get(data, 'repo_url');
  const name = get(data, 'name', '-');
  const type = get(envInfo, 'type', '_');
  const created_time = formatTime(get(envInfo, 'created_time'));
  const update_time = formatTime(get(envInfo, 'update_time', created_time));
  const latest_task = get(data, `environment.${envName}.latest_task`, {});
  const status = get(latest_task, 'status', 'init');
  const taskId = get(latest_task, 'taskId');
  const commit = get(latest_task, 'commit');
  const triggerType = get(latest_task, 'trigger_type');
  const appId = get(data, 'id', '');

  return (
    <>
      <BasicInfo
        title={'基本信息'}
        content={<RefreshButton refreshCallback={refreshCallback} />}
        items={
          [
            {
              text: '应用名称',
              value: name,
            },
            {
              text: '环境名称',
              value: <span className='flex-r flex-start'><span className='mr-8'>{envName}</span><EnvType type={type} /></span>,
            },
            {
              text: '创建时间',
              value: created_time,
            },
            {
              text: '最后操作时间',
              value: update_time,
            },
            {
              text: '部署状态',
              value: (
                <div className="flex-r" style={{ justifyContent: 'flex-start' }}>
                  <Status status={status as any} />
                  {taskId && !startsWith(triggerType, 'tracker:') && (
                    <Link
                      className="ml-8"
                      to={`/${orgName}/application/${appId}/${envName}/${taskId}`}
                    >
                      查看
                    </Link>
                  )}
                </div>
              ),
            },
            {
              text: '关联云账号',
              value: (
                <div>
                  {cloudAlias || '--'}
                  <CloudUserPanel refreshCallback={refreshCallback} detailData={data} envName={envName} link={`/${orgName}/setting/cloud`} currentCloud={cloudAlias} />
                </div>
              )
            },
            repo_url && {
              text: '仓库地址',
              value: <CodeSource provider={provider} repo_url={repo_url} repo_name={repo_name} />,
            },
            commit && {
              text: 'Commit',
              value: (
                <div className="align-center">
                  {C_REPOSITORY[provider as any]?.svg(16)}
                  <CommitId
                    className="ml-4"
                    url={`https://${provider}.com/${repo_owner}/${repo_name}/commit/${commit}`}
                    label={get(latest_task, 'commit', '')}
                    message={get(latest_task, 'message')}
                    icon={false}
                  />
                </div>
              ),
            },
          ].filter(Boolean) as any
        }
        sizePerRow={2}
      />
      <div className="box-hd  mt-16">
        <h3>部署历史</h3>
      </div>
      <TaskList
        appId={appId as string}
        latestTaskId={taskId}
        envName={envName}
        orgName={orgName}
        repoOwner={get(data, 'repo_owner')}
        repoName={get(data, 'repo_name')}
        triggerTypes={['console', 'webhook', 'local']}
      />
    </>
  );
};

export default BasicInfoDetail;
