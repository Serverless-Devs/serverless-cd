import React, { FC, useEffect, useState } from 'react';
import { useRequest, Link } from 'ice';
import { detail, eventInvoke, httpInvoke } from '@/services/resource-fc';
import { Input, Button, Message } from '@alicloud/console-components';
import { isEmpty, get } from 'lodash';

interface IProps {
  resource: Record<string, string>[];
  cloudAlias: string;
  orgName: string;
}

const Fc: FC<IProps> = ({ resource, cloudAlias, orgName }) => {
  const detailRequest = useRequest(detail);
  const eventInvokeRequest = useRequest(eventInvoke);
  const httpInvokeRequest = useRequest(httpInvoke);
  const [data, setData] = useState({});
  const [showType, setShowData] = useState('event');

  useEffect(() => {
    if (cloudAlias) {
      detailRequest.request({ resource, cloudAlias });
    }
  }, [cloudAlias]);

  if (isEmpty(cloudAlias)) {
    return <Message type="notice">
      暂未绑定云账号，请往前
      <Link to={`/${orgName}/setting/cloud`}>
        云账号管理
      </Link>
      页面进行配置
    </Message>;
  }
  if (isEmpty(resource)) {
    return <>未关联到资源</>;
  }

  const result = get(detailRequest, 'data.data', []);

  const onHttpInvoke = async (id, item) => {
    // data[id]: { qualifier, headers, method, path, host, asyncMode = false }
    await httpInvokeRequest.request({ cloudAlias, resource: item, payload: data[id] });
    setShowData('http');
  };
  const onEventInvoke = async (id, item) => {
    await eventInvokeRequest.request({ cloudAlias, resource: item, payload: data[id] });
    setShowData('event');
  };

  return (
    <>
      {result.map((item) => {
        const id = `${item.uid}/${item.region}/${item.service}/${item.function}`;

        if (item.notFount) {
          return (
            <div>
              {id}: <span style={{ color: 'red' }}>{item.message}</span>
              <div>
                <br />
              </div>
            </div>
          );
        }
        const { instances = [] } = item || {};

        if (item.isHttp) {
          return (
            <div>
              {id}: Latest 版本存在 http 触发器
              <div>
                <Input.TextArea
                  onChange={(v) => {
                    data[id] = v;
                    setData(data);
                  }}
                  placeholder="TextArea"
                />
                <Button onClick={() => onHttpInvoke(id, item)}>http调用</Button>
              </div>
              <span>实例列表：{JSON.stringify(instances, null, 2)} </span>
              <br />
            </div>
          );
        }

        return (
          <div>
            {id}: Latest 版本不存在 http 触发器
            <div>
              <Input.TextArea
                onChange={(v) => {
                  data[id] = v;
                  setData(data);
                }}
                placeholder="TextArea"
              />
              <Button onClick={() => onEventInvoke(id, item)}>event调用</Button>
            </div>
            <span>实例列表：{JSON.stringify(instances, null, 2)} </span>
            <br />
          </div>
        );
      })}

      <div key={showType} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        调用结果:
        {JSON.stringify(
          get(showType === 'event' ? eventInvokeRequest : httpInvokeRequest, 'data', {}),
          null,
          2,
        )}
      </div>
    </>
  );
};

export default Fc;
