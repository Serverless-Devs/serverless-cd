import React, { useState, useEffect } from 'react';
import { Grid, Input, Button, Icon } from '@alicloud/console-components';
import { map, uniqueId, filter, noop, isEmpty } from 'lodash';
import './index.less';

const { Row, Col } = Grid;

interface IProps {
  value?: object;
  onChange?: (value: object) => void;
}

interface IItem {
  id: string;
  key: string;
  value: string;
  showPassword?: boolean;
}

const Secret = (props: IProps) => {
  const { value, onChange = noop } = props;
  const [list, setList] = useState<IItem[]>([]);

  useEffect(() => {
    const defaultValue: IItem[] = isEmpty(value)
      ? [{ id: uniqueId(), key: '', value: '', showPassword: true }]
      : map(value, (item: IItem) => ({ ...item, id: uniqueId() }));
    setList(defaultValue);
  }, []);

  useEffect(() => {
    onChange(list);
  }, [JSON.stringify(list)]);

  const handleChangeKey = (value: string, item: IItem) => {
    const newList = map(list, (i) => {
      if (i.id === item.id) {
        return { ...i, key: value };
      }
      return i;
    });
    setList(newList);
  };
  const handleChangeValue = (value: string, item: IItem) => {
    const newList = map(list, (i) => {
      if (i.id === item.id) {
        return { ...i, value: value };
      }
      return i;
    });
    setList(newList);
  };
  const handleshowPassword = (item: IItem) => {
    const newList = map(list, (i) => {
      if (i.id === item.id) {
        return { ...i, showPassword: !i.showPassword };
      }
      return i;
    });
    setList(newList);
  };
  const handleAdd = () => {
    setList([...list, { id: uniqueId(), key: '', value: '', showPassword: true }]);
  };

  const handleDelete = (item: IItem) => {
    const newList = filter(list, (i) => i.id !== item.id);
    setList(newList);
  };

  return (
    <div className="env-container">
      {map(list, (item: IItem) => (
        <div key={item.id}>
          <Row gutter={16} className="mb-8">
            <Col span="12">
              <Input
                innerBefore="变量"
                className="full-width"
                placeholder="请输入"
                value={item.key}
                onChange={(value) => handleChangeKey(value, item)}
              />
            </Col>
            <Col span="12" className="env-value">
              <Input
                innerBefore="值"
                placeholder="请输入"
                htmlType={item.showPassword ? 'password' : 'text'}
                value={item.value}
                onChange={(value) => handleChangeValue(value, item)}
                className="full-width"
                innerAfter={
                  <Icon
                    className="mr-8 cursor-pointer"
                    type={item.showPassword ? 'eye' : 'eye-slash'}
                    onClick={() => handleshowPassword(item)}
                  />
                }
              />
              <Button
                type="primary"
                text
                onClick={() => handleDelete(item)}
                className="ml-8 mt-6"
                style={{ position: 'absolute' }}
              >
                <Icon type="delete" />
              </Button>
            </Col>
          </Row>
        </div>
      ))}
      <Button onClick={handleAdd} className="mt-8 mb-20">
        <Icon type="add" className="mr-4" />
        新增
      </Button>
    </div>
  );
};

export default Secret;
