import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Drawer, Field, Button } from '@alicloud/console-components';
import SecretForm from '@/pages/Create/components/github/Secret';
import JsonEditor from '@/components/JsonEditor';
import { isJson } from '@/utils';
import { isEmpty } from 'lodash';
import '@/styles/secrets.less';

interface Props {
  title: string,
  loading?: boolean,
  onSubmit: Function | any,
  secretsData?: object
}

const SecretDrawer = ({
  title,
  loading = false,
  onSubmit,
  secretsData
}: Props, ref) => {
  const [visible, setVisible] = useState(false);
  const [editType, setEditType] = useState('form');
  const [jsonValue, setJsonValue] = useState('');
  const field = Field.useField();
  const { init, getValue, setValue } = field;


  useEffect(() => {
    if (isEmpty(secretsData)) {
      setJsonValue('');
    } else {
      setJsonValue(JSON.stringify(secretsData, null, 4));
    }
  }, [secretsData])

  useImperativeHandle(ref, () => ({
    setValue,
    getValue,
    closeDrawer,
    setVisible,
    editType
  }));

  const closeDrawer = () => {
    setVisible(false);
    setValue('secrets', []);
  }

  const onJsonValueChanged = (value) => {
    setJsonValue(value);
  }

  const onEdit = () => {
    if (editType === 'form') {
      onSubmit(getValue('secrets'))
    } else {
      let newValue = isJson(jsonValue) ? JSON.parse(jsonValue) : jsonValue;
      onSubmit(newValue)
    }
  }

  return (
    <Drawer
      title={title}
      placement="right"
      width={"60%"}
      visible={visible}
      onClose={closeDrawer}
      className="dialog-drawer"
    >
      <div className='dialog-body secrets-content' style={{ paddingRight: 40 }}>
        <div>
          <Button className={editType === 'form' ? 'btn-active mr-8' : 'mr-8'} onClick={() => setEditType('form')} type="normal">使用表单编辑</Button>
          <Button className={editType === 'json' ? 'btn-active mr-8' : 'mr-8'} onClick={() => setEditType('json')} type="normal">使用 JSON 格式编辑</Button>
        </div>
        <hr className='mt-20 mb-20' />
        {
          editType === 'form' ? (
            <SecretForm {...init('secrets')} />
          ) : (
            <JsonEditor
              value={jsonValue}
              height={600}
              width={'100%'}
              onChange={onJsonValueChanged}
            />
          )
        }
      </div>
      <div className='dialog-footer'>
        <Button className='mr-10' type="primary" onClick={onEdit} loading={loading}>确定</Button>
        <Button type="normal" onClick={closeDrawer}>取消</Button>
      </div>
    </Drawer>
  );
};

export default forwardRef(SecretDrawer);
