import React, { memo, useEffect, useState, FC } from 'react';
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
import { pollingStatus } from '@/constants';
import './index.less';

const { Row, Col } = Grid;
interface IProps {
  appId: string;
  envName: string;
  refreshCallback: () => Promise<any>;
  latestTaskId?: string;
  application: object;
}

const CommitList: FC<IProps> = (props) => {
  const { appId, latestTaskId, application, refreshCallback, envName } = props;
  const { data, request, refresh, cancel } = useRequest(getTaskList, {
    pollingInterval: 5000,
  });
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [totalCount, setTotalCount] = useState(null);

  const fetchData = async (appId: string) => {
    setLoading(true);
    request({ appId, envName, pageSize: 4 });
    setLoading(false);
  };

  useEffect(() => {
    fetchData(appId);
  }, [appId]);

  useEffect(() => {
    if (isEmpty(data)) return;
    const result = get(data, 'result', []);
    setTaskList(result);
    setTotalCount(get(data, 'totalCount', 0));
    const deployList = filter(result, (item: any) => pollingStatus.includes(item.status));
    if (result.length === 0 || deployList.length === 0) {
      cancel();
    }
  }, [data]);

  const handleRefresh = async () => {
    setLoading(true);
    await refreshCallback();
    await refresh();
    setLoading(false);
  };

  const getDeploying = () => {
    if (isEmpty(taskList)) return true;
    const deployList = filter(taskList, (item: any) => pollingStatus.includes(item.status));
    return deployList.length > 0;
  };

  return (
    <Loading visible={loading} style={{ width: '100%' }}>
      <div className="flex-r mt-8" style={{ justifyContent: 'space-between' }}>
        <div>
          <Redeploy
            disabled={getDeploying()}
            taskId={latestTaskId as string}
            appId={appId}
            repoName={get(application, 'repo_name', '') as string}
            refreshCallback={handleRefresh}
          />
          <Rollback
            disabled={getDeploying()}
            appId={appId}
            envName={envName}
            refreshCallback={handleRefresh}
            application={application}
          />
          <Button
            className="mr-8 ml-8"
            disabled={!(taskList && taskList.length > 0)}
            onClick={() => setVisible(true)}
          >
            查看全部
          </Button>
          {!!totalCount && <span>共{totalCount}个部署版本</span>}
        </div>
        <RefreshButton refreshCallback={handleRefresh} />
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
                    <div className="flex-r">
                      <div className="copy-trigger flex-r" style={{ justifyContent: 'flex-start' }}>
                        <Link
                          className="commit-description text-nowrap-1 mr-8"
                          to={`/application/${appId}/detail/${envName}/${taskId}`}
                        >
                          {taskId}
                        </Link>
                        <CopyIcon content={taskId} size="xs" />
                      </div>

                      {!getDeploying() && latestTaskId === taskId && (
                        <Tag color="orange" size="small" style={{ fontStyle: 'italic' }}>
                          Latest
                        </Tag>
                      )}
                    </div>

                    <div style={{ fontSize: 12, marginBottom: 5 }}>
                      <div className="text-nowrap-1">{message}</div>
                      <span style={{ color: '#888', lineHeight: 2 }}>{updatedTime}</span>
                    </div>
                    <div className="flex-r">
                      <Status status={status} />
                      {!pollingStatus.includes(status) ? (
                        latestTaskId !== taskId && (
                          <DeleteCommit
                            appId={appId}
                            taskId={taskId}
                            updatedTime={updatedTime}
                            refreshCallback={refresh}
                          />
                        )
                      ) : (
                        <CancelDeploy
                          isText
                          taskId={latestTaskId as string}
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
            <CommitTable appId={appId} latestTaskId={latestTaskId} envName={envName} />
          </Drawer>
        </>
      ) : (
        <div style={{ textAlign: 'center', lineHeight: '200px' }}>暂无部署历史</div>
      )}
    </Loading>
  );
};
export default memo(CommitList);
