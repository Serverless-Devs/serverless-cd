import React, { memo } from 'react';
import { Button } from '@alicloud/console-components';
import { CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Toast } from '@/components/ToastContainer';

interface Props {
  content: string;
  size?: any;
  type?: string;
  text?: string;
  children?: any;
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
          <span className="mr-4 copy-icon cursor-pointer">
            <CopyOutlined/>
          </span>
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
