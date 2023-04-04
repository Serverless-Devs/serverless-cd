import React, { FC } from 'react';
import { useRequest, history } from 'ice';
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
  const { pathname } = window.location;
  const { request, refresh, loading } = useRequest(updateOrg);
  const field = Field.useField({
    values: find(listOrgs, (item: any) => item.name === orgName),
  });
  const { init, validate } = field;

  const onSubmit = async () => {
    validate(async (errors, values: any) => {
      if (errors) return;
      const params = {
        name: values.name,
        alias: values.alias,
        logo: values.Logo,
        description: values.description,
      };
      const { success } = await request({ ...params, orgName: orgName });
      if (success) {
        Toast.success('保存成功');
        refresh();
        history?.push(`/${orgName}/setting/org?orgRefresh=${new Date().getTime()}`);
      }
    });
  };
  return (
    <Form field={field} {...FORM_ITEM_LAYOUT} className="page-content">
       <FormItem label="团队地址" required>
        <Input disabled
          {...init('host', {
            initValue: window.location.host,
          })
          }
          style={{ width: '20%' }}
        />
        <Input disabled
          {...init('name', {
            rules: [
              {
                required: true,
                message: '请输入团队地址',
              },
            ],
          })}
          style={{ width: '55%' }}
        />
        <Input disabled
          {...init('pathname', {
            initValue: `/${pathname.split('/').slice(2).join('/')}`,
          })
          }
          style={{ width: '25%' }}
        />
      </FormItem>
      <FormItem label="团队名称" required>
        <Input {...init('alias', {
          rules: [
            {
              required: true,
              message: '请输入团队名称',
            },
          ],
        })} />
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
