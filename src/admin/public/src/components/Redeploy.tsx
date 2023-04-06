import React, { useState } from 'react';
import { Button, Dialog, Icon } from '@alicloud/console-components';
import { redeployTask } from '@/services/task';
import { useRequest } from 'ice';
import { Toast } from '@/components/ToastContainer';
import { sleep } from '@/utils/index';

interface Props {
  appId: string;
  taskId: string;
  disabled: boolean;
  repoName: string;
  refreshCallback: Function;
}

const Redeploy = (props: Props) => {
  const { taskId, disabled, repoName, refreshCallback, appId } = props;
  const [visible, setVisible] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const { request } = useRequest(redeployTask);

  const onClose = () => {
    setVisible(false);
  };

  const submit = async () => {
    setLoading(true);
    const { success, data } = await request({ taskId, appId, triggerType: 'redeploy' });
    if (success) {
      await sleep(3000);
      Toast.success('部署成功');
      refreshCallback && refreshCallback(data.taskId);
    }
    setLoading(false);
    onClose();
  };

  return (
    <>
      <Button disabled={disabled} onClick={() => setVisible(true)} type="primary">
        重新部署
      </Button>
      <Dialog
        title={
          <div>
            <Icon size="small" type="warning" style={{ color: '#ffc440', marginRight: 8 }} />
            重新部署 {repoName} 应用
          </div>
        }
        autoFocus
        visible={visible as any}
        onOk={onClose}
        onClose={onClose}
        style={{ width: 600 }}
        footer={[
          <Button type="primary" className='mr-16' onClick={submit} loading={loading as boolean}>
            确定
          </Button>,
          <Button type="normal" onClick={onClose} disabled={loading as boolean}>
            取消
          </Button>,
        ]}
      >
        <p style={{ margin: 0 }}>
          当前操作将基于版本
          <span className="color-link ml-5 mr-5">{taskId}</span>
          创建一个新的部署版本，您确认要重新部署吗？
        </p>
      </Dialog>
    </>
  );
};
export default Redeploy;
