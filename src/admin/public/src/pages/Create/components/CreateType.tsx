import React from 'react';
import { Card, Grid, Radio } from '@alicloud/console-components';
import { noop } from 'lodash';
import { CREATE_TYPE } from './constant';
export { CREATE_TYPE } from './constant';

const { Row, Col } = Grid;

const Title = ({ disabled = false, value, active, title, subTitle, onClick }) => (
  <Card
    free
    onClick={onClick}
    className={`
      p-16
      application-type-select-content-card
      cursor-pointer
      ${active === value ? 'active' : ''}
      ${disabled ? 'disabled' : ''}
    `}
  >
    <div className="flex-r">
      <div className="fz-14 mb-8 text-bold">{title}</div>
      <Radio.Group value={active} disabled={disabled}>
        <Radio value={value}></Radio>
      </Radio.Group>
    </div>

    <div className="text-description">{subTitle}</div>
  </Card>
);

const CreateType = (props) => {
  const { value, onChange = noop } = props;
  return (
    <div className="mb-20 application-type-select">
      <Row>
        <Col span="24" className="mb-10">
          <span>请选择一种创建应用的方式</span>
        </Col>
      </Row>
      <Row className="application-type-select-content">
        <Title
          value={CREATE_TYPE.Repository}
          onClick={() => onChange(CREATE_TYPE.Repository)}
          active={value}
          title={'通过仓库导入应用'}
          subTitle={'Serverless-CD提供了海量应用模版，帮助您快速创建Serverless-CD应用'}
        />
        <Title
          value={CREATE_TYPE.Template}
          onClick={() => onChange(CREATE_TYPE.Template)}
          active={value}
          title={'通过模版创建应用'}
          subTitle={'您可以通过Github、Gitee等仓库，快速导入符合Serverless-CD规范的应用'}
        />
      </Row>
    </div>
  );
};

export default CreateType;
