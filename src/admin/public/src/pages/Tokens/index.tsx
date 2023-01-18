import React, { useEffect, useState } from 'react';
import { useRequest } from 'ice';
import { Form, Input, Select, Table, Button, Message, Dialog } from '@alicloud/console-components';
import { get, isEmpty } from 'lodash';
import { getTokenList, createToken, removeToken } from '@/services/setting';
import moment from 'moment';
import PageLayout from '@/layouts/PageLayout';
import CopyIcon from '@/components/CopyIcon';
import './index.less';

const FormItem = Form.Item;

const columns = (tableRequest) => {
  const RemoveToken = useRequest(removeToken);

  const onDelete = (id) => {
    Dialog.confirm({
      title: '删除Token',
      content: '您确定删除当前Token吗？',
      onOk: async () => {
        const { success } = await RemoveToken.request({ id });
        success && tableRequest();
      },
    });
  };

  return [
    {
      title: '简述',
      dataIndex: 'description',
    },
    {
      title: '最近登录',
      dataIndex: 'active_time',
      cell: (value) => (
        <span>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '暂未登录'}</span>
      ),
    },
    {
      title: '有效期时间',
      dataIndex: 'expire_time',
      cell: (value) => (
        <span>
          {value === -1 ? (
            '永久时长'
          ) : Date.now() > value ? (
            <span style={{ color: '#f5a623' }}>已失效</span>
          ) : (
            moment(value).format('YYYY-MM-DD')
          )}
        </span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'id',
      cell: (value) => {
        return (
          <>
            <Button type="primary" text onClick={() => onDelete(value)}>
              删除
            </Button>
          </>
        );
      },
    },
  ];
};

const options = [
  { value: 86400000, label: '1 days' },
  { value: 604800000, label: '7 days' },
  { value: 2592000000, label: '30 days' },
  { value: 5184000000, label: '60 days' },
  { value: 7776000000, label: '90 days' },
  { value: 15552000000, label: '180 days' },
  { value: -1, label: 'No Expiration' },
];

const Tokens = () => {
  const [visible, setVisible] = useState(false);
  const [generateVisble, setGenerateVisble] = useState(false);
  const [expireTime, setExprireTime] = useState(null);
  const { loading, data, request } = useRequest(getTokenList);
  const CreateToken = useRequest(createToken);
  const tokenList = get(data, 'result', []);
  const token = get(CreateToken.data, 'data.cd_token', '');

  useEffect(() => {
    request();
  }, []);

  useEffect(() => {
    if (CreateToken.data && get(CreateToken.data, 'data', '')) {
      onClose();
      setGenerateVisble(true);
      setTimeout(() => {
        request();
      }, 800);
    }
  }, [CreateToken.data]);

  const onClose = () => {
    setExprireTime(null);
    setVisible(false);
  };

  const handleSubmit = (values, errors) => {
    const { description, expiration } = values;
    if (isEmpty(errors)) {
      CreateToken.request({ description, expiration });
    }
  };

  return (
    <PageLayout
      title="Tokens"
      breadcrumbs={[
        {
          name: '设置',
        },
        {
          name: 'Tokens',
        },
      ]}
    >
      <Message type="notice">您生成的令牌可以用于访问ServicelessCD API。</Message>

      <Button type="primary" className="mr-10 mt-25 mb-25" onClick={() => setVisible(true)}>
        创建
      </Button>

      <Table
        dataSource={tokenList}
        loading={loading}
        hasBorder={false}
        columns={columns(request)}
      ></Table>

      <Dialog size="small" title="创建Token" footer={false} visible={visible} onClose={onClose}>
        <Message type="notice" className="dialog-message">
          个人访问令牌的功能与普通OAuth访问令牌类似。它们可以用来代替HTTPS上的Git的密码，也可以用来通过基本身份验证对API进行身份验证。
        </Message>
        <Form colon>
          <FormItem name="description" label="简述" required>
            <Input />
          </FormItem>
          <FormItem name="expiration" label="有效期" required>
            <Select
              placeholder="请选择日期"
              dataSource={options}
              onChange={(value) => setExprireTime(value)}
              style={{ width: 150, marginRight: 20 }}
            />
            {expireTime && (
              <span>
                {expireTime === -1
                  ? '永久有效期'
                  : `有效期至：${moment(Date.now() + expireTime).format('YYYY-MM-DD')}`}
              </span>
            )}
          </FormItem>
          <FormItem style={{ textAlign: 'right' }}>
            <Form.Submit
              validate
              type="primary"
              onClick={handleSubmit}
              loading={CreateToken.loading}
              style={{ marginRight: 10 }}
            >
              创建
            </Form.Submit>
            <Button onClick={onClose}>取消</Button>
          </FormItem>
        </Form>
      </Dialog>

      <Dialog
        size="small"
        title="生成Token"
        footer={[<Button onClick={() => setGenerateVisble(false)}>取消</Button>]}
        visible={generateVisble}
        onClose={() => setGenerateVisble(false)}
      >
        <Message type="notice" className="dialog-message">
          请复制您的Token，并将其保存在安全的地方。出于安全考虑，我们不能再显示了
        </Message>
        <div className="snippet-token flex-r">
          {token}
          <CopyIcon content={token} />
        </div>
      </Dialog>
    </PageLayout>
  );
};

export default Tokens;
