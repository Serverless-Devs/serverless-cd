import React from 'react';
import { upperFirst } from 'lodash';

interface Props {
  triggerType: string
}

export default ({ triggerType }: Props) => {
  if (!triggerType) {
    return <></>;
  }
  if (triggerType.startsWith('tracker:')) {
    return <>本地部署</>;
  }
  if (triggerType === 'manual') {
    return <>手动触发</>;
  }
  if (triggerType === 'redeploy') {
    return <>重新部署</>;
  }
  if (triggerType === 'rollback') {
    return <>回滚</>;
  }
  return <>{`${upperFirst(triggerType)} 触发`}</>;
}