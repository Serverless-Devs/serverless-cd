import React, { useState, useEffect } from 'react';
import { Grid, Select, Input } from '@alicloud/console-components';
import { map, noop, isEmpty } from 'lodash';
import { githubBranches } from '@/services/git';
import { useRequest } from 'ice';
import { IRepoItem } from './Repo';
import { PUSH, DEFAULT_NEW_BRANCH } from '../constant';

const { Row, Col } = Grid;

interface IProps {
  value?: IInfo;
  onChange?: (value: IInfo) => void;
  repo: IRepoItem;
}

export interface IInfo {
  push: `${PUSH}`;
  branch: string;
}

const Trigger = (props: IProps) => {
  const { value, repo, onChange = noop } = props;
  const { data, request, loading } = useRequest(githubBranches);

  const defaultValue = {
    push: PUSH.NEW,
    branch: DEFAULT_NEW_BRANCH,
  };

  const newVal = isEmpty(value)
    ? {
        push: PUSH.NEW,
        branch: DEFAULT_NEW_BRANCH,
      }
    : value;
  const [info, setInfo] = useState<IInfo>(newVal);

  useEffect(() => {
    setInfo(defaultValue);
    !isEmpty(repo) && request({ owner: repo.owner, repo: repo.name });
  }, [JSON.stringify(repo)]);

  useEffect(() => {
    onChange(info);
  }, [JSON.stringify(info)]);

  const handleChangeValue = (key: string, value: string) => {
    const newInfo = {
      ...info,
      [key]: value,
    };
    if (key === 'push') {
      newInfo.branch = value === PUSH.NEW ? DEFAULT_NEW_BRANCH : repo?.default_branch;
    }
    setInfo(newInfo);
  };

  return (
    <Row gutter={16} className="mb-8">
      <Col span="12">
        <Select
          className="full-width"
          value={info.push}
          onChange={(value) => handleChangeValue('push', value)}
          dataSource={[
            { label: 'Push代码到新分支', value: PUSH.NEW },
            { label: 'Push代码到指定分支', value: PUSH.SPECIFY },
          ]}
        />
      </Col>
      <Col span="12">
        {info.push === PUSH.SPECIFY ? (
          <Select
            className="full-width"
            innerBefore={
              <div className="pl-16" style={{ color: '#555' }}>
                分支
              </div>
            }
            value={info.branch}
            onChange={(value) => handleChangeValue('branch', value)}
            state={loading ? 'loading' : undefined}
            disabled={loading}
            dataSource={map(data, (obj) => ({ label: obj.name, value: obj.name }))}
          />
        ) : (
          <Input value={info.branch} disabled className="full-width" />
        )}
      </Col>
    </Row>
  );
};

export default Trigger;
