import * as React from 'react';
import { history } from 'ice';
import { Breadcrumb, Box, Typography } from '@alicloud/console-components';
import styles from './index.module.css';
import { CopyOutlined } from '@ant-design/icons';

const PageHeader = (props) => {
  const { breadcrumbs, title, description, breadcrumbExtra, subhead, ...others } = props;
  return (
    <Box spacing={8} className={styles.pageHeader} {...others}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb className={styles.breadcrumbs} separator=" > ">
          {breadcrumbs.map((item, idx) => (
            <Breadcrumb.Item
              className="cursor-pointer"
              key={idx}
              onClick={() => history?.push(item.path)}
            >
              {item.name}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      ) : null}

      <div className="flex-r" style={{ alignItems: 'self-end' }}>
        {title && (
          <div className="align-center">
            <Typography.Text className={styles.title}>{title}</Typography.Text>
            {subhead && <span className="ml-8">{subhead}</span>}
          </div>
        )}
        <div> {breadcrumbExtra && breadcrumbExtra}</div>
      </div>

      {description && (
        <Typography.Text className={styles.description}>{description}</Typography.Text>
      )}
      <CopyOutlined className="cursor-pointer copy-icon" style={{ cursor: 'pointer' }}/>
    </Box>
  );
};

export default PageHeader;
