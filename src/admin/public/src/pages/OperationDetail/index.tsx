import React, { useEffect, useState } from 'react';
import { useRequest, history } from 'ice';
import { Button, Dialog, Loading, Select, Balloon } from '@alicloud/console-components';
import PageLayout from '@/layouts/PageLayout';
import { applicationDetail, removeEnv } from '@/services/applist';
import { get, isEmpty, isBoolean, keys } from 'lodash';
import CreateEnv from '../EnvDetail/components/CreateEnv';
import { Toast } from '@/components/ToastContainer';
import Fc from './Fc';

const { Tooltip } = Balloon;

const Details = ({
  match: {
    params: { appId, envName, orgName },
  },
}) => {
  const {
    data: detailInfo,
    request,
    cancel,
  } = useRequest(applicationDetail, { pollingInterval: 5000 });
  const [loading, setLoading] = useState(false);
  const [pageKey, forceUpdate] = useState(0);

  const data = get(detailInfo, 'data', {});
  const resource = get(data, `environment.${envName}.resource`, {});
  const cloudAlias = get(data, `environment.${envName}.cloud_alias`, '');
  const appName = get(detailInfo, 'data.name') || get(detailInfo, 'data.repo_name', '');

  const fetchData = async () => {
    setLoading(true);
    await request({ id: appId });
    setLoading(false);
  };


  useEffect(() => {
    fetchData();
  }, [envName]);


  useEffect(() => {
    if (isEmpty(detailInfo)) return;
    if (detailInfo.success) {
      const completed = get(detailInfo, `data.environment.${envName}.latest_task.completed`);
      if (!isBoolean(completed) || (isBoolean(completed) && completed)) {
        cancel();
      }
    } else {
      cancel();
      const dialog = Dialog.alert({
        title: `环境详情信息出错`,
        content: '当前环境详情出错/删除',
        footer: [
          <Button
            type="primary"
            onClick={() => {
              history?.push(`/${orgName}/application`);
              dialog.hide();
            }}
          >
            返回应用列表
          </Button>,
          <Button onClick={() => dialog.hide()}>取消</Button>,
        ],
      });
    }
  }, [detailInfo]);

  const handleDelete = async () => {
    const dialog = Dialog.alert({
      title: `删除环境：${envName}`,
      content: '您确定删除当前环境吗?',
      onOk: async () => {
        const { success } = await removeEnv({ envName, appId });
        if (success) {
          Toast.success('环境删除成功');
          history?.push(`/${orgName}/application/${appId}/default`);
          forceUpdate(Date.now());
        }
        dialog.hide();
      },
    });
  };

  const handleChangeEnv = async (value: string) => {
    history?.push(`/${orgName}/application/${appId}/${value}/operation`);
    forceUpdate(Date.now());
  };


  return (
    <PageLayout
      title="环境切换"
      key={pageKey}
      subhead={
        <Select
          value={envName}
          dataSource={keys(get(detailInfo, 'data.environment'))}
          onChange={handleChangeEnv}
        />
      }
      breadcrumbs={[
        {
          name: '应用列表',
          path: `/${orgName}/application`,
        },
        {
          name: appName,
        },
      ]}
      breadcrumbExtra={
        <>
          <CreateEnv
            data={get(detailInfo, 'data', {})}
            appId={appId}
            callback={async (value) => {
              history?.push(`/${orgName}/application/${appId}/${value}`);
              forceUpdate(Date.now());
            }}
          >
            <Button type="primary">创建环境</Button>
          </CreateEnv>

          {envName === 'default' ? (
            <Tooltip
              align="t"
              trigger={
                <Button disabled className="ml-8" type="primary" warning onClick={handleDelete}>
                  删除环境
                </Button>
              }
            >
              默认环境不允许删除
            </Tooltip>
          ) : (
            <Button className="ml-8" type="primary" warning onClick={handleDelete}>
              删除环境
            </Button>
          )}
        </>
      }
      children={(
        <Loading visible={loading} inline={false} className="mt-16">
        <Fc resource={get(resource, 'fc', [])} cloudAlias={cloudAlias}/>
      </Loading>
      )}
    />
  );
};

export default Details;
