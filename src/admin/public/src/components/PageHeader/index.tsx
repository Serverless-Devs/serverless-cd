import * as React from 'react';
import { Breadcrumb, Box, Typography } from '@alicloud/console-components';
import styles from './index.module.css';

const PageHeader = (props) => {
  const { breadcrumbs, title, description, breadcrumbExtra, subhead, ...others } = props;
  return (
    <Box spacing={8} className={styles.pageHeader} {...others}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb className={styles.breadcrumbs} separator=" / ">
          {breadcrumbs.map((item, idx) => (
            <Breadcrumb.Item key={idx} link={item.path}>
              {item.name}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      ) : null}

      <div className="flex-r" style={{ alignItems: 'self-end' }}>
        {title && (
          <div className="flex-r" style={{ alignItems: 'flex-start' }}>
            <Typography.Text className={styles.title}>{title}</Typography.Text>
            {subhead && (
              <span className="ml-8" style={{ lineHeight: '24px' }}>
                {subhead}
              </span>
            )}
          </div>
        )}
        <div> {breadcrumbExtra && breadcrumbExtra}</div>
      </div>

      {description && (
        <Typography.Text className={styles.description}>{description}</Typography.Text>
      )}
    </Box>
  );
};

export default PageHeader;
