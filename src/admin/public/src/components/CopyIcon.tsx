import React, { memo } from 'react';
import { Icon, Button } from '@alicloud/console-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Toast } from '@/components/ToastContainer';

interface Props {
  content: string;
  size?: any;
  type?: string;
  text?: string;
  children?: any
}
const CopyIcon = ({ content, size = 'medium', type = 'icon', text, children }: Props) => {
  return (
    <CopyToClipboard
      text={content}
      onCopy={(_, result) => {
        if (result) {
          Toast.success('复制成功');
        }
      }}
    >
      <span className={children ? 'copy-trigger' : ''}>
        {children}
        {type === 'icon' ? (
          <Icon type="copy" className="cursor-pointer copy-icon" size={size} />
        ) : (
          <Button className="mr-8" type="primary" text>
            {text}
          </Button>
        )}
      </span>
    </CopyToClipboard>
  );
};

export default memo(CopyIcon);
