import React, { FC } from 'react';
import { Link, useRequest } from 'ice';
import { removeEnv } from '@/services/applist';
import { Button, Table, Dialog } from '@alicloud/console-components';
import EnvType from '@/components/EnvType';
import Status from '@/components/DeployStatus';
import CommitId from '@/components/CommitId';
import { C_REPOSITORY } from '@/constants/repository';
import { Toast } from '@/components/ToastContainer';
import { formatTime } from '@/utils';
import { get, noop, isEmpty } from 'lodash';

type Props = {
  orgName: string;
  appId: string;
  data: any;
  refresh?: () => Promise<any>;
};

const EnvList: FC<Props> = (props) => {
  const { data, appId, refresh = noop, orgName } = props;
  const { loading, request } = useRequest(removeEnv);
  const getEnvData = () => {
    const list: any = [];
    const environment = get(data, 'environment', {});
    for (const key in environment) {
      const ele = environment[key];
      list.push({
        name: key,
        type: get(ele, 'type'),
        created_time: get(ele, 'created_time') || get(data, 'created_time'),
        status: get(ele, 'latest_task.status', 'init'),
        envName: key,
        trigger_info: {
          commit: get(ele, 'latest_task.commit', ''),
          message: get(ele, 'latest_task.message', ''),
          provider: get(data, 'provider'),
          owner: get(data, 'owner'),
          repo_name: get(data, 'repo_name'),
          trigger_type: get(ele, 'latest_task.trigger_type'),
        },
      });
    }

    return list;
  };

  const handleDelete = async (envName) => {
    const dialog = Dialog.alert({
      title: `删除环境：${envName}`,
      content: '您确定删除当前环境吗?',
      onOk: async () => {
        const { success } = await request({ envName, appId });
        if (success) {
          Toast.success('环境删除成功');
          refresh();
        }
        dialog.hide();
      },
    });
  };

  const columns = [
    {
      key: 'name',
      title: '环境名称',
      dataIndex: 'name',
      cell: (value, _index, record) => (
        <>
          <Link to={`/${orgName}/application/${appId}/${value}`}>{value}</Link>
        </>
      ),
    },
    {
      key: 'type',
      title: '环境类型',
      dataIndex: 'type',
      cell: (value, _index, record) => <EnvType type={value} />,
    },
    {
      key: 'created_time',
      title: '创建时间',
      dataIndex: 'created_time',
      cell: (value, _index, record) => formatTime(value),
    },
    {
      key: 'trigger_info',
      title: '触发方式',
      dataIndex: 'trigger_info',
      cell: (value, _index, record) => {
        if (isEmpty(value.trigger_type)) return '--';
        return (
          <div className="align-center">
            {value.trigger_type === 'manual' ? '手动触发' : `${value.trigger_type}触发`}
            {value.commit && (
              <div className="align-center ml-8">
                {C_REPOSITORY[value.provider]?.svg(16)}
                <CommitId
                  className="ml-4"
                  url={`https://${value.provider}.com/${value.owner}/${value.repo_name}/commit/${value.commit}`}
                  label={value.commit}
                  message={value.message}
                  icon={false}
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      title: '部署状态',
      dataIndex: 'status',
      cell: (value, _index, record) => <Status status={value} />,
    },
    {
      key: 'envName',
      title: '操作',
      dataIndex: 'envName',
      cell: (value, _index, record) => (
        <Button type="primary" text onClick={() => handleDelete(value)} loading={loading}>
          删除
        </Button>
      ),
    },
  ];

  return <Table dataSource={getEnvData()} columns={columns} />;
};

export default EnvList;
