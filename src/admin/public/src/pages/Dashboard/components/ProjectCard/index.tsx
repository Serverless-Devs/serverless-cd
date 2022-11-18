import React from 'react';
import { useHistory } from 'ice';
import { get } from 'lodash';
import { Box, Card } from '@alicloud/console-components';
import Status from '@/components/DeployStatus';
import moment from 'moment';
import './index.css';

const CardHeader = ({ name, owner }) => {
  return (
    <div className='text-nowrap-1' style={{minWidth: 180}}>
      <span
        className="avatar-content"
        style={{ display: 'inline-block', fontSize: 12, marginRight: 10 }}
      >
        C D
      </span>
      <span className='fz-12'>{owner}</span>
      <span className='fz-14 f-w-500'> / {name}</span>
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
  const message = get(item, 'latest_task.message', '');
  const status = get(item, 'latest_task.status', 'init');

  const goDetails = () => {
    history.push(`/application/${id}/detail`);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Card free showHeadDivider className="project-card cursor-pointer" onClick={goDetails}>
        <Card.Header title={<CardHeader name={name} owner={owner} />} />
        <Card.Content style={{ height: 40, paddingBottom: 0 }}>
          <span className='text-nowrap-1'>{message}</span>
          <p className='text-nowrap-1' style={{ margin: '5px 0' }}>{description}</p>
        </Card.Content>
        <Card.Actions>
          <Box spacing={10} direction="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
            <div className='flex-r'>
              <span className="mr-8" >{moment(updated_time).format('YYYY-MM-DD HH:mm:ss')}</span>
              {item.provider === 'github' && (
                <svg aria-label="github" height="15" viewBox="0 0 14 14" width="20">
                  <path
                    d="M7 .175c-3.872 0-7 3.128-7 7 0 3.084 2.013 5.71 4.79 6.65.35.066.482-.153.482-.328v-1.181c-1.947.415-2.363-.941-2.363-.941-.328-.81-.787-1.028-.787-1.028-.634-.438.044-.416.044-.416.7.044 1.071.722 1.071.722.635 1.072 1.641.766 2.035.59.066-.459.24-.765.437-.94-1.553-.175-3.193-.787-3.193-3.456 0-.766.262-1.378.721-1.881-.065-.175-.306-.897.066-1.86 0 0 .59-.197 1.925.722a6.754 6.754 0 0 1 1.75-.24c.59 0 1.203.087 1.75.24 1.335-.897 1.925-.722 1.925-.722.372.963.131 1.685.066 1.86.46.48.722 1.115.722 1.88 0 2.691-1.641 3.282-3.194 3.457.24.219.481.634.481 1.29v1.926c0 .197.131.415.481.328C11.988 12.884 14 10.259 14 7.175c0-3.872-3.128-7-7-7z"
                    fill="currentColor"
                  ></path>
                </svg>
              )}
            </div>
            {
              status && <Status status={status} />
            }
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
