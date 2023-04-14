import React, { FC, useEffect, useState } from 'react';
import { Select } from '@alicloud/console-components';
import { history, useRequest } from 'ice';
import style from 'styled-components';
import { ORG_LOGO } from '@/constants/public';
import { getParam, localStorageSet } from '@/utils';
import { listOrgs } from '@/services/user';
import { get, map, find, isEmpty } from 'lodash';
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
  const [dataSource, setDataSource] = useState<any>([]);

  useEffect(() => {
    fetchData();
  }, [orgName, getParam('orgRefresh')]);

  const fetchData = async () => {
    const data = await orgRequest.request();
    const dataList = map(get(data, 'result'), (item) => {
      return {
        ...item,
        label: (
          <div className="align-center">
            <div className="org-image">
              <img
                src={item.logo || ORG_LOGO}
                style={{ width: 20, height: 20, margin: '0 8', overflow: 'hidden' }}
              />
            </div>
            <span className="ml-8 ellipsis">{item.alias || item.name}</span>
          </div>
        ),
        value: item.name,
      };
    });
    setDataSource(dataList);
  };
  const handleChangeOrg = async (value) => {
    const obj = find(dataSource, (item) => item.value === value);
    localStorageSet(obj.user_id, value);
    history?.push('/');
  };

  return (
    <StyledWrapper>
      <Select
        value={isEmpty(dataSource) ? '' : orgName}
        style={{ width: 150 }}
        dataSource={dataSource}
        onChange={handleChangeOrg}
        popupClassName="org-select__container"
      />
    </StyledWrapper>
  );
};

export default Org;
