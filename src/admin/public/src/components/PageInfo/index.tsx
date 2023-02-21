import * as React from 'react';
import { Box } from '@alicloud/console-components';

interface Props {
  title?: string;
  extra?: React.ReactNode | string;
  endExtra?: React.ReactNode | string;
  children?: React.ReactNode;
}

const PageInfo = (props: Props) => {
  const { title, extra, children, endExtra } = props;
  return (
    <Box spacing={32}>
      <div className="box-hd flex-r" style={{ justifyContent: 'space-between' }}>
        <div className="flex-r">
          {title && <h3 className="mr-10">{title}</h3>}
          {extra}
        </div>
        <div>{endExtra}</div>
      </div>
      {children}
    </Box>
  );
};

export default PageInfo;
