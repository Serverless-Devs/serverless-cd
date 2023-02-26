import React, { useState, useEffect } from 'react';
import { Select, Input, Form, Radio } from '@alicloud/console-components';
import { map, noop, isEmpty, find } from 'lodash';
import { githubBranches } from '@/services/git';
import { useRequest } from 'ice';
import { IRepoItem } from './Repo';
import { PUSH, DEFAULT_NEW_BRANCH } from '../constant';
import { FORM_ITEM_LAYOUT } from '@/constants';

const RadioGroup = Radio.Group;

interface IProps {
  value?: IInfo;
  onChange?: (value: IInfo) => void;
  repo: IRepoItem;
}

export interface IInfo {
  push: `${PUSH}`;
  branch: string;
  commit_sha?: string;
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

  const doRepoChange = async () => {
    setInfo(defaultValue);
    if (!isEmpty(repo)) {
      const res = await request({ owner: repo.owner, repo: repo.name });
      const commitObj = find(res, (obj) => obj.name === repo.default_branch);
      onChange({ ...info, commit_sha: commitObj?.commit_sha });
    }
  };

  useEffect(() => {
    doRepoChange();
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
    <Form {...FORM_ITEM_LAYOUT}>
      <Form.Item label="触发条件" required>
        <RadioGroup
          size="medium"
          value={info.push}
          onChange={(value: string) => handleChangeValue('push', value)}
        >
          <Radio value={PUSH.NEW}>Push代码到新分支</Radio>
          <Radio value={PUSH.SPECIFY}>Push代码到指定分支</Radio>
        </RadioGroup>
      </Form.Item>
      <Form.Item label="触发分支" required>
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
      </Form.Item>
    </Form>
  );
};

export default Trigger;
