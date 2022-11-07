import React from "react";
import { Link } from 'ice';
// import { Button } from '@alicloud/console-components'
import './index.less';


const NotAppliaction = ({
  queryKey
}) => {

  return (
    <div className="project-not-app p-48 flex-c mt-20" style={{justifyContent: 'center', alignItems: 'center'}}>
      <p style={{fontWeight: 500, lineHeight:"20px"}}>没有搜索到应用</p>
      <p style={{color: '#444', marginTop: 8}}>您搜索关键字"{queryKey}"暂未发现应用</p>
      <Link to={'/create'} className="mt-16 fz-14" >
        创建应用
      </Link>
    </div>
  )
}

export default NotAppliaction