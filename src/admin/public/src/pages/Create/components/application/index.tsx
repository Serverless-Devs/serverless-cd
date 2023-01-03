import React,{ useEffect } from 'react';
import { history, useRequest } from 'ice'
import { get } from 'lodash';
import { Button, Dialog, Message } from '@alicloud/console-components';
import { getGithubData } from "@/services/git"
import './index.less'
import store from '@/store';

let dataList:any = []

const Application = (props) => {
  const [userState, userDispatchers] = store.useModel('user');
  const GetGithubData = useRequest(getGithubData);

  useEffect(() => {
    GetGithubData.request({ type:'github', urlPath:'orgs/serverless-cd-demo/repos' });
  },[])

  useEffect(() => {
    dataList = get(GetGithubData.data,'appCenterList',[])
  },[GetGithubData.data])
  
  const buildApp = ( app ) => {
    window.open(app.html_url + '/fork')
    Dialog.confirm({
      title: "提示",
      content:(
        <span style={{ fontSize: 12 }}>
          是否已完成fork操作
        </span>
      ),
      footerAlign: "right",
      onOk: () => {
        return new Promise(async(resolve,reject) => {
          const res = await userDispatchers.getUserRepos();
          let isFind = false;
          res.map((item)=>{
            if( item.name === app.name ){
              isFind = true;
              resolve(item.name);
            }
          })
          if( !isFind ){
            reject()
          }
          }).then(() => {
            Message.success("successfully!");
            history?.push(`/application?appName=${app.name}`)
            props.changeTab(app.name);
          },()=>{
            Message.error("未完成fork")
          })
      },
    });
  }
  
  return (
    <div style={{display:'flex', flexFlow:'wrap', justifyContent:'flex-start', minWidth:'800px', marginLeft:'-8px', marginRight:'-8px'}}>
        {
            dataList && dataList.length && dataList.map(( item ) => {
               return ( 
               <div className="templateCard">
                   <div className="imgDiv">
                       <img src="https://example-static.oss-cn-beijing.aliyuncs.com/serverless-app-store/Docusaurus.png"></img>
                   </div>
                   <div className="cardTitle">
                        <h2>{item.name}</h2>
                        <span className="tagSpan">社区</span>
                   </div>
                    <p>{item.description}</p>         
                    <div className={'actionButtons'}>
                             <Button type="primary" style={{marginRight:'20px'}} onClick={()=>{buildApp(item)}}>立即创建</Button>
                             <Button onClick={()=>{ window.open(item.html_url) }}>详情</Button>
                    </div>
               </div>
               ) 
            })
        }
    </div>
  );
};

export default Application;
