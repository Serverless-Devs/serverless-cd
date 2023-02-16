import React, { useEffect, useState } from 'react';
import { useRequest, history } from 'ice';
import { Loading, Collapse, Icon } from '@alicloud/console-components';
import { get, map, filter, isEmpty } from 'lodash';
import { getTask, getTaskLog } from '@/services/task';
import { DEPLOY_STATUS } from '@/constants/index';
import PageLayout from '@/layouts/PageLayout';
import Redeploy from '@/components/Redeploy';
import CancelDeploy from '@/components/CancelDeploy';
import Empty from '@/components/Empty';
import { formatLogs } from '@/utils/index';
import './index.less';
import Convert from 'ansi-to-html';

const convert = new Convert();

const Panel = Collapse.Panel;

const PanelTitle = ({ step, isRequest }) => {
  const { status, run, process_time } = step;
  const type = get(DEPLOY_STATUS[status], 'icon');
  const iconColor = get(DEPLOY_STATUS[status], 'color');

  return (
    <div className="flex-r pr-16" style={{ width: '100%' }}>
      <span>
        <span style={{ marginRight: 10 }}>
          {isRequest && (
            <Icon type="loading" size="small" style={{ position: 'absolute', left: 16 }} />
          )}
          <Icon type={type} className={`${iconColor}`} size="small" />
        </span>
        {run}
      </span>
      {process_time && (
        <span className="flex-r" style={{ minWidth: 60 }}>
          <i className="iconfont icon-process-time mr-8" style={{ fontSize: 16 }}></i>
          {process_time}s
        </span>
      )}
    </div>
  );
};

const Details = ({
  match: {
    params: { appId, envName, taskId },
  },
}) => {
  const [taskSteps, setTaskSteps] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoops, setIsLoops] = useState(true);
  const task = useRequest(getTask, { pollingInterval: 5000 });

  useEffect(() => {
    setLoading(true);
    task.request({ taskId });
  }, [taskId]);

  useEffect(() => {
    if (!task.data) return;
    setLoading(false);
    const pollingStatus = ['pending', 'running'];
    const steps = map(get(task.data, 'steps', []), (item, i) => {
      return {
        ...item,
        rawLog: formatLogs(taskSteps[i]?.rawLog || ''),
        initialize: true,
        loading: false,
      };
    });
    if (!pollingStatus.includes(get(task.data, 'status'))) {
      setIsLoops(false);
      task.cancel();
    }
    setTaskSteps(steps as never[]);
  }, [task.data]);

  const onExpand = (panelItemIndex, type) => {
    if (type === 'running' || type === 'skipped') return;
    const panelItem = taskSteps[panelItemIndex];
    if (panelItem && !panelItem.rawLog) {
      panelItem.loading = true;
      setTaskSteps([...taskSteps]);
      getTaskLog({ taskId, stepCount: panelItem.stepCount }).then((item) => {
        panelItem.rawLog = formatLogs(item);
        panelItem.loading = false;
        panelItem.initialize = false;
        setTaskSteps([...taskSteps]);
        changeExpandedKeys(panelItemIndex);
      });
    } else {
      changeExpandedKeys(panelItemIndex);
    }
  };

  const changeExpandedKeys = (panelItemIndex) => {
    if (expandedKeys.includes(panelItemIndex)) {
      setExpandedKeys(filter(expandedKeys, (index) => index !== panelItemIndex));
    } else {
      expandedKeys.push(panelItemIndex);
      setExpandedKeys([...expandedKeys]);
    }
  };

  const redeployCallback = (id) => {
    history?.replace(`/application/${appId}/${envName}/${id || taskId}`);
  };

  return (
    <PageLayout
      title="部署版本"
      subhead={taskId}
      description={get(task, 'data.message', '')}
      breadcrumbExtra={
        isLoops ? (
          <CancelDeploy
            taskId={taskId}
            appId={appId}
            repoName={get(task.data, 'repo_name', '') as string}
            refreshCallback={redeployCallback}
          />
        ) : (
          <Redeploy
            disabled={isLoops}
            taskId={taskId}
            appId={appId}
            repoName={get(task.data, 'repo_name', '') as string}
            refreshCallback={redeployCallback}
          />
        )
      }
      breadcrumbs={[
        {
          name: '应用列表',
          path: '/',
        },
        {
          name: appId,
          path: `/application/${appId}`,
        },
        {
          name: envName,
          path: `/application/${appId}/${envName}`,
        },
        {
          name: taskId,
        },
      ]}
    >
      <Loading visible={loading} style={{ width: '100%' }}>
        {isEmpty(taskSteps) ? (
          <Empty />
        ) : (
          <Collapse className="task-collaps" expandedKeys={expandedKeys}>
            {map(taskSteps, (step, i) => {
              const { initialize, loading, rawLog, status } = step;
              const disabledStatus = ['pending', 'cancelled'];
              const isDisabled = disabledStatus.includes(status);
              const isRunning = status === 'running';
              const isSkipped = status === 'skipped';
              const isRequest = initialize && loading && !rawLog;
              return (
                <Panel
                  className={`task-details-panel ${
                    isDisabled || isSkipped || isRunning || isRequest
                      ? 'task-details-panel-loading'
                      : ''
                  }`}
                  key={i}
                  title={<PanelTitle step={step} isRequest={isRequest} />}
                  disabled={isDisabled}
                  onClick={() => onExpand(i, status)}
                >
                  <Loading visible={loading} style={{ width: '100%' }}>
                    <div className="task-details">
                      <pre
                        className="pre"
                        dangerouslySetInnerHTML={{
                          __html: !rawLog ? '暂无数据' : convert.toHtml(rawLog),
                        }}
                      ></pre>
                    </div>
                  </Loading>
                </Panel>
              );
            })}
          </Collapse>
        )}
      </Loading>
    </PageLayout>
  );
};

export default Details;
