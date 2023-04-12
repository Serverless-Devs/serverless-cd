import React from 'react';
import { upperFirst } from 'lodash';


export type ITriggerType = 'local' | 'console' | 'webhook';

export enum TriggerTypeLable {
  local = '本地上报',
  console = '手动触发',
  webhook = 'Webhook 触发',
}

export const triggerIcons = {
  manual: "https://img.alicdn.com/imgextra/i3/O1CN01QEtrEF1ErzdKCIU02_!!6000000000406-55-tps-16-16.svg",
  tracker: "https://img.alicdn.com/imgextra/i2/O1CN016suUeV1ILiBAilAYZ_!!6000000000877-55-tps-16-16.svg",
  redeploy: 'https://img.alicdn.com/imgextra/i1/O1CN017SFO9D1fIikoMrPDb_!!6000000003984-55-tps-16-16.svg'
}

interface Props {
  trigger: string
}

export default ({ trigger }: Props) => {
  if (!trigger) {
    return <></>;
  }
  if (trigger.startsWith('tracker:')) {
    return <><span className='mr-4'>{triggerIcons['tracker']}</span>本地部署</>;
  }
  if (trigger === 'manual') {
    return <><span className='mr-4'>{triggerIcons['manual']}</span>手动触发</>;
  }
  if (trigger === 'redeploy') {
    return <><span className='mr-4'>{triggerIcons['redeploy']}</span>重新部署</>;
  }
  if (trigger === 'rollback') {
    return <><span className='mr-4'>{triggerIcons['redeploy']}</span>回滚</>;
  }
  return <>{`${upperFirst(trigger)} 触发`}</>;
}