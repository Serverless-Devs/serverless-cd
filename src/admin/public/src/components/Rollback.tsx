import React, { useState, FC } from 'react';
import { Button, Dialog } from '@alicloud/console-components';
import { redeployTask } from '@/services/task';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useRequest } from 'ice';
import { Toast } from '@/components/ToastContainer';
import { sleep } from '@/utils';

interface IProps {
  appId: string;
  disabled: boolean;
  taskId: string;
  refreshCallback?: Function;
}

const Rollback: FC<IProps> = ({ disabled, refreshCallback, appId, taskId }) => {
  const [visible, setVisible] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const { request } = useRequest(redeployTask);

  const onClose = () => {
    setVisible(false);
  };

  const submit = async () => {
    setLoading(true);
    const { success, data } = await request({ taskId, appId, triggerType: 'rollback' });
    if (success) {
      await sleep(2800);
      Toast.success('回滚请求成功');
      refreshCallback && refreshCallback(data.taskId);
    }
    setLoading(false);
    onClose();
  };

  return (
    <>
      <Button
        disabled={disabled}
        onClick={() => setVisible(true)}
        type="primary"
        text
      >
        回滚
      </Button>
      <Dialog
        title={<><ExclamationCircleFilled style={{ color: '#ffc440', marginRight: 8 }} />回滚</>}
        autoFocus
        visible={visible as any}
        onOk={onClose}
        onClose={onClose}
        style={{ width: 600 }}
        className="rollback-dialog"
        footer={[
          <Button className='mr-16' type="primary" onClick={submit} loading={loading as boolean}>
            确定
          </Button>,
          <Button type="normal" onClick={onClose} disabled={loading as boolean}>
            取消
          </Button>,
        ]}
      >
        {`确定基于 ${taskId} 创建一个新的部署版本吗？`}
      </Dialog>
    </>
  );
};
export default Rollback;
