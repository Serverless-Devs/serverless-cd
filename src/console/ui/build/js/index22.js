import{r as e,a as t,l as s,R as r,aa as a,ab as o,T as n}from"./index.js";import{P as c,S as i,a as l}from"./SecretDrawer.js";import{P as u}from"./index3.js";import{B as m}from"./index7.js";import"./index6.js";import"./CopyIcon.js";import"./index5.js";import"./Secret.js";import"./index8.js";const p=undefined,d=()=>{const[p,d]=e.exports.useState([]),[x,f]=e.exports.useState(!1),{loading:S,request:E}=t(a),y=t(o),j=s.exports.get(y.data,"data.secrets",{}),v=e.exports.useRef();e.exports.useEffect((()=>{y.request()}),[]),e.exports.useEffect((()=>{s.exports.isEmpty(j)||d(k(j))}),[j]);const b=async()=>{var e,t;const r=(null==(e=null==v?void 0:v.current)?void 0:e.getValue("secrets"))||[],a={};s.exports.forEach(r,(({key:e,value:t})=>{a[e]=t}));const{success:o}=await E({secrets:a,isAdd:x});o&&(n.success("\u914d\u7f6e\u6210\u529f"),null==(t=null==v?void 0:v.current)||t.closeDrawer(),y.request())},g=e=>{var t,s;f(e),e||null==(t=null==v?void 0:v.current)||t.setValue("secrets",p),null==(s=null==v?void 0:v.current)||s.setVisible(!0)},k=e=>s.exports.map(s.exports.keys(e),(t=>({key:t,value:e[t],showPassword:!1})));return r.createElement(u,{title:"Secrets",breadcrumbExtra:r.createElement(m,{type:"primary",onClick:()=>g(!0)},"\u65b0\u589eSecret"),breadcrumbs:[{name:"\u8bbe\u7f6e"},{name:"Secrets"}]},r.createElement(c,{title:"\u5bc6\u94a5\u914d\u7f6e",extra:r.createElement(m,{type:"primary",text:!0,onClick:()=>g(!1)},"\u7f16\u8f91")},r.createElement(i,{secretList:p,loading:y.loading,setSecretList:d})),r.createElement(l,{title:x?"\u65b0\u589eSecret":"\u7f16\u8f91Secret",loading:S,ref:v,onSubmit:b}))};export{d as default};
