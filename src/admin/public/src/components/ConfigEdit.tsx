import React, { forwardRef, useEffect, useState } from 'react';
import { Button, Form } from '@alicloud/console-components';
import SecretForm from '@/pages/Create/components/github/Secret';
import JsonEditor from '@/components/JsonEditor';
import { isEmpty, keys, map, uniqueId } from 'lodash';
import '@/styles/secrets.less';

interface Props {
  secretsData?: object;
  field: object | any;
}

const FormItem = Form.Item;

const ConfigEdit = ({ secretsData, field }: Props) => {
  const [editType, setEditType] = useState('form');
  const [jsonValue, setJsonValue] = useState('');
  const [jsonError, setJsonError] = useState(false);
  const { init, setValue, getValue } = field;

  // useEffect(() => {
  //   console.log(getValue('secrets'), 'secrets')
  // }, [getValue('secrets')])

  useEffect(() => {
    if (isEmpty(secretsData)) {
      setJsonValue('');
    } else {
      setJsonValue(JSON.stringify(secretsData, null, 4));
    }
  }, [secretsData]);

  const onJsonValueChanged = (value) => {
    setJsonError(false);
    setJsonValue(value);
    if (!value) {
      field.setError('secretsJon', '');
      return;
    }
    try {
      let newValue = JSON.parse(value);
      newValue = map(keys(newValue), (key) => {
        return {
          key,
          value: newValue[key],
          showPassword: true,
          id: uniqueId(),
        };
      });
      setValue('secrets', newValue);
      field.setError('secretsJon', null);
    } catch (e) {
      setJsonError(true);
      field.setError('secretsJon', '您输入的 JSON 格式不正确。');
    }
  };

  return (
    <div>
      <div>
        <Button
          className={editType === 'form' ? 'btn-active mr-8' : 'mr-8'}
          onClick={() => setEditType('form')}
          disabled={jsonError}
          type="normal"
        >
          使用表单编辑
        </Button>
        <Button
          className={editType === 'json' ? 'btn-active mr-8' : 'mr-8'}
          onClick={() => setEditType('json')}
          type="normal"
        >
          使用 JSON 格式编辑
        </Button>
      </div>
      <hr className="mt-20 mb-20" />
      {editType === 'form' ? (
        <SecretForm {...init('secrets')} />
      ) : (
        <Form field={field}>
          <FormItem>
            <JsonEditor
              {...init('secretsJon')}
              value={jsonValue}
              height={'auto'}
              width={'100%'}
              onChange={onJsonValueChanged}
            />
          </FormItem>
        </Form>
      )}
    </div>
  );
};

export default forwardRef(ConfigEdit);
