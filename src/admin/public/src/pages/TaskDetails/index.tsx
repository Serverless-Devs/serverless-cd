import React, { useEffect, useState } from 'react';
import { useRequest, history } from 'ice';
import { Loading, Collapse, Input, Icon } from '@alicloud/console-components';
import { get, map, filter } from 'lodash';
import { getTask, getTaskLog } from '@/services/task';
import { DEPLOY_STATUS } from '@/constants/index';
import PageLayout from '@/layouts/PageLayout';
import Redeploy from '@/components/Redeploy';
import CancelDeploy from '@/components/CancelDeploy';
import './index.less';

const Panel = Collapse.Panel;

const PanelTitle = ({ step, isRequest }) => {
  const { status, run, process_time } = step;
  const type = get(DEPLOY_STATUS[status], 'icon');
  const iconColor = get(DEPLOY_STATUS[status], 'color');

  return (
    <div className='flex-r pr-16' style={{ width: '100%' }}>
      <span>
        <span style={{ marginRight: 10 }}>
          {isRequest && <Icon type="loading" size="small" style={{ position: 'absolute', left: 16 }} />}
          <Icon type={type} className={`${iconColor}`} size="small" />
        </span>
        {run}
      </span>
      {process_time && (
        <span className='flex-r' style={{ minWidth: 60 }}>
          <i className="iconfont icon-process-time mr-8" style={{ fontSize: 16 }}></i>
          {process_time}s
        </span>
      )}
    </div>
  );
};

const Details = ({
  match: {
    params: { appId, taskId },
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
        rawLog: taskSteps[i]?.rawLog || '',
        initialize: true,
        loading: false,
      };
    });
    if (!pollingStatus.includes(get(task.data, 'status'))) {
      setIsLoops(false);
      task.cancel()
    }

    setTaskSteps(steps as never[]);
  }, [task.data]);

  const onExpand = (panelItemIndex, type) => {
    if (type === 'running') return;
    const panelItem = taskSteps[panelItemIndex];
    if (panelItem && !panelItem.rawLog) {
      panelItem.loading = true;
      setTaskSteps([...taskSteps]);
      getTaskLog({ taskId, stepCount: panelItem.stepCount }).then((item) => {
        panelItem.rawLog = item;
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
      setExpandedKeys(filter(expandedKeys, index => index !== panelItemIndex));
    } else {
      expandedKeys.push(panelItemIndex);
      setExpandedKeys([...expandedKeys]);
    }
  }

  const redeployCallback = (id) => {
    history?.replace(`/application/${appId}/detail/${id || taskId}`)
  }

  return (
    <PageLayout
      title="部署详情"
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
        )}
      breadcrumbs={[
        {
          name: '应用列表',
          path: '/',
        },
        {
          name: appId,
          path: `/application/${appId}/detail`,
        },
        {
          name: taskId,
        },
      ]}
    >
      <Loading visible={loading} style={{ width: '100%' }}>
        <Collapse
          className="task-collaps"
          expandedKeys={expandedKeys}
        >
          {map(taskSteps, (step, i) => {
            const { initialize, loading, rawLog, status } = step;
            const disabledStatus = ['pending', 'skipped', 'cancelled'];
            const isDisabled = disabledStatus.includes(status);
            const isRunning = status === 'running'
            const isRequest = initialize && loading && !rawLog;
            return (
              <Panel
                className={`task-details-panel ${(isDisabled || isRunning || isRequest) ? 'task-details-panel-loading' : ''}`}
                title={<PanelTitle step={step} isRequest={isRequest} />}
                disabled={isDisabled}
                onClick={() => onExpand(i, status)}
              >
                <Loading visible={loading} style={{ width: '100%' }}>
                  <Input.TextArea
                    className='task-details-textarea'
                    rows={15}
                    value={!rawLog ? '正在加载中' : rawLog}
                  />
                </Loading>
              </Panel>
            )
          })}
        </Collapse>
      </Loading>
    </PageLayout>
  );
};

export default Details;
