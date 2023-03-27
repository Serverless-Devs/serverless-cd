import React, { FC } from 'react';
import styled from 'styled-components';
import { isAdmin, getOrgName } from '@/utils';
import { Button } from '@alifd/next';

type Props = {};

const Footer: FC<Props> = (props) => {
  if (!isAdmin()) return null;
  const orgName = getOrgName();

  return (
    <Container>
      <Button text component="a" href={`${orgName}/setting/members`}>
        成员管理
      </Button>
      <Button text component="a" href={`${orgName}/setting/secrets`}>
        密钥配置
      </Button>
      <Button text component="a" href={`/organizations/create?type=edit&orgName=${orgName}`}>
        团队设置
      </Button>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  border-top: 1px solid #e3e9ed;
  padding: 0 20px;
  bottom: 0;
  width: 100%;
  cursor: pointer;
  & > a {
    display: block;
    margin: 10px 0 !important;
    color: #111 !important;
    text-align: left;
    :hover {
      color: #0070cc !important;
    }
  }
`;
export default Footer;
