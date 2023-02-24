import React, { useEffect, useState, useRef } from 'react';
import { useRequest } from 'ice';
import { Button, Drawer, Field, Form } from '@alicloud/console-components';
import PageInfo from '@/components/PageInfo';
import { Toast } from '@/components/ToastContainer';
import { updateApp } from '@/services/applist';
import { githubBranches } from '@/services/git';
import { get, isEmpty, uniqueId, map } from 'lodash';
import Trigger, { valuesFormat } from '@serverless-cd/trigger-ui';

const TriggerConfig = ({ triggerSpec, provider, appId, refreshCallback, data, envName }) => {
  const { request, loading } = useRequest(updateApp);
  const branchReq = useRequest(githubBranches);
  const [visible, setVisible] = useState(false);
  const [triggerKey, setTriggerKey] = useState(uniqueId());
  const field = Field.useField();
  const { init, resetToDefault, validate } = field;
  const triggerRef: any = useRef(null);

  const onSubmit = () => {
    validate(async (errors, values) => {
      if (errors) return;
      const environment = get(data, 'environment');
      environment[envName].trigger_spec = {
        [provider]: valuesFormat(values['trigger']),
      };
      const { success } = await request({ environment, appId, provider });
      if (success) {
        Toast.success('配置成功');
        refreshCallback && refreshCallback();
        setVisible(false);
      }
    });
  };

  const onClose = () => {
    setVisible(false);
    resetToDefault();
  };

  const validateTrigger = async (_, value, callback) => {
    const res = await triggerRef?.current?.validate();
    if (res) return callback();
    callback('error');
  };

  useEffect(() => {
    setTriggerKey(uniqueId());
  }, [triggerSpec]);

  useEffect(() => {
    if (visible) {
      const { owner, repo_name } = data
      if (owner && repo_name) branchReq.request({ owner: owner, repo: repo_name });
    }
  }, [visible])
  const getBranchList = () => {
    if (isEmpty(branchReq.data)) return []
    const newData = map(branchReq.data, item => (
      { ...item, label: item.name, value: item.name }
    ))
    return newData
  }

  return (
    <PageInfo
      title="触发配置"
      extra={
        <Button type="primary" text onClick={() => setVisible(true)}>
          编辑
        </Button>
      }
    >
      <div className="mt-16" key={triggerKey}>
        {triggerSpec[provider] && <Trigger.Preview dataSource={triggerSpec[provider]} />}
      </div>
      <Drawer
        title="编辑触发配置"
        placement="right"
        width="60%"
        style={{ margin: 0 }}
        visible={visible}
        onClose={onClose}
        className="dialog-drawer"
      >
        <div className="dialog-body">
          <Form field={field}>
            <Form.Item help="">
              <Trigger
                {...(init('trigger', {
                  initValue: triggerSpec[provider],
                  rules: [
                    {
                      validator: validateTrigger,
                    },
                  ],
                }) as any)}
                mode='strict'
                loading={branchReq.loading}
                branchList={getBranchList()}
                ref={triggerRef}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="dialog-footer">
          <Button className="mr-10" type="primary" loading={loading} onClick={onSubmit}>
            确定
          </Button>
          <Button type="normal" onClick={onClose}>
            取消
          </Button>
        </div>
      </Drawer>
    </PageInfo>
  );
};

export default TriggerConfig;
