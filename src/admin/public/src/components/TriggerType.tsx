import React from 'react';
import { upperFirst } from 'lodash';
import { C_REPOSITORY } from '@/constants/repository';

export type ITriggerType = 'local' | 'console' | 'webhook';

export enum TriggerTypeLable {
  local = '本地上报',
  console = '手动触发',
  webhook = 'Webhook 触发',
}

export const triggerIcons = {
  manual: <img className='mr-4' src="https://img.alicdn.com/imgextra/i3/O1CN01QEtrEF1ErzdKCIU02_!!6000000000406-55-tps-16-16.svg" alt="logo" style={{ width: 16, height: 16 }} />,
  tracker: <img className='mr-4' src="https://img.alicdn.com/imgextra/i1/O1CN01g5BECJ1JR2PGL5E5U_!!6000000001024-55-tps-200-200.svg" alt="logo" style={{ width: 16, height: 16 }} />,
  redeploy: <img className='mr-4' src="https://img.alicdn.com/imgextra/i3/O1CN01OMFS921GYsKuneK5w_!!6000000000635-55-tps-200-200.svg" alt="logo" style={{ width: 16, height: 16 }} />
}

interface Props {
  trigger: string;
}

export default ({ trigger }: Props) => {
  if (!trigger) {
    return <></>;
  }
  if (trigger.startsWith('tracker:')) {
    return <div className='align-center'>{triggerIcons['tracker']}本地部署</div>;
  }
  if (trigger === 'manual') {
    return <div className='align-center'>{triggerIcons['manual']}手动触发</div>;
  }
  if (trigger === 'redeploy') {
    return <>{triggerIcons['redeploy']}重新部署</>;
  }
  if (trigger === 'rollback') {
    return <>{triggerIcons['redeploy']}回滚</>;
  }
  return <div className='align-center'>{C_REPOSITORY[trigger as any]?.svg(16)}<span className='ml-4'>{`${upperFirst(trigger)} 触发`}</span></div>;
};
