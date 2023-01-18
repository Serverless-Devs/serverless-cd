import React, { memo } from 'react';
import { Icon } from '@alicloud/console-components';

interface Props {
  refreshCallback?: Function;
  loading?: boolean;
  style?: object;
}

const RefreshButton = (props: Props) => {
  const { refreshCallback, loading = false, style } = props;

  const onRefresh = () => {
    refreshCallback && refreshCallback();
  };

  return (
    <div className="refresh-icon" style={style}>
      {loading ? (
        <Icon type="loading" size="xs" />
      ) : (
        <Icon type="redo" size="xs" className="cursor-pointer" onClick={onRefresh} />
      )}
    </div>
  );
};
export default memo(RefreshButton);
