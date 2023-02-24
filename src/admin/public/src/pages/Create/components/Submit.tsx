import React, { useRef } from 'react';
import { Field, Button, Dialog, Step, Icon } from '@alicloud/console-components';
import { createApp } from '@/services/applist';
import { manualDeployApp } from '@/services/task';
import { checkFile, githubPutFile } from '@/services/git';
import { useRequest, history } from 'ice';
import { CREATE_TYPE, SERVERLESS_PIPELINE_CONTENT } from './constant';
import { get, map, every, find, uniqWith, isEqual, isEmpty } from 'lodash';
import { getConsoleConfig, sleep } from '@/utils';
import { Toast } from '@/components/ToastContainer';
import CodeMirror from '@/components/CodeMirror';
import yaml from 'js-yaml';
import { TYPE as ENV_TYPE } from '@/components/EnvType';

interface IProps {
  field: Field;
  orgName: string;
}

interface IStepItem {
  title: string;
  branch: string;
  key: string;
  current: number;
  status: 'pending' | 'success' | 'failure';
}

const Submit = (props: IProps) => {
  const { orgName } = props;
  const CD_PIPELINE_YAML = getConsoleConfig('CD_PIPELINE_YAML', 'serverless-pipeline.yaml');
  const { loading, request } = useRequest(createApp);
  const manualDeploy = useRequest(manualDeployApp);
  const field = Field.useField();
  const { init, setValue, getValue } = field;
  const isDeploy = useRef(false);

  const handleCreate = async () => {
    setValue('submitLoading', true);
    const values = props.field.getValues();
    const errorBranch: IStepItem[] = getValue('errorBranch');
    for (const item of errorBranch) {
      await githubPutFile({
        owner: get(values, 'repo.owner'),
        repo: get(values, 'repo.name'),
        path: CD_PIPELINE_YAML,
        message: `add ${CD_PIPELINE_YAML} by Serverless CD`,
        content: getValue('yaml'),
        branch: item.branch,
      });
    }
    await doCreate();
  };

  const doCreate = async () => {
    setValue('submitLoading', true);
    const values: any = props.field.getValues();
    const precise: string[] = map(values['trigger'], (item) => item.branch);
    const trigger_spec: any = {
      [values['gitType']]: { push: { branches: { precise: uniqWith(precise, isEqual) } } },
    };
    const dataMap = {
      [CREATE_TYPE.Repository]: {
        provider: get(values, 'gitType'),
        description: get(values, 'description'),
        repo_url: get(values, 'repo.url'),
        repo: get(values, 'repo.name'),
        owner: get(values, 'repo.owner'),
        provider_repo_id: String(get(values, 'repo.id')),
        environment: {
          default: {
            type: ENV_TYPE.TESTING,
            trigger_spec,
            secrets: get(values, 'secrets', {}),
            cd_pipeline_yaml: CD_PIPELINE_YAML,
          },
        },
      },
    };
    const { success, data } = await request(dataMap[get(values, 'createType')]);
    if (success) {
      if (get(isDeploy, 'current') && data.id && !isEmpty(values['trigger'])) {
        await manualDeploy.request({
          appId: data.id,
          ref: `refs/heads/${get(values, 'trigger[0].branch')}`,
        });
      }
      await sleep(1500);
      Toast.success('应用创建成功');

      // /${orgName} = > /${orgName}/application 重新加载应用列表
      history?.push(`/${orgName}`);
    }
    setValue('submitLoading', false);
  };

  const berforeCreate = async (deployState) => {
    isDeploy.current = deployState;
    props.field.validate(async (errors, values) => {
      if (errors) return;
      let branchList: string[] = map(values['trigger'], (item) => item.branch);
      branchList = uniqWith(branchList, isEqual);
      const stepData: IStepItem[] = map(branchList, (branch, index) => {
        return {
          key: branch,
          title: `检查${branch}分支是否存在${CD_PIPELINE_YAML}文件`,
          status: 'pending',
          current: Number(index),
          branch,
        };
      });
      setValue('showDialog', true);
      // 设置当前步骤
      setValue('current', 0);
      setValue('yaml', yaml.dump(SERVERLESS_PIPELINE_CONTENT));
      setValue('finished', false);
      setValue('errorBranch', []);
      setValue('count', 3);
      setValue('stepData', stepData);
      for (let index = 0; index < stepData.length; index++) {
        const newStepData = getValue('stepData') as [];
        const ele: IStepItem = stepData[index];
        try {
          const res = await checkFile({
            clone_url: values['repo']['url'],
            ref: `refs/heads/${ele.branch}`,
            provider: get(values, 'gitType'),
            owner: get(values, 'repo.owner'),
            file: CD_PIPELINE_YAML,
          });
          setValue('current', index + 1);
          if (res) {
            setValue(
              'stepData',
              map(newStepData, (item: IStepItem) => {
                if (item.key === ele.key) {
                  item.status = 'success';
                }
                return item;
              }),
            );
          } else {
            onErrorBranch(ele, newStepData);
          }
        } catch {
          onErrorBranch(ele, newStepData);
        }
      }
      setValue('finished', true);
      const successed = every(getValue('stepData'), (item: IStepItem) => item.status === 'success');
      if (successed) {
        await doCreate();
      }
    });
  };

  const onErrorBranch = (ele, newStepData) => {
    const errorBranch: IStepItem[] = getValue('errorBranch');
    errorBranch.push(ele);
    setValue(
      'stepData',
      map(newStepData, (item: IStepItem) => {
        if (item.key === ele.key) {
          item.status = 'failure';
        }
        return item;
      }),
    );
  };

  const itemRender = (index: number, status: string) => {
    const stepData: IStepItem[] = getValue('stepData');
    const findObj = find(stepData, (obj) => obj.current === index);
    switch (status) {
      case 'process':
        return <Icon size="small" type="loading" className="mt-3" />;
      case 'finish':
        return (
          <Icon
            size="small"
            type={findObj?.status === 'failure' ? 'error' : 'success'}
            className="mt-3"
          />
        );
      case 'await':
      default:
        return (
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5166"
            width="20"
            height="20"
            className="mt-5"
          >
            <path
              d="M512 917.381727c-223.886093 0-405.381727-181.495634-405.381727-405.381727S288.113907 106.618273 512 106.618273s405.381727 181.495634 405.381727 405.381727S735.886093 917.381727 512 917.381727zM528.21531 498.606968l0-278.482549-32.43062 0 0 291.834648-0.040932 0.040932 206.386534 206.386534 22.932292-22.932292L528.21531 498.606968z"
              p-id="5167"
              fill="#cccccc"
            ></path>
          </svg>
        );
    }
  };

  const renderResult = () => {
    const errorBranch: IStepItem[] = getValue('errorBranch');
    if (errorBranch?.length > 0) {
      return (
        <>
          <div className="mb-16" style={{ fontWeight: 600 }}>
            {map(errorBranch, (item) => {
              return (
                <div>
                  检测到{item.branch}分支不存在{CD_PIPELINE_YAML}文件。
                </div>
              );
            })}
            您可以编辑yaml文件的默认内容，点击'确定'按钮会将文件commit到您的仓库，然后继续创建应用。
          </div>
          <CodeMirror
            height="300px"
            {...(init('yaml', {
              initValue: yaml.dump(SERVERLESS_PIPELINE_CONTENT),
            }) as any)}
            width={'100%'}
          />
        </>
      );
    }
    return getValue('submitLoading') && <div style={{ fontWeight: 600 }}> 创建应用中...</div>;
  };

  return (
    <>
      <Button
        className="mt-32 mr-8"
        type="primary"
        onClick={() => berforeCreate(false)}
        loading={loading}
      >
        创建
      </Button>
      <Button className="mt-32" onClick={() => berforeCreate(true)} loading={loading}>
        创建并部署
      </Button>
      <Dialog
        size="medium"
        title="前置检查"
        closeMode={[]}
        visible={getValue('showDialog')}
        footer={
          (getValue('errorBranch') as [])?.length > 0
            ? [
                <Button
                  type="primary"
                  onClick={handleCreate}
                  style={{ marginRight: 8 }}
                  loading={getValue('submitLoading')}
                >
                  确定
                </Button>,
                <Button onClick={() => setValue('showDialog', false)}>取消</Button>,
              ]
            : []
        }
      >
        <div className="create-submit-step">
          <Step
            itemRender={itemRender}
            current={getValue('current')}
            direction="ver"
            animation={false}
          >
            {map(getValue('stepData') as [], (item: IStepItem, index: number) => (
              <Step.Item
                key={item.key}
                title={item.title}
                content={
                  getValue('current') === index && (
                    <div className="color-error">{getValue('errorMsg')}</div>
                  )
                }
              />
            ))}
          </Step>
          {getValue('finished') && renderResult()}
        </div>
      </Dialog>
    </>
  );
};

export default Submit;
