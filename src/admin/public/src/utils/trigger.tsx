import { forEach, keys, includes, isEmpty } from 'lodash';

export const filterTriggerInfo = (obj: any) => {
  if (isEmpty(obj)) return {};
  const triggerTypes = ['push', 'pull_request'];
  let triggerValue = {};
  forEach(keys(obj), (key) => {
    includes(triggerTypes, key) && (triggerValue = { [key]: obj[key] });
  });
  return triggerValue;
};
