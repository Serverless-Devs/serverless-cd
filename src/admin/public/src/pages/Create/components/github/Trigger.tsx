import React, { useState, useEffect } from 'react';
import { Grid, Select, Input, Button, Icon } from '@alicloud/console-components';
import { map, uniqueId, filter, noop, isEmpty } from 'lodash';
import { githubBranches } from '@/services/git';
import { useRequest } from 'ice';
import { IRepoItem } from './Repo';

const { Row, Col } = Grid;

interface IProps {
  value?: object;
  onChange?: (value: object) => void;
  repo: IRepoItem;
}

export interface IItem {
  id: string;
  branch: string;
}

const Trigger = (props: IProps) => {
  const { repo } = props;
  const { data, request, loading } = useRequest(githubBranches);

  const getDefaultTriggerValue = () => ({
    id: uniqueId(),
    branch: repo?.default_branch,
  });
  const defaultValue = isEmpty(props.value)
    ? [getDefaultTriggerValue()]
    : map(props.value, (item: IItem) => ({ ...item, id: uniqueId() }));
  const [list, setList] = useState<IItem[]>(defaultValue);

  useEffect(() => {
    setList([getDefaultTriggerValue()]);
    !isEmpty(repo) && request({ owner: repo.owner, repo: repo.name });
  }, [JSON.stringify(repo)]);

  useEffect(() => {
    (props.onChange || noop)(list);
  }, [JSON.stringify(list)]);

  const handleChangeValue = (key: string, value: string, item: IItem) => {
    const newList = map(list, (i) => {
      if (i.id === item.id) {
        return { ...i, [key]: value };
      }
      return i;
    });
    setList(newList);
  };
  const handleAdd = () => {
    setList([...list, getDefaultTriggerValue()]);
  };
  const handleDelete = (item: IItem) => {
    const newList = filter(list, (i) => i.id !== item.id);
    setList(newList);
  };

  return (
    <>
      {map(list, (item: IItem) => (
        <div key={item.id}>
          <Row gutter={16} className="mb-8">
            <Col span="12">
              <Input value="Push代码到指定分支" readOnly className="full-width" />
            </Col>
            <Col span="12">
              <Select
                className="full-width"
                innerBefore={
                  <div className="pl-16" style={{ color: '#555' }}>
                    分支
                  </div>
                }
                value={item.branch}
                onChange={(value) => handleChangeValue('branch', value, item)}
                state={loading ? 'loading' : undefined}
                disabled={loading}
                dataSource={map(data, (obj) => ({ label: obj.name, value: obj.name }))}
              />
              {list.length > 1 && (
                <Button
                  type="primary"
                  text
                  onClick={() => handleDelete(item)}
                  style={{ position: 'absolute' }}
                  className="mt-6 ml-8"
                >
                  <Icon type="delete" />
                </Button>
              )}
            </Col>
          </Row>
        </div>
      ))}
      {/* <Button onClick={handleAdd}>
        <Icon type="add" className="mr-4" />
        新增
      </Button> */}
    </>
  );
};

export default Trigger;
