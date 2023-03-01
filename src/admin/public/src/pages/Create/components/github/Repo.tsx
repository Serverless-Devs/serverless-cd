import React, { useEffect, ReactNode, useState } from 'react';
import { useRequest } from 'ice';
import { Select, Icon, Field, Form } from '@alicloud/console-components';
import store from '@/store';
import { noop, map, find, isEmpty, cloneDeep, get } from 'lodash';
import RefreshIcon from '@/components/RefreshIcon';
import { githubOrgs, githubOrgRepos } from '@/services/git';

const FormItem = Form.Item;
export interface IRepoItem {
  name: string;
  owner: string;
  avatar_url: string;
  private: boolean;
  label: string | ReactNode;
  value: string;
  disabled: boolean;
  url: string;
  default_branch: string;
}

interface IProps {
  field: Field;
  value?: IRepoItem | undefined;
  onChange?: (value: IRepoItem) => void;
}

const initRepoTypeList = [
  {
    label: '个人仓库',
    children: [
      {
        value: 'personal',
        label: '个人仓库',
      },
    ],
  },
  {
    label: '组织仓库',
    children: [],
  },
];

const Repos = (props: IProps) => {
  const { value, onChange = noop, field } = props;
  const { data, loading, request } = useRequest(githubOrgs);
  const orgRepos = useRequest(githubOrgRepos);
  const [, userDispatchers] = store.useModel('user');
  const effectsState = store.useModelEffectsState('user');
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [currentRepoType, setCurrentRepoType] = useState('personal');
  const { getValue, setValue, init, getError } = field;
  // owner是否授权
  const isAuth = Boolean(get(getValue('gitUser'), 'third_part.github.owner'));

  useEffect(() => {
    if (!isEmpty(data)) {
      const { data: orgs } = data;
      const newRepoTypeList = cloneDeep(initRepoTypeList);
      const orgList = map(orgs, ({ org, id }) => ({ label: org, value: org, id }));
      newRepoTypeList[1].children = orgList as any;
      setValue('repoTypeList', newRepoTypeList);
    }
  }, [data]);

  useEffect(() => {
    if (!getValue('repoTypeList')) {
      setValue('repoTypeList', initRepoTypeList);
    }
  }, [getValue('repoTypeList')]);

  useEffect(() => {
    if (!isAuth) return;
    onRepoTypeChange('personal');
    request();
  }, [isAuth]);

  const valueRender = ({ value }) => {
    const userRepos = (getValue('userRepos') as IRepoItem[]) || ([] as IRepoItem[]);
    const item = find(userRepos, (obj: IRepoItem) => obj.name === value);
    if (!item) return null;
    return (
      <div className="align-center">
        {item.avatar_url && (
          <img
            className="mr-4"
            src={item.avatar_url}
            style={{ width: 20, height: 20, borderRadius: '50%' }}
          />
        )}
        {`${item.owner}/${item.name}`}
      </div>
    );
  };

  const goDetail = (e, item: IRepoItem) => {
    e.stopPropagation();
    window?.open(item.url);
  };

  const fetchUserRepos = async () => {
    if (!isAuth) return;
    const res = await userDispatchers.getUserRepos();
    const data = map(res, (item: IRepoItem) => {
      return {
        ...item,
        label: (
          <div className="flex-r">
            <div className="align-center">
              {item.avatar_url && (
                <img
                  className="ml-4"
                  src={item.avatar_url}
                  style={{ width: 20, height: 20, borderRadius: '50%' }}
                />
              )}
              <span className="ml-4">{`${item.owner}/${item.name}`}</span>
              <Icon
                className="ml-4 mr-4"
                style={{ color: item.disabled ? '#b3b3b3' : '#666' }}
                size={12}
                type={item.private ? 'lock' : 'unlock'}
              />
            </div>
            <div
              style={{ color: '#0064C8' }}
              className="cursor-pointer"
              onClick={(e) => goDetail(e, item)}
            >
              <span>详情</span>
              <Icon className="ml-4" type="external-link" size={12} />
            </div>
          </div>
        ),
        value: item.name,
      };
    });
    setValue('userRepos', data);
  };

  const fetchOrgRepos = async (org) => {
    if (!isAuth) return;
    const { data: res } = await orgRepos.request({ org });
    const data = map(res, (item: IRepoItem) => {
      return {
        ...item,
        label: (
          <div className="flex-r">
            <div className="align-center">
              {item.avatar_url && (
                <img
                  className="ml-4"
                  src={item.avatar_url}
                  style={{ width: 20, height: 20, borderRadius: '50%' }}
                />
              )}
              <span className="ml-4">{`${item.owner}/${item.name}`}</span>
              <Icon
                className="ml-4 mr-4"
                style={{ color: item.disabled ? '#b3b3b3' : '#666' }}
                size={12}
                type={item.private ? 'lock' : 'unlock'}
              />
            </div>
            <div
              style={{ color: '#0064C8' }}
              className="cursor-pointer"
              onClick={(e) => goDetail(e, item)}
            >
              <span>详情</span>
              <Icon className="ml-4" type="external-link" size={12} />
            </div>
          </div>
        ),
        value: item.name,
      };
    });
    setValue('userRepos', data);
  };

  const refresh = async () => {
    setRefreshLoading(true);
    await request();
    if (currentRepoType === 'personal') {
      await fetchUserRepos();
    } else {
      await fetchOrgRepos(currentRepoType);
    }
    setRefreshLoading(false);
  };

  const handleChange = (value: string) => {
    const item = find(getValue('userRepos'), (obj: IRepoItem) => obj.value === value);
    onChange(item);
  };
  const onRepoTypeChange = (value) => {
    if (!value) return;
    setValue('userRepos', []);
    if (value === 'personal') {
      fetchUserRepos();
    } else {
      fetchOrgRepos(value);
    }
    setCurrentRepoType(value);
    onChange({});
  };
  return (
    <div className="flex-r position-r">
      <Form field={field} className="flex-r position-r" style={{ width: '100%' }}>
        <FormItem style={{ flexBasis: '30%', marginBottom: getError('repoName') ? 20 : 0 }}>
          <Select
            className="full-width"
            placeholder="请选择个人/组织"
            dataSource={getValue('repoTypeList')}
            {...init('repoTypeValue', {
              initValue: 'personal',
              props: {
                onChange: onRepoTypeChange,
              },
            })}
            state={loading ? 'loading' : undefined}
            disabled={loading}
          />
        </FormItem>
        <FormItem style={{ flexBasis: '68%', marginBottom: 0 }}>
          <Select
            {...(init('repoName', {
              rules: [
                {
                  required: true,
                  message: '请选择仓库名称',
                },
              ],
              props: {
                value: value?.name,
                onChange: handleChange,
              },
            }) as any)}
            className="full-width"
            placeholder="请选择"
            showSearch
            dataSource={getValue('userRepos')}
            state={orgRepos.loading || effectsState.getUserRepos.isLoading ? 'loading' : undefined}
            disabled={loading || effectsState.getUserRepos.isLoading || orgRepos.loading}
            valueRender={valueRender}
            popupClassName="icon-right"
          />
        </FormItem>
      </Form>
      <RefreshIcon
        style={{ position: 'absolute', right: -20, top: getError('repoName') ? 5 : 'auto' }}
        refreshCallback={refresh}
        loading={refreshLoading}
      />
    </div>
  );
};

export default Repos;
