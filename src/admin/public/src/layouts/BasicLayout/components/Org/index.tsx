import React, { FC, useEffect } from 'react';
import { Select } from '@alicloud/console-components';
import { history, useRequest } from 'ice';
import style from 'styled-components';
import { ORG_LOGO } from '@/constants/public';
import { localStorageSet } from '@/utils';
import { listOrgs } from '@/services/user';
import { get, map, find } from 'lodash';
import './index.less';

const StyledWrapper = style.div`
  .next-input {
    border: unset;
  }
`;

type Props = {
  orgName: string;
};

const Org: FC<Props> = (props) => {
  const { orgName } = props;
  const orgRequest = useRequest(listOrgs);

  useEffect(() => {
    orgName && orgRequest.request();
  }, [orgName]);

  const handleChangeOrg = async (value) => {
    const obj = find(dataSource, (item) => item.value === value);
    localStorageSet(obj.user_id, value);
    history?.push('/');
  };

  const dataSource = map(get(orgRequest, 'data.result'), (item) => {
    return {
      ...item,
      label: (
        <div className="align-center">
          <img
            src={item.logo || ORG_LOGO}
            style={{ width: 20, height: 20, margin: '0 8', overflow: 'hidden' }}
          />
          <span className="ml-8 ellipsis">{item.alias || item.name}</span>
        </div>
      ),
      value: item.name,
    };
  });

  return (
    <StyledWrapper>
      <Select
        value={orgName}
        style={{ width: 150 }}
        dataSource={dataSource}
        onChange={handleChangeOrg}
        popupClassName="org-select__container"
      />
    </StyledWrapper>
  );
};

export default Org;
