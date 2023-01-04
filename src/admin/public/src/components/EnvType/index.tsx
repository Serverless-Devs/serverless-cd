import React from 'react';
import { Tag } from '@alicloud/console-components';
import { isEmpty } from 'lodash';
import './index.less';

export enum TYPE {
  TESTING = 'testing',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export const ENV_TYPE_STATUS = {
  [TYPE.TESTING]: {
    text: '测试环境',
    color: 'green',
  },
  [TYPE.STAGING]: {
    text: '预发环境',
    color: 'yellow',
  },
  [TYPE.PRODUCTION]: {
    text: '生产环境',
    color: 'red',
  },
};

type Props = {
  type: string;
};

const EnvType = (props: Props) => {
  const { type } = props;
  const found = ENV_TYPE_STATUS[type];

  return (
    <div className="env-type__wrapper">
      {!isEmpty(found) && (
        <Tag color={found.color} type="primary" size="small">
          {found.text}
        </Tag>
      )}
    </div>
  );
};
export default EnvType;
