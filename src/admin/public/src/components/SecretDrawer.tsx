import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { Field } from '@alicloud/console-components';
import SlidePanel from '@alicloud/console-components-slide-panel';
import ConfigEdit from '@/components/ConfigEdit';
import '@/styles/secrets.less';

interface Props {
  title: string;
  loading?: boolean;
  onSubmit: Function | any;
  secretsData?: object;
}

const SecretDrawer = ({ title, loading = false, onSubmit, secretsData }: Props, ref) => {
  const [visible, setVisible] = useState(false);
  const field = Field.useField();
  const { getValue, setValue, init, validate } = field;
  const secretsRef: any = useRef(null);
  useImperativeHandle(ref, () => ({
    setValue,
    getValue,
    closeDrawer,
    setVisible,
  }));

  const closeDrawer = () => {
    setVisible(false);
  };

  const onEdit = () => {
    validate(async (error, value) => {
      const res = await secretsRef.current.validate();
      if (error || !res) return;
      onSubmit(value['secrets']);
    });
  };

  return (
    <SlidePanel
      title={title}
      width="large"
      isShowing={visible}
      onOk={onEdit}
      onClose={closeDrawer}
      onCancel={closeDrawer}
      isProcessing={loading}
    >
      {visible && <ConfigEdit {...init('secrets', { initValue: secretsData })} ref={secretsRef} />}
    </SlidePanel>
  );
};

export default forwardRef(SecretDrawer);
