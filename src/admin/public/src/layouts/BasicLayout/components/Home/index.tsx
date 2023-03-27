import React, { FC } from 'react';
import { history } from 'ice';
import { Balloon } from '@alicloud/console-components';
import Icon from '@/components/Icon';

const { Tooltip } = Balloon;

type Props = {};

const Home: FC<Props> = (props) => {
  return (
    <Tooltip
      trigger={
        <Icon type="home" className="mr-16 cursor-pointer" onClick={() => history?.push('/')} />
      }
      triggerType="hover"
    >
      回到首页
    </Tooltip>
  );
};

export default Home;
