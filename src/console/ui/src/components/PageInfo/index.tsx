import * as React from 'react';
import { Box } from '@alicloud/console-components';

interface Props {
  title: string;
  extra?: React.ReactNode | string;
  children?: React.ReactNode;
}

const PageInfo = (props: Props) => {
  const { title, extra, children } = props;
  return (
    <Box spacing={8} >
      <div className="box-hd flex-r" style={{justifyContent: 'flex-start'}}>
        <h3 className='mr-10'>{title}</h3>
        {extra}
      </div>
      {children}
    </Box>
  );
};

export default PageInfo;
