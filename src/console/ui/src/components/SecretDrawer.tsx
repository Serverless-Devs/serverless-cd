import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Drawer, Field, Button } from '@alicloud/console-components';
import SecretForm from '@/pages/Create/components/github/Secret';
import '@/styles/secrets.less';

interface Props {
  title: string,
  loading?: boolean,
  onSubmit: Function | any
}

const SecretDrawer = ({
  title,
  loading = false,
  onSubmit,
}: Props, ref) => {
  const [visible, setVisible] = useState(false);
  const field = Field.useField();
  const { init, getValue, setValue } = field;

  useImperativeHandle(ref, () => ({
    setValue,
    getValue,
    closeDrawer,
    setVisible
  }));

  const closeDrawer = () => {
    setVisible(false);
    setValue('secrets', [])
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
      <div className='dialog-body secrets-content'>
        <SecretForm {...init('secrets')} />
      </div>
      <div className='dialog-footer'>
        <Button className='mr-10' type="primary" onClick={onSubmit} loading={loading}>确定</Button>
        <Button type="normal" onClick={closeDrawer}>取消</Button>
      </div>
    </Drawer>
  );
};

export default forwardRef(SecretDrawer);
