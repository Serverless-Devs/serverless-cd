import React, { memo } from 'react';
import { Icon } from '@alicloud/console-components';
import { isEmpty } from 'lodash';
import { DEPLOY_STATUS } from '@/constants';

type Props = {
  status: string;
  showLabel?: boolean;
  className?: any;
};
const Status = (props: Props) => {
  const { className, status, showLabel = true } = props;
  const found = DEPLOY_STATUS[status];

  return (
    <>
      {!isEmpty(found) && (
        <span className={className} style={{ whiteSpace: 'nowrap' }}>
          <Icon type={found.icon} className={`mr-4 ${found.color}`} size="small" />
          {showLabel && <span className="text-middle">{found.label}</span>}
        </span>
      )}
    </>
  );
};
export default memo(Status);
