import React, { useEffect, useState } from 'react';
import { useRequest } from 'ice';
import { Button, Drawer, Field, Form } from '@alicloud/console-components';
import PageInfo from '@/components/PageInfo';
import { Toast } from '@/components/ToastContainer';
import { updateApp } from '@/services/applist';
import { get, noop, isEmpty, uniqueId } from 'lodash';
import Trigger from '@serverless-cd/trigger-ui';

export const validateTrigger = (rule, value, callback) => {
  if (isEmpty(get(value, 'push')) && isEmpty(get(value, 'pr'))) {
    return callback('请选择触发方式');
  } else if (
    isEmpty(get(value, 'push.branches')) &&
    isEmpty(get(value, 'push.tags')) &&
    isEmpty(get(value, 'pr.branches'))
  ) {
    return callback('触发方式数据填写不完整');
  }
  callback();
};

const TriggerConfig = ({ triggerSpec, provider, appId, refreshCallback, data, envName }) => {
  const { request, loading } = useRequest(updateApp);
  const [visible, setVisible] = useState(false);
  const [triggerKey, setTriggerKey] = useState(uniqueId());
  const field = Field.useField();
  const { init, resetToDefault, validate } = field;

  const onSubmit = () => {
    validate(async (errors, values) => {
      if (errors) return;
      const environment = get(data, 'environment');
      environment[envName].trigger_spec = {
        [provider]: values['trigger'],
      };
      try {
        const { success } = await request({ environment, appId, provider });
        if (success) {
          Toast.success('配置成功');
          refreshCallback && refreshCallback();
          setVisible(false);
        }
      } catch (error) {
        Toast.error(error.message);
      }
    });
  };

  const onClose = () => {
    setVisible(false);
    resetToDefault();
  };

  useEffect(() => {
    setTriggerKey(uniqueId());
  }, [triggerSpec]);

  return (
    <PageInfo
      title="触发配置"
      extra={
        <Button type="primary" text onClick={() => setVisible(true)}>
          编辑
        </Button>
      }
    >
      <div className="mt-16 pl-16 pr-32" key={triggerKey}>
        {triggerSpec[provider] && (
          <Trigger value={triggerSpec[provider]} onChange={noop} disabled />
        )}
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
            <Form.Item>
              <Trigger
                {...(init('trigger', {
                  initValue: triggerSpec[provider],
                  rules: [
                    {
                      validator: validateTrigger,
                    },
                  ],
                }) as any)}
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
