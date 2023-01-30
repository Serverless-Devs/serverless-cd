import React, { memo } from 'react';
import ExternalLink from './ExternalLink';
import { Balloon } from '@alicloud/console-components';
const Tooltip = Balloon.Tooltip;
interface Props {
  url: string;
  label: string;
  icon: boolean;
  className?: string;
  message?: string;
}
const CommitId = ({ url, label, icon = false, className, message }: Props) => {
  return (
    <ExternalLink
      className={`color-gray cursor-pointer ${className}`}
      url={url}
      label={
        label ? (
          message ? (
            <Tooltip
              trigger={
                <span className="p-2" style={{ background: '#eee' }}>
                  {label?.slice(0, 7)}
                </span>
              }
              align="t"
            >
              {message}
            </Tooltip>
          ) : (
            <span className="p-2" style={{ background: '#eee' }}>
              {label?.slice(0, 7)}
            </span>
          )
        ) : (
          ''
        )
      }
      icon={icon}
    />
  );
};

export default memo(CommitId);
