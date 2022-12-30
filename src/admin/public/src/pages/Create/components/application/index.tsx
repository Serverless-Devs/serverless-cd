import React, { useEffect, useState } from 'react';
import { history } from 'ice'
import { Button } from '@alicloud/console-components';
import dataList from './data.json'
import { getCardData } from "@/services/git"
import './index.less'


const data = dataList.data

const Application = (props) => {

  const buildApp = (name) => {
    history?.push(`/application?appName=${name}`)
    props.changeTab(name);
  }
  
  return (
    <div style={{display:'flex', flexFlow:'nowrap', justifyContent:'space-between', marginRight:'-8px', marginLeft:'-8px'}}>
        {
            data && data.length && data.map(( item ) => {
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
                             <Button type="primary" style={{marginRight:'20px'}} onClick={()=>{buildApp(item.name)}}>立即创建</Button>
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
