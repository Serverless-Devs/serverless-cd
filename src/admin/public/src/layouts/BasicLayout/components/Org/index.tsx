import React, { FC, useEffect } from 'react';
import { Dropdown, Menu, Icon } from '@alicloud/console-components';
import { history, useRequest } from 'ice';
import style from 'styled-components';
import { ORG_LOGO } from '@/constants/public';
import { localStorageSet, stopPropagation } from '@/utils';
import { listOrgs } from '@/services/user';
import { get, map } from 'lodash';

const StyledMenu = style.div`
.next-menu{
  width: 180px;
}
`;

type Props = {
  orgName: string;
};

const Org: FC<Props> = (props) => {
  const { orgName } = props;
  const orgRequest = useRequest(listOrgs);

  useEffect(() => {
    orgRequest.request();
  }, []);

  const menu = () => {
    const onItemClick = (key: string) => {
      history?.push(`/${orgName}${key}`);
    };

    const handleChangeOrg = async (item) => {
      localStorageSet(item.user_id, item.name);
      history?.push('/');
    };
    const orgRender = (
      <Dropdown
        trigger={
          <div onClick={stopPropagation} className="flex-r">
            <span>团队切换</span>
            <Icon type="arrow-right" size="xs" style={{ color: '#888' }} />
          </div>
        }
        offset={[168, -38]}
      >
        <Menu>
          {map(get(orgRequest, 'data.result'), (item) => {
            return (
              <Menu.Item>
                <div className="flex-r" onClick={() => handleChangeOrg(item)}>
                  <span className="ellipsis">{item.name}</span>
                  {orgName === item.name && (
                    <Icon type="select" size="xs" style={{ color: '#0070cc' }} />
                  )}
                </div>
              </Menu.Item>
            );
          })}
        </Menu>
      </Dropdown>
    );

    return (
      <StyledMenu>
        <Menu onItemClick={onItemClick}>
          <Menu.Item className="border-bottom">{orgRender}</Menu.Item>
          <Menu.Item key="/settings">团队设置</Menu.Item>
        </Menu>
      </StyledMenu>
    );
  };
  return (
    <Dropdown
      trigger={
        <div className="layout-center cursor-pointer">
          <img
            src={ORG_LOGO}
            style={{ width: 24, height: 24, margin: '0 8', borderRadius: '50%' }}
          />
          <span className="ml-4 fz-18 text-bold ellipsis">{orgName}</span>
        </div>
      }
      offset={[0, 0]}
    >
      {menu()}
    </Dropdown>
  );
};

export default Org;
