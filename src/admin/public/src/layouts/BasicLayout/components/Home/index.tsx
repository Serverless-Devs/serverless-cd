import React, { FC } from 'react';
import { history } from 'ice';
import { Balloon } from '@alicloud/console-components';
import Icon from '@/components/Icon';
import { ORG_NAME } from '@/constants';
import { set } from 'lodash';

const { Tooltip } = Balloon;

type Props = {
  orgName?: string;
};

const Home: FC<Props> = (props) => {
  const { orgName } = props;
  set(window, ORG_NAME, orgName);
  return (
    <Tooltip
      trigger={
        <Icon
          type="home"
          className="mr-16 cursor-pointer"
          onClick={() => history?.push(`/${orgName}/application`)}
        />
      }
      triggerType="hover"
    >
      回到首页
    </Tooltip>
  );
};

export default Home;
