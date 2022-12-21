import React, { PureComponent, ReactElement } from 'react';
import { Grid } from '@alicloud/console-components';
const { Row, Col } = Grid;

type Item = {
  text: string | ReactElement;
  value: any;
  hidden?: boolean;
};

type Props = {
  items: Item[];
  title: any;
  sizePerRow?: number;
  padding?: string;
  editButton?: any;
  content?: any;
  textDescClass?: string;
};

class BasicInfo extends PureComponent<Props> {
  render() {
    let {
      title,
      items = [],
      sizePerRow = 2,
      padding = 'p-12',
      editButton,
      content,
      textDescClass = '',
    } = this.props;

    const rows: Item[][] = [];

    items = items.filter((item) => !item.hidden);

    for (let i = 0; i < items.length; i++) {
      if (i % sizePerRow === 0) {
        rows.push([items[i]]);
      } else {
        rows[rows.length - 1].push(items[i]);
      }
    }

    const span = 24 / sizePerRow;

    return (
      <>
        {title && (
          <Row>
            <Col span="24">
              <div className="flex-r">
                <div className="baseline">
                  <div className="box-hd">
                    <h3>{rows.length > 0 && title}</h3>
                  </div>
                  {editButton && <div className="ml-20">{editButton}</div>}
                </div>
                <div>{content}</div>
              </div>
            </Col>
          </Row>
        )}
        {rows.map((row, index) => (
          <Row key={index}>
            {row.map((item, index) => {
              return (
                <Col key={index} span={span}>
                  <Row className={padding}>
                    <Col align="baseline" className={`text-description ${textDescClass}`} span="8">
                      {item.text}
                    </Col>
                    <Col align="baseline" span="16">
                      {item.value || '--'}
                    </Col>
                  </Row>
                </Col>
              );
            })}
          </Row>
        ))}
      </>
    );
  }
}

export default BasicInfo;
