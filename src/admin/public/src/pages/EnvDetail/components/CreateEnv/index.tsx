import React, { FC, useRef, useEffect } from 'react';
import { useRequest } from 'ice';
import SlidePanel from '@alicloud/console-components-slide-panel';
import { Form, Field, Input, Select } from '@alicloud/console-components';
import { FORM_ITEM_LAYOUT } from '@/constants';
import Trigger, { valuesFormat } from '@serverless-cd/trigger-ui';
import { updateApp } from '@/services/applist';
import { githubBranches } from '@/services/git';
import Env, { validteEnv } from '@/pages/Create/components/github/Env';
import ConfigEdit from '@/components/ConfigEdit';
import { TYPE as ENV_TYPE } from '@/components/EnvType';
import { Toast } from '@/components/ToastContainer';
import { get, keys, isEmpty, map } from 'lodash';
import { getConsoleConfig } from '@/utils';
import { orgDetail } from '@/services/org';

const FormItem = Form.Item;

type IProps = {
  data: any;
  appId: string;
  callback: (envName: string) => Promise<any>;
};

const CreateEnv: FC<IProps> = (props) => {
  const { children, data, appId, callback } = props;
  const { request, loading } = useRequest(updateApp);
  const branchReq = useRequest(githubBranches);
  const [visible, setVisible] = React.useState(false);
  const field = Field.useField();
  const { init, resetToDefault, validate } = field;
  const triggerRef: any = useRef(null);
  const secretsRef: any = useRef(null);
  const CD_PIPELINE_YAML = getConsoleConfig('CD_PIPELINE_YAML', 'serverless-pipeline.yaml');
  const orgDetailRequest = useRequest(orgDetail);
  const cloudData = get(orgDetailRequest.data, 'data.cloud_secret', {});

  useEffect(() => {
    orgDetailRequest.request();
  }, []);

  useEffect(() => {
    if (visible) {
      const { repo_owner, repo_name } = data;
      if (repo_owner && repo_name) branchReq.request({ owner: repo_owner, repo: repo_name });
    }
  }, [visible]);

  const handleClose = () => {
    resetToDefault();
    setVisible(false);
  };
  const handleOK = async () => {
    validate(async (errors, values) => {
      const res = await triggerRef?.current?.validate();
      const secretsRes = await secretsRef?.current?.validate();
      if (errors || !res || !secretsRes) return;

      const provider = get(data, 'provider');
      const envInfo: any = get(values, 'environment', {});
      const secrets = get(values, 'secrets', []);
      const environment = {
        ...get(data, 'environment'),
        [envInfo.name]: {
          created_time: Date.now(),
          type: envInfo.type,
          secrets: secrets,
          trigger_spec: {
            [provider]: valuesFormat(values['trigger']),
          },
          cloud_alias: get(values, 'cloud_alias', ''),
          cd_pipeline_yaml: values['cd_pipeline_yaml'],
        },
      };
      const { success } = await request({ environment, appId, provider });
      if (success) {
        Toast.success('创建环境成功');
        setVisible(false);
        resetToDefault();
        await callback(envInfo.name);
      }
    });
  };

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
    <>
      <span onClick={() => setVisible(true)}>{children}</span>
      <SlidePanel
        title={'创建环境'}
        width="large"
        isShowing={visible}
        onClose={handleClose}
        onOk={handleOK}
        onCancel={handleClose}
        isProcessing={loading}
      >
        <Form field={field} {...FORM_ITEM_LAYOUT}>
          <FormItem label="环境" required>
            <Env
              {...(init('environment', {
                initValue: { name: '', type: ENV_TYPE.TESTING },
                rules: [
                  {
                    validator: (rule, values, callback) => {
                      validteEnv(rule, values, callback, {
                        existEnvs: keys(get(data, 'environment')),
                      });
                    },
                  },
                ],
              }) as any)}
            />
          </FormItem>
          <FormItem label="触发方式" required>
            <Trigger
              {...(init('trigger') as any)}
              mode="strict"
              loading={branchReq.loading}
              branchList={getBranchList()}
              ref={triggerRef}
            />
          </FormItem>
          <FormItem label="指定yaml" required>
            <Input
              {...init('cd_pipeline_yaml', {
                initValue: CD_PIPELINE_YAML,
                rules: [{ required: true, message: '请输入yaml文件名称' }],
              })}
            />
          </FormItem>
          <FormItem label="Secrets">
            <ConfigEdit {...init('secrets')} ref={secretsRef} />
          </FormItem>
          <FormItem label="关联云账号">
            <Select
              {...(init('cloud_alias') as any)}
              className="full-width"
              placeholder="请选择"
              dataSource={map(keys(cloudData), (item) => ({ label: item, value: item }))}
            />
            {/* <ConfigEdit {...init('secrets')} ref={secretsRef} /> */}
          </FormItem>
        </Form>
      </SlidePanel>
    </>
  );
};

export default CreateEnv;
