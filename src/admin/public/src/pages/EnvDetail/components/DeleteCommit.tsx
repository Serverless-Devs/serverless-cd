import React, { memo } from 'react';
import { Button, Dialog } from '@alicloud/console-components';
import { useRequest } from 'ice';
import { removeTaskCommit } from '@/services/task';

interface Props {
  appId: string;
  taskId: string;
  updatedTime: string;
  refreshCallback?: Function;
}

const DeleteCommit = (props: Props) => {
  const { taskId, refreshCallback, updatedTime } = props;
  const { loading, request } = useRequest(removeTaskCommit);

  const onDelete = () => {
    Dialog.confirm({
      title: <h3 style={{ margin: 0 }}>{`删除版本 ${taskId}`}<span className='fz-12' style={{color: '#787878'}}>({updatedTime})</span></h3>,
      content: (
        <span style={{ fontSize: 12 }}>
          当前操作仅删除部署记录，不会影响已部署的环境资源，您确定要删除版本记录
        </span>
      ),
      onOk: async () => {
        await request({ taskId });
        refreshCallback && refreshCallback();
      },
    });
  };

  return (
    <Button type="primary" text onClick={onDelete} disabled={loading}>
      删除
    </Button>
  );
};
export default memo(DeleteCommit);
