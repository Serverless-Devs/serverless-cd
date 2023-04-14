import React, { useState, useEffect } from 'react';
import { useRequest } from 'ice';
import { updateUserProviderToken } from '@/services/user';
import { orgDetail } from '@/services/org';
import { Table, Dialog, Button, Loading } from '@alicloud/console-components';
import { C_REPOSITORY } from '@/constants/repository';
import { THIRDPARTYTITLE } from '@/constants';
import { map, filter, isEmpty } from 'lodash';
import GitHubBind from './component/githubBind';
import { get, forIn } from 'lodash';
import moment from 'moment';
import './index.less';

interface IThirdPart {
  github: {
    repo_owner: string;
    avatar: string;
    id: number;
  };
}

const GitBind = (props) => {
  const { request } = useRequest(updateUserProviderToken);
  const orgDetailRequest = useRequest(orgDetail);
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());

  useEffect(() => {
    fetchUserList();
  }, [refresh]);

  const columns = [
    {
      dataIndex: 'type',
      title: '绑定账号信息',
      cell: (value, index, record) => THIRDPARTYTITLE[value],
    },
    {
      dataIndex: 'avatar',
      title: '详情',
      cell: (value, index, record) => {
        const name = get(record, 'repo_owner', '');
        return (
          <div className="thirdp-party-detail">
            <img src={value} className="ml-4 mr-4" style={{ borderRadius: '50%', height: 20 }} />
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      dataIndex: 'time',
      title: '绑定时间',
      cell: () => moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'operate',
      title: '操作',
      cell: (value, index, record) => {
        return <Button onClick={onUnbind}>解除绑定</Button>;
      },
    },
  ];

  const THIRDPARTY = [
    {
      visible: isEmpty(dataSource) ? true : dataSource.some((item: any) => item.type !== 'github'),
      icon: C_REPOSITORY['github']?.svg(36),
      title: 'GitHub',
      func: () => setVisible(true),
    },
  ];

  const fetchUserList = async () => {
    const ThirdPartArr: any = [];
    const data = await orgDetailRequest.request();

    const ThirdPart = get(data, 'data.third_part', {}) as IThirdPart;
    forIn(ThirdPart, (item: any, key: any, obj) => {
      if (!isEmpty(obj[key])) {
        item.type = key;
        ThirdPartArr.push(item);
      }
    });
    setDataSource(ThirdPartArr);
  };

  const onUnbind = (e) => {
    e.stopPropagation();
    Dialog.confirm({
      title: '您确定解除Github的账户授权吗',
      content: '若您解除绑定，当前账户下的所有应用将无法触发部署流程。',
      onOk: async () => {
        await request({ token: '', provider: 'github' });
        orgDetailRequest.refresh();
        handleChangeRefresh();
      },
    });
  };

  const callBackGitHub = () => {
    setVisible(false);
    return orgDetailRequest.refresh();
  };
  const handleChangeRefresh = () => {
    setRefresh(Date.now());
  };
  return (
    <Loading visible={orgDetailRequest.loading} className="thirdp-party-loading">
      {orgDetailRequest.loading ? (
        <></>
      ) : (
        <React.Fragment>
          <Table loading={orgDetailRequest.loading} dataSource={dataSource} columns={columns} />
          <div>
            {THIRDPARTY.some((item) => item.visible) && <h3>您还可以绑定以下第三方账号</h3>}
            <div className="thirdp-party">
              {map(
                filter(THIRDPARTY, (item) => item.visible),
                (item) => {
                  return (
                    <div className="thirdp-party-app" onClick={item.func}>
                      <div className="cursor-pointer">{item.icon}</div>
                      <div className="app-name">{item.title}</div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </React.Fragment>
      )}

      {visible && (
        <GitHubBind
          active={visible}
          callback={callBackGitHub}
          handleChangeRefresh={handleChangeRefresh}
        />
      )}
    </Loading>
  );
};

export default GitBind;
