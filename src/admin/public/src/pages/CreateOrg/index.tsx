import React, { FC } from 'react';
import { useRequest, history } from 'ice';
import PageLayout from '@/layouts/PageLayout';
import { FORM_ITEM_LAYOUT } from '@/constants';
import { Toast } from '@/components/ToastContainer';
import { createOrg } from '@/services/org';
import { Form, Field, Input, Button } from '@alicloud/console-components';

const FormItem = Form.Item;

type Props = {};

const CreateOrg: FC<Props> = (props) => {
  const { request, loading } = useRequest(createOrg);
  const field = Field.useField();
  const { init, validate } = field;

  const onSubmit = async () => {
    validate(async (errors, values) => {
      if (errors) return;
      const { success } = await request(values);
      if (success) {
        Toast.success('创建团队成功');
        history?.push('/organizations');
      }
    });
  };
  return (
    <PageLayout
      breadcrumbs={[
        {
          name: '团队列表',
          path: '/organizations',
        },
        {
          name: '新建团队',
        },
      ]}
    >
      <Form field={field} {...FORM_ITEM_LAYOUT}>
        <FormItem label="团队名称" required>
          <Input
            {...init('name', {
              rules: [
                {
                  required: true,
                  message: '请输入团队名称',
                },
              ],
            })}
          />
        </FormItem>
        <FormItem label="团队别名" required>
          <Input
            {...init('alias', {
              rules: [
                {
                  required: true,
                  message: '请输入团队别名',
                },
              ],
            })}
          />
        </FormItem>
        <FormItem label="Logo">
          <Input {...init('logo')} />
        </FormItem>
        <FormItem label="描述">
          <Input {...init('description')} />
        </FormItem>
        <FormItem className="mt-32">
          <Button type="primary" onClick={onSubmit} loading={loading}>
            创建
          </Button>
          <Button className="ml-16" onClick={() => history?.goBack()}>
            取消
          </Button>
        </FormItem>
      </Form>
    </PageLayout>
  );
};

export default CreateOrg;
