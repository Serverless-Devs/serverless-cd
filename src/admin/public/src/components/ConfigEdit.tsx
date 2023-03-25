import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import VariableUi from '@serverless-cd/variable-ui';
import '@/styles/secrets.less';

interface Props {
  field?: object | any;
  value?: object | any;
  onChange?: (value: any) => void;
}

const ConfigEdit = ({ value, onChange }: Props, ref) => {
  const varRef: any = useRef(null);
  useImperativeHandle(ref, () => ({
    validate: varRef?.current?.validate,
  }));

  return (
    <VariableUi
      value={value}
      onChange={onChange}
      ref={varRef}
      hintText={'当前环境变量为通过阿里云部署时需引用的环境变量'}
    />
  );
};

export default forwardRef(ConfigEdit);
