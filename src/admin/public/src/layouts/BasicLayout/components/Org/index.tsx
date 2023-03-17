import React, { FC, useEffect } from 'react';
import { Dropdown, Menu, Icon } from '@alicloud/console-components';
import { history, useRequest } from 'ice';
import style from 'styled-components';
import { ORG_LOGO } from '@/constants/public';
import { localStorageSet } from '@/utils';
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
      // history?.push(`/${orgName}${key}`);
    };

    const stopEvent = async (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    const handleChangeOrg = async (value: string) => {
      localStorageSet('orgName', value);
      history?.push('/');
    };
    const orgRender = (
      <Dropdown
        trigger={
          <div onClick={stopEvent} className="flex-r">
            <span className="ellipsis">团队切换({orgName})</span>
            <Icon type="arrow-right" size="xs" style={{ color: '#888' }} />
          </div>
        }
        offset={[168, -38]}
      >
        <Menu>
          {map(get(orgRequest, 'data.result'), (item) => {
            return (
              <Menu.Item>
                <div className="flex-r" onClick={() => handleChangeOrg(item.name)}>
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
          <Menu.Item key="/createOrg">团队设置</Menu.Item>
        </Menu>
      </StyledMenu>
    );
  };
  return (
    <Dropdown
      trigger={
        <div className="layout-center">
          <img className="cursor-pointer" src={ORG_LOGO} style={{ width: 32, height: 32 }} />
        </div>
      }
      offset={[0, 0]}
    >
      {menu()}
    </Dropdown>
  );
};

export default Org;
