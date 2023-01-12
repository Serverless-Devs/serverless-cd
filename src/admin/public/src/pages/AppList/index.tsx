import React, { useEffect, useState } from 'react';
import { useRequest, history } from 'ice';
import { listApp } from '@/services/applist';
import { Button, Search, Box, Grid, Loading } from '@alicloud/console-components';
import { map, filter, includes, debounce, isEmpty } from 'lodash';
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

const AppList = () => {
  const { data, request, loading } = useRequest(listApp);
  const [applist, setApplist] = useState<Array<IItem>>([]);
  const [queryKey, setQueryKey] = useState<string>('');

  const fetchData = async () => {
    const res = await request();
    setApplist(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSearch = (value: any) => {
    setQueryKey(value);
    if (data.length > 0) {
      setApplist(filter(data, (item) => includes(item.repo_name, value)));
    }
  };
  const debounceSearch = debounce(onSearch, 250, { maxWait: 1000 });

  const onCreateApp = () => {
    history?.push('/create');
  };

  if (loading) {
    return <Loading visible={loading} inline={false} style={{ minHeight: 500 }} />;
  }

  return (
    <PageLayout
      breadcrumbs={[
        {
          name: '应用列表',
        },
      ]}
      hideBackground
    >
      {isEmpty(data) ? (
        <CreateAppLication />
      ) : (
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
      )}
    </PageLayout>
  );
};

export default AppList;
