import React, { FC } from 'react';
import { useRequest } from 'ice';
import SlidePanel from '@alicloud/console-components-slide-panel';
import { Form, Field } from '@alicloud/console-components';
import { FORM_ITEM_LAYOUT } from '@/constants';
import Trigger from '@serverless-cd/trigger-ui';
import { updateApp } from '@/services/applist';
import { validateTrigger } from '@/pages/EnvDetail/components/TriggerConfig';
import Env, { validteEnv } from '@/pages/Create/components/github/Env';
import ConfigEdit from '@/components/ConfigEdit';
import { TYPE as ENV_TYPE } from '@/components/EnvType';
import { Toast } from '@/components/ToastContainer';
import { get, noop, each } from 'lodash';

const FormItem = Form.Item;

type IProps = {
  data: any;
  appId: string;
  refresh?: () => void;
};

const CreateEnv: FC<IProps> = (props) => {
  console.log('CreateEnv props', props);

  const { children, data, appId, refresh = noop } = props;
  const { request, loading } = useRequest(updateApp);
  const [visible, setVisible] = React.useState(false);
  const field = Field.useField();
  const { init, resetToDefault, validate } = field;
  const handleClose = () => {
    resetToDefault();
    setVisible(false);
  };
  const handleOK = async () => {
    validate(async (errors, values) => {
      if (errors) return;
      const provider = get(data, 'provider');
      const envInfo: any = get(values, 'environment', {});
      const secrets = get(values, 'secrets', []);
      const newSecrets = {};
      each(secrets, ({ key, value }) => {
        newSecrets[key] = value;
      });
      const environment = {
        ...get(data, 'environment'),
        [envInfo.name]: {
          created_time: Date.now(),
          type: envInfo.type,
          secrets: newSecrets,
          trigger_spec: {
            [provider]: values['trigger'],
          },
        },
      };
      try {
        const { success } = await request({ environment, appId, provider });
        if (success) {
          Toast.success('创建环境成功');
          refresh();
          setVisible(false);
          resetToDefault();
        }
      } catch (error) {
        Toast.error(error.message);
      }
    });
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
                    validator: validteEnv,
                  },
                ],
              }) as any)}
            />
          </FormItem>
          <FormItem label="触发方式" required>
            <Trigger
              {...(init('trigger', {
                rules: [
                  {
                    validator: validateTrigger,
                  },
                ],
              }) as any)}
            />
          </FormItem>
          <FormItem label="Secrets">
            <ConfigEdit field={field} />
          </FormItem>
        </Form>
      </SlidePanel>
    </>
  );
};

export default CreateEnv;
