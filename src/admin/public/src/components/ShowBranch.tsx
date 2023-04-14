import React from 'react';
import Truncate from '@alicloud/console-components-truncate';
import ExternalLink from './ExternalLink';

interface Props {
  url: string;
  label: string;
  threshold?: number;
  icon?: boolean;
  className?: string;
}

export default ({ url, label, icon = false, className, threshold = 20 }: Props) => {
  return (
    <ExternalLink
      className={`.cursor-pointer-color ${className}`}
      url={url}
      label={
        <Truncate threshold={threshold} align="t">
          {label}
        </Truncate>
      }
      icon={icon}
    />
  );
};
