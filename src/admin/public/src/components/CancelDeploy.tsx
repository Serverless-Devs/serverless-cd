import React, { useState } from 'react';
import { Button, Dialog } from '@alicloud/console-components';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { cancelDeployTask } from '@/services/task';
import { useRequest } from 'ice';
import { Toast } from '@/components/ToastContainer';

interface Props {
  appId: string;
  taskId: string;
  repoName: string;
  refreshCallback: Function;
  isText?: boolean;
}

const CancelDeploy = (props: Props) => {
  const { taskId, repoName, refreshCallback, isText = false } = props;
  const [visible, setVisible] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const { request } = useRequest(cancelDeployTask);

  const onClose = () => {
    setVisible(false);
  };

  const submit = async () => {
    setLoading(true);
    const { success, data } = await request({ taskId });
    if (success) {
      Toast.success('取消部署成功');
      refreshCallback && refreshCallback(data.taskId);
    }
    setLoading(false);
    onClose();
  };

  return (
    <>
      <Button onClick={() => setVisible(true)} type="primary" text={isText}>
        取消部署
      </Button>
      <Dialog
        title={
          <div>
            <ExclamationCircleOutlined style={{ color: '#ffc440', marginRight: 8 }} />
            取消部署 {repoName} 应用
          </div>
        }
        autoFocus
        visible={visible as any}
        onOk={onClose}
        onClose={onClose}
        style={{ width: 600 }}
        footer={[
          <Button type="primary" className="mr-16" onClick={submit} loading={loading as boolean}>
            确定
          </Button>,
          <Button type="normal" onClick={onClose} disabled={loading as boolean}>
            取消
          </Button>,
        ]}
      >
        <p style={{ margin: 0 }}>
          当前操作将取消当前部署版本，不会影响已部署的环境资源，您确定要取消部署应用 {repoName}吗？
        </p>
      </Dialog>
    </>
  );
};
export default CancelDeploy;
