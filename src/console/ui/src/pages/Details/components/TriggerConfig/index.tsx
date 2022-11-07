import React, { useEffect, useState } from "react";
import { useRequest } from "ice";
import { Button, Table, Drawer, Field } from '@alicloud/console-components';
import PageInfo from '@/components/PageInfo';
import { Toast } from '@/components/ToastContainer';
import { updateApp } from '@/services/applist';
import { isEmpty, map, get } from 'lodash';
import Trigger from "@/pages/Create/components/github/Trigger";
import { formatBranch } from "@/utils";
import { IFilterType, TRIGGER_TYPE } from "@/pages/Create/components/constant";


const TriggerConfig = ({
  events,
  provider,
  appId,
  refreshCallback
}) => {
  const { request, loading } = useRequest(updateApp);
  const [visible, setVisible] = useState(false);
  const field = Field.useField();
  const { init, setValue, validate } = field;
  useEffect(() => {
    if (isEmpty(events)) return;
  }, [events])

  const onSubmit = () => {
    validate(async (errors, values) => {
      if (errors) {
        return;
      }
      const triggerConfig = get(values, 'trigger', []);

      const trigger_spec: any = {
        [provider]: {
          events: map(triggerConfig, (item: any) => {
            const filter = item.filterType === IFilterType.INPUT ? item.input : `body.ref in ["refs/heads/${item.branch}"]`;
            return {
              eventName: item.type,
              filter: item.type === TRIGGER_TYPE.PUSH ? filter : item.input,
              template: item.template,
            }
          })
        }
      };
      try {
        const { success } = await request({ trigger_spec, appId, provider });
        if (success) {
          Toast.success('配置成功');
          refreshCallback && refreshCallback();
          setVisible(false);
        }
      } catch (error) {
        Toast.error(error.message);
      }
    });
  }

  const onClose = () => {
    setVisible(false);
    setValue('trigger', getDefaultTriggerValue());
  }

  const getDefaultTriggerValue = (): any[] => {
    return events.map(({ eventName, filter, template }) => ({
      type: eventName,
      template,
      branch: formatBranch(filter || ''),
      filterType: IFilterType.BRANCH,
    }));
  }

  return (
    <PageInfo
      title="触发配置"
      extra={<Button type="primary" text onClick={() => setVisible(true)}>编辑</Button>}>
      <Table
        dataSource={events}
        columns={[
          {
            dataIndex: 'eventName',
            title: '触发方式'
          },
          {
            dataIndex: 'filter',
            title: '过滤规则',
            cell: (value) => value || "*"
          },
          {
            dataIndex: 'template',
            title: '配置文件',
          }
        ]}
      />

      {visible &&
        <Drawer
          title='编辑触发配置'
          placement="right"
          width="80%"
          style={{ margin: 0 }}
          visible={visible}
          onClose={onClose}
          className="dialog-drawer"
        >
          <div className='dialog-body'>
            <Trigger
              type="update"
              repo={{
                name: 'git-action-test',
                owner: 'wss-git',
              }}
              {...(init('trigger', {
                initValue: getDefaultTriggerValue(),
              }) as any)}
            />
          </div>

          <div className='dialog-footer'>
            <Button className='mr-10' type="primary" loading={loading} onClick={onSubmit}>确定</Button>
            <Button type="normal" onClick={onClose}>取消</Button>
          </div>
        </Drawer>
      }
    </PageInfo>
  )
}

export default TriggerConfig