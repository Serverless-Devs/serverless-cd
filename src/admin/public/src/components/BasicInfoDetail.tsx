import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import BasicInfo from '@/components/BasicInfo';
import ExternalLink from '@/components/ExternalLink';
import CommitId from '@/components/CommitId';
import { C_REPOSITORY } from '@/constants/repository';
import RefreshButton from '@/pages/AppDetail/components/RefreshButton';
interface Props {
  data: object;
  refreshCallback: Function;
}

const BasicInfoDetail = (props: Props) => {
  const { data, refreshCallback } = props;

  const description = get(data, 'description', '_');
  const created_time = moment(get(data, 'created_time')).format('YYYY-MM-DD HH:mm:ss');
  const provider = get(data, 'provider');
  const repo_url = get(data, 'repo_url');
  const repo_name = get(data, 'repo_name');
  const owner = get(data, 'owner');
  const commit = get(data, 'latest_task.commit');
  return (
    <BasicInfo
      title={'基本信息'}
      content={<RefreshButton refreshCallback={refreshCallback} />}
      items={
        [
          {
            text: '仓库名称',
            value: (
              <div>
                <span className="fz-12">{owner}</span>
                <span className="fz-14 f-w-500"> / {repo_name}</span>
              </div>
            ),
          },
          {
            text: '描述',
            value: description,
          },
          {
            text: '创建时间',
            value: created_time,
          },
          {
            text: '代码源',
            value: (
              <div className="align-center">
                {C_REPOSITORY[provider as any]?.svg(16)}
                <ExternalLink
                  className="color-link cursor-pointer ml-4"
                  url={repo_url}
                  label={repo_name}
                />
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
                  label={get(data, 'latest_task.commit', '')}
                  message={get(data, 'latest_task.message')}
                  icon={false}
                />
              </div>
            ),
          },
          // {
          //   text: '分支',
          //   value: (
          //     <div className="align-center">
          //       {C_REPOSITORY['github']?.svg(16)}
          //       <ExternalLink
          //         className="color-link cursor-pointer ml-4"
          //         url={`https://${provider}.com/${owner}/${repo_name}/tree/`}
          //         // url={'https://github.com/heimanba/todolist-app-msfg/tree/master'}
          //         label={'master'}
          //       />
          //     </div>
          //   ),
          // },
          // on && {
          //   text: '触发方式',
          //   value: trigger[on],
          // },
        ].filter(Boolean) as any
      }
      sizePerRow={2}
    />
  );
};

export default BasicInfoDetail;
