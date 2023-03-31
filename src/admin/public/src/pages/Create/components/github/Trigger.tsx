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
  createTemplate: boolean;
}

export interface IInfo {
  push: `${PUSH}`;
  branch: string;
  commit_sha?: string;
}

const Trigger = (props: IProps) => {
  const { value, repo, onChange = noop, createTemplate } = props;
  const { data, request, loading } = useRequest(githubBranches);

  const defaultValue = {
    push: PUSH.NEW,
    branch: DEFAULT_NEW_BRANCH,
  };

  const defaultValueTemplate = {
    push: PUSH.NEW,
    branch: 'master',
  };

  const branchLabel = createTemplate ? '分支名称' : '触发分支';

  const newVal = isEmpty(value)
    ? {
      push: PUSH.NEW,
      branch: DEFAULT_NEW_BRANCH,
    }
    : value;
  const [info, setInfo] = useState<IInfo>(newVal);

  const doRepoChange = async () => {
    if (createTemplate) {
      setInfo(defaultValueTemplate);
    } else {
      setInfo(defaultValue);
    }
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
      {!createTemplate && (
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
      )}
      <Form.Item label={branchLabel} required>
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
          <>
            <Input value={info.branch} disabled className="full-width" />
            {createTemplate && (
              <div className='color-gray mt-6'>
                当前代码仓库还未创建，系统将会在完成代码仓库创建之后，自动为您创建master分支作为默认分支
              </div>
            )}
          </>
        )}
      </Form.Item>
    </Form>
  );
};

export default Trigger;
