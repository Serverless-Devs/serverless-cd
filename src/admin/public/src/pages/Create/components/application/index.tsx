import React, { useEffect, useState } from 'react';
import { Card, Button } from '@alicloud/console-components';
import dataList from './data.json'
import { getCardData } from "@/services/git"
import './index.less'
// import { FORM_ITEM_LAYOUT } from '@/constants';
// import AuthDialog from './AuthDialog';
// import Repo from './Repo';
// import Trigger from './Trigger';
// import ConfigEdit from '@/components/ConfigEdit'

// const FormItem = Form.Item;
// const RadioGroup = Radio.Group;

interface IProps {
//   field: Field;
}

const data = dataList.data

const Application = (props: IProps) => {
    const [ actionVisible, setVisible ] = useState(false)
//   const { field } = props;
//   const { init, getValue, resetToDefault } = field;  
  useEffect(()=>{
    //   console.log('111111',getCardData({ type:'github', urlPath:'orgs/serverless-cd-demo/repos'}))
    console.log('00000',data)
  })
  
  return (
    <div style={{display:'flex', flexFlow:'wrap', justifyContent:'space-between'}}>
        {
            data && data.length && data.map(( item ) => {
               return ( 
               <Card 
                    className="templateCard" 
                    showHeadDivider={false}
                    style={{margin:'10px', flexBasis:'30%'}}
                    contentHeight={120}
                    actions={
                        <div className={`actionButtons ${actionVisible ? 'actionVisible':'actionHidden'}`}>
                            <Button>立即创建</Button>
                            <Button onClick={()=>{ window.open(item.html_url) }}>详情</Button>
                        </div>
                    }
                >
                    <h2>{item.name}</h2>
                    <p style={{color:'#888'}}>{item.full_name}</p>
                    <p>{item.description}</p>
               </Card> ) 
            })
        }
    </div>
  );
};

export default Application;
