import React from 'react';
import { Link } from 'ice';
import { get } from 'lodash';
import BasicInfo from '@/components/BasicInfo';
import Status from '@/components/DeployStatus';
import RefreshButton from '@/components/RefreshButton';
import { formatTime } from '@/utils';
import EnvType from '@/components/EnvType';

interface Props {
  data: object;
  refreshCallback: Function;
  envName: string;
}

const BasicInfoDetail = (props: Props) => {
  const { data, refreshCallback, envName } = props;
  const envInfo = get(data, `environment.${envName}`);
  const type = get(envInfo, 'type', '_');
  const created_time = formatTime(get(envInfo, 'created_time'));
  const status = get(data, 'latest_task.status', 'init');
  const taskId = get(data, 'latest_task.taskId');
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
                  <Link className="ml-8" to={`/application/${appId}/detail/${taskId}`}>
                    查看
                  </Link>
                )}
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
