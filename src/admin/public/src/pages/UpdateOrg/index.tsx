import React, { FC } from 'react';
import { useRequest } from 'ice';
import { FORM_ITEM_LAYOUT } from '@/constants';
import { Toast } from '@/components/ToastContainer';
import { updateOrg } from '@/services/org';
import { Form, Field, Input, Button } from '@alicloud/console-components';
import store from '@/store';
import { find, get } from 'lodash';

const FormItem = Form.Item;

type Props = {
  match: Record<string, any>;
};

const UpdateOrg: FC<Props> = ({ match }) => {
  const orgName = get(match, 'params.orgName');
  const [userState] = store.useModel('user');
  const listOrgs = get(userState, 'userInfo.listOrgs.result', []);

  const { request, loading } = useRequest(updateOrg);
  const field = Field.useField({
    values: find(listOrgs, (item: any) => item.name === orgName),
  });
  const { init, validate } = field;

  const onSubmit = async () => {
    validate(async (errors, values) => {
      if (errors) return;
      const { success } = await request({ ...values, orgName: orgName });
      if (success) {
        Toast.success('保存成功');
      }
    });
  };
  return (
    <Form field={field} {...FORM_ITEM_LAYOUT} className="page-content">
      <FormItem label="团队名称" required>
        <Input
          disabled
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
          保存
        </Button>
      </FormItem>
    </Form>
  );
};

export default UpdateOrg;
