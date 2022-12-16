import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Drawer, Field, Button } from '@alicloud/console-components';
import ConfigEdit from '@/components/ConfigEdit';
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
  const field = Field.useField();
  const { getValue, setValue } = field;

  useImperativeHandle(ref, () => ({
    setValue,
    getValue,
    closeDrawer,
    setVisible
  }));

  const closeDrawer = () => {
    setVisible(false);
    setValue('secrets', []);
  }

  const onEdit = () => {
    onSubmit(getValue('secrets'));
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
        <ConfigEdit field={field} secretsData={secretsData} />
      </div>
      <div className='dialog-footer'>
        <Button className='mr-10' type="primary" onClick={onEdit} loading={loading}>确定</Button>
        <Button type="normal" onClick={closeDrawer}>取消</Button>
      </div>
    </Drawer>
  );
};

export default forwardRef(SecretDrawer);
