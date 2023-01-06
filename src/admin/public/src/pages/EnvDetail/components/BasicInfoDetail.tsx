import React from 'react';
import { Link } from 'ice';
import { get } from 'lodash';
import BasicInfo from '@/components/BasicInfo';
import Status from '@/components/DeployStatus';
import RefreshButton from '@/components/RefreshButton';
import CommitId from '@/components/CommitId';
import { formatTime } from '@/utils';
import EnvType from '@/components/EnvType';
import { C_REPOSITORY } from '@/constants/repository';

interface Props {
  data: object;
  refreshCallback: Function;
  envName: string;
}

const BasicInfoDetail = (props: Props) => {
  const { data, refreshCallback, envName } = props;
  const provider = get(data, 'provider');
  const envInfo = get(data, `environment.${envName}`);
  const repo_name = get(data, 'repo_name');
  const owner = get(data, 'owner');
  const type = get(envInfo, 'type', '_');
  const created_time = formatTime(get(envInfo, 'created_time'));
  const latest_task = get(data, `environment.${envName}.latest_task`, {});
  const status = get(latest_task, 'status', 'init');
  const taskId = get(latest_task, 'taskId');
  const commit = get(latest_task, 'commit');

  const appId = get(data, 'id');
  return (
    <BasicInfo
      title={'基本信息'}
      content={<RefreshButton refreshCallback={refreshCallback} />}
      items={
        [
          {
            text: '环境名称',
            value: envName,
          },

          {
            text: '环境类型',
            value: <EnvType type={type} />,
          },
          {
            text: '创建时间',
            value: created_time,
          },
          {
            text: '部署状态',
            value: (
              <div className="flex-r" style={{ justifyContent: 'flex-start' }}>
                <Status status={status as any} />
                {taskId && (
                  <Link className="ml-8" to={`/application/${appId}/detail/${envName}/${taskId}`}>
                    查看
                  </Link>
                )}
              </div>
            ),
          },
          commit && {
            text: 'Commit',
            value: (
              <div className="align-center">
                {C_REPOSITORY[provider as any]?.svg(16)}
                <CommitId
                  className="ml-4"
                  url={`https://${provider}.com/${owner}/${repo_name}/commit/${commit}`}
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
  );
};

export default BasicInfoDetail;
