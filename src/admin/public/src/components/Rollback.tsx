import React, { useEffect, useState, FC } from 'react';
import { Button, Dialog, Select } from '@alicloud/console-components';
import { redeployTask, getTaskList } from '@/services/task';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useRequest } from 'ice';
import { Toast } from '@/components/ToastContainer';
import { sleep } from '@/utils/index';
import Status from '@/components/DeployStatus';
import { map, get } from 'lodash';

interface IProps {
  appId: string;
  envName: string;
  disabled: boolean;
  refreshCallback: Function;
  application: object;
}

const Rollback: FC<IProps> = (props) => {
  const { disabled, refreshCallback, appId, application, envName } = props;
  const [visible, setVisible] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const [rollBackId, setRollBackId] = useState<String>('');
  const { request } = useRequest(redeployTask);
  const task = useRequest(getTaskList);

  useEffect(() => {
    if (visible) {
      task.request({ appId, envName, currentPage: 1, triggerType: 'remote' });
    }
  }, [visible]);

  const onClose = () => {
    setVisible(false);
  };

  const submit = async () => {
    setLoading(true);
    const { success, data } = await request({ taskId: rollBackId, appId, triggerType: 'rollback' });
    if (success) {
      await sleep(2800);
      Toast.success('部署成功');
      refreshCallback && refreshCallback(data.taskId);
    }
    setLoading(false);
    onClose();
  };

  const changeTaskId = (id: string) => {
    setRollBackId(id);
  };

  const taskId = get(application, `environment.${envName}.latest_task.taskId`, '');

  return (
    <>
      <Button
        disabled={disabled}
        className="ml-8"
        style={{ width: 76 }}
        onClick={() => setVisible(true)}
      >
        回滚
      </Button>
      <Dialog
        title={
          <div>
            <ExclamationCircleFilled  style={{ color: '#ffc440', marginRight: 8 }}/>
            回滚
          </div>
        }
        autoFocus
        visible={visible as any}
        onOk={onClose}
        onClose={onClose}
        style={{ width: 600 }}
        className="rollback-dialog"
        footer={[
          <Button type="primary" onClick={submit} loading={loading as boolean}>
            确定
          </Button>,
          <Button type="normal" onClick={onClose} disabled={loading as boolean}>
            取消
          </Button>,
        ]}
      >
        <p style={{ marginTop: 0 }}>
          当前操作将基于版本您指定的历史版本创建一个新的部署版本，请选择版本后点击确认。
        </p>
        <Select
          placeholder="请选择版本"
          style={{ width: '100%' }}
          autoWidth
          disabled={task.loading}
          onChange={changeTaskId}
          dataSource={map(get(task.data, 'result', []), (item) => {
            return {
              ...item,
              value: item.id,
              disabled: item.status !== 'success' || item.id === taskId,
              label: (
                <div className="space-between">
                  <span>
                    <Status status={item.status} showLabel={false} />
                    <span className="ml-8 mr-8">{item.id}</span>
                    {item.message && `( ${item.message} )`}
                    {item.id === taskId && <span className="ml-8">当前部署版本</span>}
                  </span>
                </div>
              ),
            };
          })}
        />
      </Dialog>
    </>
  );
};
export default Rollback;
