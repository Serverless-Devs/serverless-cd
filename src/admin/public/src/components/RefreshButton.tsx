import React, { memo } from 'react';
import { Button, Icon } from '@alicloud/console-components';

interface Props {
  styleObj?: object;
  refreshCallback?: Function;
}

const RefreshButton = (props: Props) => {
  const { refreshCallback, styleObj } = props;

  const onRefresh = () => {
    refreshCallback && refreshCallback();
  };

  return (
    <Button style={styleObj} onClick={onRefresh}>
      <Icon type="redo" />
    </Button>
  );
};
export default memo(RefreshButton);
