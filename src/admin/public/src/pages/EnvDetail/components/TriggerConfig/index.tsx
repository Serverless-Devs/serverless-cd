import React, { useEffect, useState, useRef } from 'react';
import { useRequest } from 'ice';
import { Button, Field, Form, Input } from '@alicloud/console-components';
import PageInfo from '@/components/PageInfo';
import { Toast } from '@/components/ToastContainer';
import { updateApp } from '@/services/applist';
import { githubBranches } from '@/services/git';
import { get, isEmpty, map } from 'lodash';
import Trigger, { valuesFormat } from '@serverless-cd/trigger-ui';
import { FORM_ITEM_LAYOUT } from '@/constants';
import SlidePanel from '@alicloud/console-components-slide-panel';

const TriggerConfig = ({ triggerSpec, provider, appId, refreshCallback, data, envName }) => {
  const { request, loading } = useRequest(updateApp);
  const branchReq = useRequest(githubBranches);
  const [visible, setVisible] = useState(false);
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
      environment[envName].cd_pipeline_yaml = values['cd_pipeline_yaml'];
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
    if (visible) {
      const { repo_owner, repo_name } = data;
      if (repo_owner && repo_name) branchReq.request({ owner: repo_owner, repo: repo_name });
    }
  }, [visible]);
  const getBranchList = () => {
    if (isEmpty(branchReq.data)) return [];
    const newData = map(branchReq.data, (item) => ({
      ...item,
      label: item.name,
      value: item.name,
    }));
    return newData;
  };

  return (
    <PageInfo
      title="触发配置"
      extra={
        <Button type="primary" text onClick={() => setVisible(true)}>
          编辑
        </Button>
      }
    >
      <SlidePanel
        title="编辑触发配置"
        width="large"
        isShowing={visible}
        onClose={onClose}
        onCancel={onClose}
        className="dialog-drawer"
        isProcessing={loading}
        onOk={onSubmit}
      >
        <div className="dialog-body">
          <Form field={field} {...FORM_ITEM_LAYOUT}>
            <Form.Item label="触发条件">
              <Trigger
                {...(init('trigger', {
                  initValue: triggerSpec[provider],
                  rules: [
                    {
                      validator: validateTrigger,
                    },
                  ],
                }) as any)}
                mode="strict"
                loading={branchReq.loading}
                branchList={getBranchList()}
                ref={triggerRef}
              />
            </Form.Item>
            <Form.Item label="指定yaml" required>
              <Input
                {...init('cd_pipeline_yaml', {
                  initValue: get(data, `environment.${envName}.cd_pipeline_yaml`),
                  rules: [{ required: true, message: '请输入yaml文件名称' }],
                })}
              />
            </Form.Item>
          </Form>
        </div>
      </SlidePanel>
    </PageInfo>
  );
};

export default TriggerConfig;
