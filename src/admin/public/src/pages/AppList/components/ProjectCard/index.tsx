import React from 'react';
import { useHistory } from 'ice';
import { get } from 'lodash';
import { Box, Card } from '@alicloud/console-components';
import moment from 'moment';
import './index.css';

const CardHeader = ({ name, owner }) => {
  return (
    <div className="text-nowrap-1" style={{ minWidth: 180 }}>
      <span
        className="avatar-content"
        style={{ display: 'inline-block', fontSize: 12, marginRight: 10 }}
      >
        C D
      </span>
      <span className="fz-12">{owner}</span>
      <span className="fz-14 f-w-500"> / {name}</span>
    </div>
  );
};

const ProjectCard = ({ item }) => {
  const history = useHistory();
  const name = get(item, 'repo_name', '');
  const id = get(item, 'id', '');
  const owner = get(item, 'owner', '');
  const description = get(item, 'description', '');
  const updated_time = get(item, 'updated_time', '');
  const goDetails = () => {
    history.push(`/application/${id}`);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Card free showHeadDivider className="project-card cursor-pointer" onClick={goDetails}>
        <Card.Header title={<CardHeader name={name} owner={owner} />} />
        <Card.Content style={{ height: 40, paddingBottom: 0 }}>
          <p className="text-nowrap-1" style={{ margin: '5px 0' }}>
            {description}
          </p>
        </Card.Content>
        <Card.Actions>
          <Box
            spacing={10}
            direction="row"
            style={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span className="mr-8">{moment(updated_time).format('YYYY-MM-DD HH:mm:ss')}</span>
          </Box>
        </Card.Actions>
      </Card>
      {/* <a className="project-skip cursor-pointer" href={item.repo_url} target="_blank">
        <i className="iconfont icon-skip" style={{ fontSize: 30 }}></i>
      </a> */}
    </div>
  );
};

export default ProjectCard;
