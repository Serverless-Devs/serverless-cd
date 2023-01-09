import React from 'react';
import { Grid, Input, Select, Field } from '@alicloud/console-components';
import { noop, isEmpty, includes, get } from 'lodash';
import { TYPE as ENV_TYPE } from '@/components/EnvType';

const { Row, Col } = Grid;

interface IProps {
  value?: any;
  onChange?: (value: object) => void;
}

export const validteEnv = (rule, value, callback, args) => {
  const existEnvs = get(args, 'existEnvs', []);
  console.log(existEnvs);

  if (isEmpty(value.name)) return callback('请输入环境名称');
  if (includes(existEnvs, value.name)) return callback('当前环境已存在，请勿重复创建。');
  if (!/^([a-zA-Z](?!-)[a-zA-Z0-9-_]{1,64})$/.test(`${value.name}`))
    return callback(
      '必须以字母开头，可含数字、字母（大小写敏感）、连字符，长度大于1个字符且小于64个字符。',
    );
  callback();
};

const Env = (props: IProps) => {
  const { value: initValue, onChange = noop } = props;
  const field = Field.useField({
    onChange: (name: string, value: any) => {
      onChange(field.getValues());
    },
  });
  const { init } = field;

  return (
    <Row gutter={16} className="mb-8">
      <Col span="12">
        <Input
          {...init('name', { initValue: initValue.name })}
          placeholder="请输入环境名称"
          className="full-width"
        />
      </Col>
      <Col span="12">
        <Select
          className="full-width"
          {...init('type', { initValue: initValue.type })}
          dataSource={[
            { label: '测试环境', value: ENV_TYPE.TESTING },
            { label: '预发环境', value: ENV_TYPE.STAGING },
            { label: '生产环境', value: ENV_TYPE.PRODUCTION },
          ]}
        />
      </Col>
    </Row>
  );
};

export default Env;
