import React, { FC } from 'react';
import { useRequest, history } from 'ice';
import PageLayout from '@/layouts/PageLayout';
import { FORM_ITEM_LAYOUT } from '@/constants';
import { Toast } from '@/components/ToastContainer';
import { createOrg, updateOrg } from '@/services/org';
import { Form, Field, Input, Button } from '@alicloud/console-components';
import { getParam } from '@/utils';
import store from '@/store';
import { find, get } from 'lodash';

const FormItem = Form.Item;

type Props = {};

const CreateOrg: FC<Props> = (props) => {
  const type = getParam('type');
  const orgName = getParam('orgName');
  const [userState] = store.useModel('user');
  const listOrgs = get(userState, 'userInfo.listOrgs.result', []);

  const { request, loading } = useRequest(type === 'edit' ? updateOrg : createOrg);
  const field = Field.useField({
    values: type === 'edit' ? find(listOrgs, (item: any) => item.name === orgName) : {},
  });
  const { init, validate } = field;

  const onSubmit = async () => {
    validate(async (errors, values) => {
      if (errors) return;
      const { success } = await request(type === 'edit' ? { ...values, orgName: orgName } : values);
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
          name: type === 'edit' ? '团队设置' : '新建团队',
        },
      ]}
    >
      <Form field={field} {...FORM_ITEM_LAYOUT}>
        <FormItem label="团队名称" required>
          <Input
            disabled={type === 'edit'}
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
        <FormItem label="团队别名">
          <Input {...init('alias')} />
        </FormItem>
        <FormItem label="Logo">
          <Input {...init('logo')} />
        </FormItem>
        <FormItem label="描述">
          <Input {...init('description')} />
        </FormItem>
        <FormItem className="mt-32">
          <Button type="primary" onClick={onSubmit} loading={loading}>
            {type === 'edit' ? '保存' : '创建'}
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
