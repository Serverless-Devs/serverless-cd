import React from 'react';
import { upperFirst } from 'lodash';


export type ITriggerType = 'local' | 'console' | 'webhook';

export enum TriggerTypeLable {
  local = '本地上报',
  console = '手动触发',
  webhook = 'Webhook 触发',
}

interface Props {
  trigger: string
}

export default ({ trigger }: Props) => {
  if (!trigger) {
    return <></>;
  }
  if (trigger.startsWith('tracker:')) {
    return <>本地部署</>;
  }
  if (trigger === 'manual') {
    return <>手动触发</>;
  }
  if (trigger === 'redeploy') {
    return <>重新部署</>;
  }
  if (trigger === 'rollback') {
    return <>回滚</>;
  }
  return <>{`${upperFirst(trigger)} 触发`}</>;
}