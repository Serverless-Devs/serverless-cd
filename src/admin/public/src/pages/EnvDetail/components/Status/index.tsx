import React, { memo, useMemo } from 'react';
import { Icon } from '@alicloud/console-components';
import { isEmpty } from 'lodash';
import { DEPLOY_STATUS, DEPLOY } from '@/constants';
import { MinusCircleOutlined } from '@ant-design/icons';

type Props = {
  status: string;
  showLabel?: boolean;
  className?: any;
};
const Status = (props: Props) => {
  const { className, status, showLabel = true } = props;
  const found = DEPLOY_STATUS[status];

  const icon = useMemo(() => {
    if (status === DEPLOY.SKIP) {
      return <MinusCircleOutlined className={`mr-4 ${found.color}`} />;
    }
    return <Icon type={found.icon} className={`mr-4 ${found.color}`} size="small" />;
  }, []);
  return (
    <>
      {!isEmpty(found) && (
        <span className={className} style={{ whiteSpace: 'nowrap' }}>
          {icon}
          {showLabel && <span className="text-middle">{found.label}</span>}
        </span>
      )}
    </>
  );
};
export default memo(Status);
