import{r as e,l as s,R as t,N as a}from"./index.js";import{N as o,B as r}from"./index7.js";import{N as n}from"./index8.js";const{Row:l,Col:i}=n,m=n=>{const{value:m,onChange:p=s.exports.noop}=n,[c,d]=e.exports.useState([]);e.exports.useEffect((()=>{const e=s.exports.isEmpty(m)?[{id:s.exports.uniqueId(),key:"",value:"",showPassword:!0}]:s.exports.map(m,(e=>({...e,id:s.exports.uniqueId()})));d(e)}),[]),e.exports.useEffect((()=>{p(c)}),[JSON.stringify(c)]);const u=(e,t)=>{const a=s.exports.map(c,(s=>s.id===t.id?{...s,key:e}:s));d(a)},x=(e,t)=>{const a=s.exports.map(c,(s=>s.id===t.id?{...s,value:e}:s));d(a)},w=e=>{const t=s.exports.map(c,(s=>s.id===e.id?{...s,showPassword:!s.showPassword}:s));d(t)},y=()=>{d([...c,{id:s.exports.uniqueId(),key:"",value:"",showPassword:!0}])},h=e=>{const t=s.exports.filter(c,(s=>s.id!==e.id));d(t)};return t.createElement("div",{className:"env-container"},s.exports.map(c,(e=>t.createElement("div",{key:e.id},t.createElement(l,{gutter:16,className:"mb-8"},t.createElement(i,{span:"12"},t.createElement(o,{innerBefore:"\u53d8\u91cf",className:"full-width",placeholder:"\u8bf7\u8f93\u5165",value:e.key,onChange:s=>u(s,e)})),t.createElement(i,{span:"12",className:"env-value"},t.createElement(o,{innerBefore:"\u503c",placeholder:"\u8bf7\u8f93\u5165",htmlType:e.showPassword?"password":"text",value:e.value,onChange:s=>x(s,e),className:"full-width",innerAfter:t.createElement(a,{className:"mr-8 cursor-pointer",type:e.showPassword?"eye":"eye-slash",onClick:()=>w(e)})}),t.createElement(r,{type:"primary",text:!0,onClick:()=>h(e),className:"ml-8 mt-6",style:{position:"absolute"}},t.createElement(a,{type:"delete"}))))))),t.createElement(r,{onClick:y},t.createElement(a,{type:"add",className:"mr-4"}),"\u65b0\u589e"))};export{m as S};