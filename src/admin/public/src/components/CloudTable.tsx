import React from 'react';
import { Button, Table, Dialog } from '@alicloud/console-components';
import { removeCloudSecret } from '@/services/org';
import { map, get, keys, startsWith } from 'lodash';

interface Props {
  data: Record<string, any>[];
  loading: boolean;
  refresh: () => void;
}

export default ({ data, loading = false, refresh }: Props) => {
  const existAlias = keys(data);
  const dataSource = map(existAlias, alias => ({
    ...get(data, alias, {}),
    alias,
  }));

  const onDelete = async (key: string) => {
    Dialog.confirm({
      title: 'Delete',
      content: `确定移除 ${key} 吗？`,
      onOk: async () => {
        await removeCloudSecret({ deleteKey: key });
        refresh();
      },
      onCancel: () => {}
    });
  }

  return (
    <Table
      dataSource={dataSource}
      loading={loading}
      maxBodyHeight={400}
      fixedHeader
      columns={[
        {
          dataIndex: 'alias',
          title: '别名',
        },
        {
          dataIndex: 'provider',
          title: '厂商',
        },
        {
          title: '密钥信息',
          cell: (_value, _index, record) => {
            return map(record, (v, k) => {
              if (['alias', 'provider'].includes(k) || startsWith(k, '$')) return;
              return (
                <div key={k}>
                  {k}: <span className="ml-4">{v}</span>
                </div>
              );
            });
          }
        },
        {
          dataIndex: 'alias',
          title: '操作',
          cell: (value) => (
            <Button
              type="primary"
              onClick={() => onDelete(value)}
              text
            >
              删除
            </Button>
          )
        }
      ]}
    />
  );
};
