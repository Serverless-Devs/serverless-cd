import React, { useRef } from 'react';
import { Form, Radio, Field, Input, Divider } from '@alicloud/console-components';
import { FORM_ITEM_LAYOUT } from '@/constants';
import AuthDialog from './AuthDialog';
import Repo from './Repo';
import Trigger from './Trigger';
import ConfigEdit from '@/components/ConfigEdit';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

interface IProps {
  field: Field;
}

const Github = (props: IProps) => {
  const { field } = props;
  const { init, getValue, resetToDefault } = field;
  const secretsRef: any = useRef(null);

  const secretsValidator = async (_, value, callback) => {
    let res = await secretsRef.current.validate();
    if (!res) return callback('error');
    callback();
  };

  return (
    <>
      <Form field={field} {...FORM_ITEM_LAYOUT}>
        <FormItem label="仓库类型" required>
          <RadioGroup
            className="git-type"
            shape="button"
            {...init('gitType', {
              initValue: 'github',
            })}
          >
            <Radio id="github" value="github">
              <div className="flex-c aling-item-c">
                <svg aria-label="github" height="20" viewBox="0 0 14 14" width="20">
                  <path
                    d="M7 .175c-3.872 0-7 3.128-7 7 0 3.084 2.013 5.71 4.79 6.65.35.066.482-.153.482-.328v-1.181c-1.947.415-2.363-.941-2.363-.941-.328-.81-.787-1.028-.787-1.028-.634-.438.044-.416.044-.416.7.044 1.071.722 1.071.722.635 1.072 1.641.766 2.035.59.066-.459.24-.765.437-.94-1.553-.175-3.193-.787-3.193-3.456 0-.766.262-1.378.721-1.881-.065-.175-.306-.897.066-1.86 0 0 .59-.197 1.925.722a6.754 6.754 0 0 1 1.75-.24c.59 0 1.203.087 1.75.24 1.335-.897 1.925-.722 1.925-.722.372.963.131 1.685.066 1.86.46.48.722 1.115.722 1.88 0 2.691-1.641 3.282-3.194 3.457.24.219.481.634.481 1.29v1.926c0 .197.131.415.481.328C11.988 12.884 14 10.259 14 7.175c0-3.872-3.128-7-7-7z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span>GitHub</span>
              </div>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="仓库用户/组织" required>
          <AuthDialog
            reset={resetToDefault}
            {...init('gitUser', {
              rules: [
                {
                  required: true,
                  message: '请选择仓库用户/组织',
                },
              ],
            })}
          />
        </FormItem>
        <FormItem label="仓库名称" required>
          <Repo
            field={field}
            {...(init('repo', {
              rules: [
                {
                  required: true,
                  message: '请选择仓库名称',
                },
              ],
            }) as any)}
          />
        </FormItem>
        <FormItem label="描述">
          <Input {...init('description')} placeholder="请输入描述" />
        </FormItem>
        <Divider className="mt-32" />
        <div className="text-bold mt-16 mb-16">环境配置</div>
        <FormItem label="触发方式" required>
          <Trigger repo={getValue('repo')} {...(init('trigger') as any)} />
        </FormItem>
        <FormItem label="Secrets" help="">
          <ConfigEdit
            {...init('secrets', {
              rules: [{ validator: secretsValidator }],
            })}
            ref={secretsRef}
          />
        </FormItem>
      </Form>
    </>
  );
};

export default Github;
