import React, { memo, useEffect, useState } from 'react';
import { Loading, Grid, Button, Drawer, Tag } from '@alicloud/console-components';
import { Link, useRequest } from 'ice';
import { getTaskList } from '@/services/task';
import { get, map, filter, isEmpty } from 'lodash';
import moment from 'moment';
import Status from '@/components/DeployStatus';
import DeleteCommit from '../DeleteCommit';
import CommitTable from '../CommitTable';
import RefreshButton from '../RefreshButton';
import CopyIcon from '@/components/CopyIcon';
import Redeploy from '@/components/Redeploy';
import Rollback from '@/components/Rollback';
import CancelDeploy from '@/components/CancelDeploy';
import './index.less';

let taskListInterval: any = null;

const { Row, Col } = Grid;
interface Props {
  appId: string;
  latestTaskId?: string;
  refreshCallback?: Function;
  application: object;
}

const CommitList = (props: Props) => {
  const { appId, latestTaskId, application, refreshCallback } = props;
  const { loading, data, request, refresh } = useRequest(getTaskList);
  const [visible, setVisible] = useState(false);
  const [isLoops, setIsLoops] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const isHideStatus = ['pending', 'running'];

  useEffect(
    () => () => {
      if (taskListInterval) {
        clearInterval(taskListInterval);
        taskListInterval = null;
      }
    },
    [],
  );

  useEffect(() => {
    request({ appId, currentPage: 1, pageSize: 4 });
  }, [appId]);

  useEffect(() => {
    setTaskList(get(data, 'result', []));
    setTotalCount(get(data, 'totalCount', 0));
  }, [data]);

  useEffect(() => {
    const notDeployList = filter(taskList, (item: any) => isHideStatus.includes(item.status));
    if (!isEmpty(notDeployList) && !taskListInterval) {
      refreshCallback && refreshCallback();
      setIsLoops(true);
      loopsTaskList();
    }
  }, [taskList]);

  const loopsTaskList = () => {
    if (taskListInterval) clearInterval(taskListInterval);
    taskListInterval = setInterval(async () => {
      const { result } = await getTaskList({ appId, currentPage: 1, pageSize: 4 });
      const notDeployList = filter(result, (item: any) => isHideStatus.includes(item.status));
      if (isEmpty(notDeployList)) {
        clearInterval(taskListInterval);
        taskListInterval = null;
        refreshCallback && refreshCallback();
        setIsLoops(false);
      }
      setTaskList(result);
    }, 5000);
  };

  return (
    <Loading visible={loading} style={{ width: '100%' }}>
      <div className="flex-r mt-8" style={{ justifyContent: 'space-between' }}>
        <div>
          <Redeploy
            disabled={isEmpty(taskList) || isLoops}
            taskId={get(application, 'latest_task.taskId', '') as string}
            appId={appId}
            repoName={get(application, 'repo_name', '') as string}
            refreshCallback={refresh}
          />
          <Rollback
            disabled={isEmpty(taskList) || isLoops}
            appId={appId}
            refreshCallback={refresh}
            application={application}
          />
          <Button
            className='mr-8 ml-8'
            disabled={!(taskList && taskList.length > 0)}
            onClick={() => setVisible(true)}
          >
            查看全部
          </Button>
          {!!totalCount && <span>共{totalCount}个部署版本</span>}
        </div>
        <RefreshButton refreshCallback={refresh} />
      </div>
      {taskList && taskList.length > 0 ? (
        <>
          <Row wrap className="projects-container" gutter={8}>
            {map(taskList, (item) => {
              const status = get(item, 'status');
              const taskId = get(item, 'id');
              const message = get(item, 'message');
              const updatedTime = moment(get(item, 'updated_time')).format('YYYY-MM-DD HH:mm:ss');
              const appId = get(item, 'app_id');
              return (
                <Col span="6">
                  <div className="deploy-item mb-8">
                    <div className='flex-r'>
                      <div className='copy-trigger flex-r' style={{ justifyContent: 'flex-start' }}>
                        <Link
                          className="commit-description text-nowrap-1 mr-8"
                          to={`/application/${appId}/detail/${taskId}`}
                        >
                          {taskId}
                        </Link>
                        <CopyIcon content={taskId} size="xs" />
                      </div>

                      {
                        !isLoops && latestTaskId === taskId && (
                          <Tag color="orange" size="small" style={{ fontStyle: 'italic' }}>
                            Latest
                          </Tag>
                        )
                      }
                    </div>

                    <div style={{ fontSize: 12, marginBottom: 5 }}>
                      <div className='text-nowrap-2'>{message}</div>
                      <span style={{ color: '#888', lineHeight: 2 }}>{updatedTime}</span>
                    </div>
                    <div className="flex-r">
                      <Status status={status} />
                      {!isHideStatus.includes(status) ? (
                        <DeleteCommit
                          appId={appId}
                          taskId={taskId}
                          updatedTime={updatedTime}
                          refreshCallback={refresh}
                        />
                      ) : (
                        <CancelDeploy
                          isText
                          taskId={get(application, 'latest_task.taskId', '') as string}
                          appId={appId}
                          repoName={get(application, 'repo_name', '') as string}
                          refreshCallback={refresh}
                        />
                      )}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
          <Drawer
            title="部署历史"
            placement="right"
            width={900}
            visible={visible}
            onClose={() => setVisible(false)}
          >
            <CommitTable appId={appId} latestTaskId={latestTaskId} />
          </Drawer>
        </>
      ) : (
        <div style={{ textAlign: 'center', lineHeight: '200px' }}>暂无部署历史</div>
      )}
    </Loading>
  );
};
export default memo(CommitList);
