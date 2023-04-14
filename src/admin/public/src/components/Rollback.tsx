import React, { useState, FC } from 'react';
import { Button, Dialog, Checkbox } from '@alicloud/console-components';
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
  btnText?: string;
}

const Rollback: FC<IProps> = ({ disabled, refreshCallback, appId, taskId, btnText }) => {
  const [useDebug, setDebug] = useState<boolean | undefined>(false);
  const [visible, setVisible] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const { request } = useRequest(redeployTask);

  const onClose = () => {
    setVisible(false);
  };

  const submit = async () => {
    setLoading(true);
    const { success, data } = await request({ useDebug, taskId, appId, triggerType: 'rollback' });
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
      <Button disabled={disabled} onClick={() => setVisible(true)} type="primary" text>
        {btnText || '回滚'}
      </Button>
      <Dialog
        title={
          <>
            <ExclamationCircleFilled style={{ color: '#ffc440', marginRight: 8 }} />
            回滚
          </>
        }
        autoFocus
        visible={visible as any}
        onOk={onClose}
        onClose={onClose}
        style={{ width: 600 }}
        className="rollback-dialog"
        footer={
          <div className="flex-r">
            <div>
              <Checkbox checked={useDebug} onChange={setDebug} label="开启 Debug 日志" />
            </div>
            <div>
              <Button
                type="primary"
                className="mr-16"
                onClick={submit}
                loading={loading as boolean}
              >
                确定
              </Button>
              <Button type="normal" onClick={onClose} disabled={loading as boolean}>
                取消
              </Button>
            </div>
          </div>
        }
      >
        {`确定基于 ${taskId} 创建一个新的部署版本吗？`}
      </Dialog>
    </>
  );
};
export default Rollback;
