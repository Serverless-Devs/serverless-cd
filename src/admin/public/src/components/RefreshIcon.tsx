import React, { memo } from 'react';
import { ReloadOutlined, LoadingOutlined } from '@ant-design/icons';

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
        <LoadingOutlined />
      ) : (
        <ReloadOutlined className="cursor-pointer" onClick={onRefresh}/>
      )}
    </div>
  );
};
export default memo(RefreshButton);
