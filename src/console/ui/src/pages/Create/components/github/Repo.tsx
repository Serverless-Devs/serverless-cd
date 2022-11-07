import React, { useEffect, ReactNode, useState } from 'react';
import { Select, Icon, Field } from '@alicloud/console-components';
import store from '@/store';
import { noop, map, find } from 'lodash';
import RefreshIcon from '@/components/RefreshIcon';

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

const Repos = (props: IProps) => {
  const { value, onChange = noop, field } = props;
  const [userState, userDispatchers] = store.useModel('user');
  const effectsState = store.useModelEffectsState('user');
  const [refreshLoading, setRefreshLoading] = useState(false);
  const { getValue, setValue } = field;

  useEffect(() => {
    fetchUserRepos();
  }, [userState.isAuth]);

  const valueRender = ({ value }) => {
    const item = find(userState.userRepos, (obj: IRepoItem) => obj.name === value);
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
    if (!userState.isAuth) return;
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

  const refresh = async () => {
    setRefreshLoading(true);
    await fetchUserRepos();
    setRefreshLoading(false);
  };

  const handleChange = (value: string) => {
    const item = find(getValue('userRepos'), (obj: IRepoItem) => obj.value === value);
    onChange(item);
  };

  return (
    <div className='flex-r position-r'>
      <Select
        className="full-width"
        placeholder="请选择"
        showSearch
        dataSource={getValue('userRepos')}
        state={effectsState.getUserRepos.isLoading ? 'loading' : undefined}
        disabled={effectsState.getUserRepos.isLoading}
        value={value?.name}
        onChange={handleChange}
        valueRender={valueRender}
        popupClassName="icon-right"
      />
      <RefreshIcon
        style={{ position: 'absolute', right: -20 }}
        refreshCallback={refresh}
        loading={refreshLoading}
      />
    </div>
  );
};

export default Repos;
