import React, { useEffect, useState } from 'react';
import { useRequest, history } from 'ice';
import { listApp } from '@/services/applist';
import { Button, Search, Box, Grid, Loading } from '@alicloud/console-components';
import { map, filter, includes, isEmpty, get, debounce } from 'lodash';
import PageLayout from '@/layouts/PageLayout';
import ProjectCard from './components/ProjectCard';
import NotAppliaction from './components/NotAppliaction';
import { CreateAppLication } from '../Create';

const { Row, Col } = Grid;
interface IItem {
  providerUid: number;
  userId: string;
  repo: string;
  provider: string;
  repo_name: string;
  createdTime: number;
}

const Dashboard = () => {
  const { data, request, cancel } = useRequest(listApp, { pollingInterval: 5000 });
  const [applist, setApplist] = useState<Array<IItem>>([]);
  const [loading, setLoading] = useState(false);
  const [sourceApplist, setSourceApplist] = useState<Array<IItem>>([]);
  const [queryKey, setQueryKey] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    request();
  }, []);

  useEffect(() => {
    if (!data) return;
    setLoading(false);
    if (data?.length > 0) {
      const notDeployList = filter(data, (item: any) => !get(item, 'latest_task.completed'));
      if (isEmpty(notDeployList)) {
        cancel();
      }
      setApplist(data);
      setSourceApplist(data);
    } else {
      cancel();
    }
  }, [data]);

  const onSearch = (value: any) => {
    setQueryKey(value);
    if (sourceApplist.length > 0) {
      setApplist(filter(sourceApplist, (item) => includes(item.repo_name, value)));
    }
  };
  const debounceSearch = debounce(onSearch, 250, { maxWait: 1000 });

  const onCreateApp = () => {
    history?.push('/create');
  };

  return (
    <PageLayout
      breadcrumbs={[
        {
          name: '应用列表',
        },
      ]}
      hideBackground
    >
      {loading ? (
        <Loading visible={loading} style={{ width: '100%' }} />
      ) : data && data.length > 0 ? (
        <>
          <Box spacing={10} direction="row">
            <Search
              size="large"
              shape="simple"
              placeholder="Search"
              onChange={debounceSearch}
              style={{ flex: 1 }}
            />
            <Button size="large" type="primary" onClick={onCreateApp}>
              创建应用
            </Button>
          </Box>
          {applist.length > 0 ? (
            <Row wrap className="mt-24" gutter={24}>
              {map(applist, (item) => (
                <Col span="6" className="applist-col">
                  <ProjectCard key={item.providerUid} item={item} />
                </Col>
              ))}
            </Row>
          ) : (
            <NotAppliaction queryKey={queryKey} />
          )}
        </>
      ) : (
        <CreateAppLication />
      )}
    </PageLayout>
  );
};

export default Dashboard;
