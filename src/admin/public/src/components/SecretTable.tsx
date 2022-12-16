import React, { memo } from 'react';
import { Icon, Table } from '@alicloud/console-components';
import { map } from 'lodash';
import Copy from '@/components/CopyIcon';

interface Props {
  secretList: any[],
  loading?: boolean,
  setSecretList: Function
}

const SecretTable = ({
  secretList,
  loading = false,
  setSecretList
}: Props) => {


  const handleshowPassword = (item) => {
    const newList = map(secretList, (i) => {
      if (i.key === item.key) {
        return { ...i, showPassword: !i.showPassword };
      }
      return i;
    });
    setSecretList(newList);
  };

  return (
    <Table
      dataSource={secretList}
      loading={loading}
      maxBodyHeight={400}
      fixedHeader
      columns={[
        {
          dataIndex: 'key',
          title: '变量',
          width: '35%',
          cell: (value) => {
            return (
              <span className='mr-16 copy-trigger'>{value} <Copy content={value} size="xs" /></span>
            )
          }
        },
        {
          dataIndex: 'value',
          width: '45%',
          title: '值',
          cell: (value, index, item) => {
            return (
              <div className='flex-r' style={{ justifyContent: 'flex-start' }}>
                {
                  item.showPassword ? (
                    <span className='mr-16 copy-trigger'>{value} <Copy content={value} size="xs" /></span>
                  ) : (
                    <span className='mr-16'>***************</span>
                  )
                }
                <Icon
                  className="mr-8 cursor-pointer"
                  size='small'
                  type={item.showPassword ? 'eye-slash' : 'eye'}
                  onClick={() => handleshowPassword(item)}
                />
              </div>
            )
          }
        },
        {
          title: '操作',
          width: 100,
          cell: (_, index, { key, value }) => {
            return (
              <>
                <Copy content={JSON.stringify({ [key]: value })} type="button" text='复制' />
              </>
            )
          }
        }
      ]} />
  );
};

export default memo(SecretTable);
