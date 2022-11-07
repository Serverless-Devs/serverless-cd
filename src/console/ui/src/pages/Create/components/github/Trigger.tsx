import React, { useState, useEffect } from 'react';
import { Grid, Select, Input, Button, Icon } from '@alicloud/console-components';
import { map, uniqueId, filter, noop, isEmpty } from 'lodash';
import { githubBranches } from '@/services/git';
import { useRequest } from 'ice';
import { IRepoItem } from './Repo';
import { TRIGGER_TYPE, IFilterType } from '../constant';

const { Row, Col } = Grid;

interface IProps {
  type?: 'create' | 'update';
  value?: object;
  onChange?: (value: object) => void;
  repo: IRepoItem;
}

const TEMPLATE = 'serverless-pipeline.yaml';

export interface IItem {
  id: string;
  type: `${TRIGGER_TYPE}`;
  branch: string;
  input?: string;
  filterType: `${IFilterType}`;
  template: string;
}

const Trigger = (props: IProps) => {
  const { repo } = props;
  const { data, request, loading } = useRequest(githubBranches);

  const getDefaultTriggerValue = () => ([{
    id: uniqueId(),
    type: TRIGGER_TYPE.PUSH,
    branch: repo?.default_branch,
    filterType: IFilterType.BRANCH,
    template: TEMPLATE,
  }]);
  const defaultValue = isEmpty(props.value) ? getDefaultTriggerValue() : map(props.value, (item: IItem) => ({ ...item, id: uniqueId() }))
  const [list, setList] = useState<IItem[]>(defaultValue);

  useEffect(() => {
    // 如果存在值，则不需要set 默认值
    if (props.type !== 'update') {
      setList(getDefaultTriggerValue());
    }

    repo && request({ owner: repo.owner, repo: repo.name });
  }, [JSON.stringify(repo)]);

  useEffect(() => {
    (props.onChange || noop)(list);
  }, [JSON.stringify(list)]);

  const handleChangeType = (value: string, item: IItem) => {
    const newList = map(list, (i) => {
      if (i.id === item.id) {
        return { ...i, type: value as IItem['type'] };
      }
      return i;
    });
    setList(newList);
  };
  const handleChangeInput = (value: string, item: IItem) => {
    const newList = map(list, (i) => {
      if (i.id === item.id) {
        return { ...i, input: value };
      }
      return i;
    });
    setList(newList);
  };

  const handleChangeBranch = (value: string, item: IItem) => {
    const newList = map(list, (i) => {
      if (i.id === item.id) {
        return { ...i, branch: value };
      }
      return i;
    });
    setList(newList);
  };
  const handleAdd = () => {
    setList([
      ...list,
      {
        id: uniqueId(),
        type: TRIGGER_TYPE.PUSH,
        branch: repo?.default_branch,
        filterType: IFilterType.BRANCH,
        template: TEMPLATE,
      },
    ]);
  };

  const handleDelete = (item: IItem) => {
    const newList = filter(list, (i) => i.id !== item.id);
    setList(newList);
  };
  const handleChangeFilterType = (value: IFilterType, item: IItem) => {
    const newList = map(list, (i) => {
      if (i.id === item.id) {
        return { ...i, filterType: value };
      }
      return i;
    });
    setList(newList);
  };
  const handleChangeTemplate = (value: string, item: IItem) => {
    const newList = map(list, (i) => {
      if (i.id === item.id) {
        return { ...i, template: value };
      }
      return i;
    });
    setList(newList);
  };

  const renderFilter = (item: IItem) => {
    if (item.type === TRIGGER_TYPE.PUSH) {
      return (
        <div className="align-center">
          <Select
            style={{ width: 150 }}
            value={item.filterType}
            onChange={(value) => handleChangeFilterType(value, item)}
            dataSource={[
              { label: '选择分支', value: IFilterType.BRANCH },
              { label: '手动输入', value: IFilterType.INPUT },
            ]}
          />
          {item.filterType === IFilterType.BRANCH ? (
            <Select
              className="full-width"
              value={item.branch}
              onChange={(value) => handleChangeBranch(value, item)}
              state={loading ? 'loading' : undefined}
              disabled={loading}
              dataSource={map(data, (obj) => ({ label: obj.name, value: obj.name }))}
            />
          ) : (
            <Input
              placeholder="请输入"
              value={item.input}
              onChange={(value) => handleChangeInput(value, item)}
              className="full-width"
            />
          )}
        </div>
      );
    }
    return (
      <Input
        disabled
        value={item.input}
        onChange={(value) => handleChangeInput(value, item)}
        className="full-width"
      />
    );
  };
  return (
    <>
      {map(list, (item: IItem) => (
        <div key={item.id}>
          <Row gutter={16} className="mb-8">
            <Col span="6">
              <Select
                className="full-width"
                value={item.type}
                onChange={(value) => handleChangeType(value, item)}
                dataSource={[
                  { label: 'Push代码到指定分支', value: TRIGGER_TYPE.PUSH },
                  { label: '发布Release版本', value: TRIGGER_TYPE.RELEASE },
                ]}
              />
            </Col>
            <Col span="12" style={{ position: 'relative' }}>
              {renderFilter(item)}
            </Col>
            <Col span="6">
              <Input
                value={item.template}
                placeholder="请输入"
                onChange={(value) => handleChangeTemplate(value, item)}
                className="full-width"
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
      <Button onClick={handleAdd}>
        <Icon type="add" className="mr-4" />
        新增
      </Button>
    </>
  );
};

export default Trigger;
