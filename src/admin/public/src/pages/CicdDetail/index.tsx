import React from 'react';
import TaskList from '@/components/TaskList';
import ShowBranch from '@/components/ShowBranch';
import PageInfo from '@/components/PageInfo';
import { get } from 'lodash';
import SecretConfig from '../EnvDetail/components/SecretCofing';
import TriggerConfig from '../EnvDetail/components/TriggerConfig';
import BasicInfo from '@/components/BasicInfo';
import { strictValuesParse } from '@serverless-cd/trigger-ui';
import { filterTriggerInfo } from '@/utils/trigger';
import withEnvDetails from '@/components/WithEnvDetails';


const Details = (props) => {
  const { detailInfo, handleRefresh, appId, envName, orgName } = props;
  const data = get(detailInfo, 'data', {});
  const provider = get(detailInfo, 'data.provider');
  const trigger_spec = get(detailInfo, `data.environment.${envName}.trigger_spec`, {});
  const taskId = get(detailInfo, `data.environment.${envName}.latest_task.taskId`, '');
  const secrets = get(detailInfo, `data.environment.${envName}.secrets`, {});
  const triggerInfo = strictValuesParse(filterTriggerInfo(get(trigger_spec, provider, {})));
  const triggerType = triggerInfo['triggerType'];
  const triggerRef = triggerType === 'pull_request' ? get(triggerInfo, `${triggerType}Target`) : get(triggerInfo, `${triggerType}Value`);
  const repoOwner = get(data, 'repo_owner', '');
  const repoName = get(data, 'repo_name', '');

  return (
    <>
      <TriggerConfig
        data={get(detailInfo, 'data', {})}
        triggerSpec={trigger_spec}
        provider={provider}
        appId={appId}
        refreshCallback={handleRefresh}
        envName={envName}
      />
      <BasicInfo
        items={[
          {
            text: '触发类型',
            value: triggerType,
          },
          {
            text: '触发分支',
            value: (
              <>
                {triggerRef ? (
                  <ShowBranch
                    threshold={50}
                    url={`https://${provider}.com/${repoOwner}/${repoName}/tree/${triggerRef}`}
                    label={triggerRef}
                  />
                ) : (
                  '-'
                )}
              </>
            ),
          },
          {
            text: '目标分支',
            value: get(triggerInfo, `pull_requestSource`, '-'),
            hidden: triggerType !== 'pull_request'
          },
          {
            text: '指定yaml',
            value: get(detailInfo, `data.environment.${envName}.cd_pipeline_yaml`),
          },
        ]}
        sizePerRow={2}
      />
      <hr className="mb-20" />
      <SecretConfig
        data={get(detailInfo, 'data', {})}
        secrets={secrets}
        provider={provider}
        appId={appId}
        refreshCallback={handleRefresh}
        envName={envName}
      />
      <div className="mb-20 mt-20" />
      <PageInfo title="部署历史">
        <TaskList
          appId={appId}
          latestTaskId={taskId}
          envName={envName}
          orgName={orgName}
          repoOwner={repoOwner}
          repoName={repoName}
          triggerTypes={['console', 'webhook']}
        />
      </PageInfo>
    </>
  );
};

const CiCdDetailPage = withEnvDetails(Details, { pageType: 'cicd' });

export default CiCdDetailPage;
