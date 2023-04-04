import React from 'react';

interface Props {
  triggerType: string
}

export default ({ triggerType }: Props) => {
  if (triggerType.startsWith('tracker:')) {
    return <>上报数据</>;
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
  if (triggerType === 'rollback') {
    return <>回滚</>;
  }
  return <>{`${triggerType} 触发`}</>;
}