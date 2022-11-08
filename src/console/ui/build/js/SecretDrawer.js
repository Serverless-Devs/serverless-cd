import{v as e,_ as t,d as o,e as l,i as n,R as r,N as a,j as i,r as s,P as c,s as d,J as u,f as p,C as f,A as m,q as h,z as v,l as y}from"./index.js";import{B as g}from"./index6.js";import{T as b,C as x}from"./CopyIcon.js";import{S as w}from"./Secret.js";import{w as C,B as k}from"./index7.js";import{a as O}from"./index8.js";var E,N,P=function e(){},T=e.pickOthers,S=(N=E=function(e){function s(){return o(this,s),l(this,e.apply(this,arguments))}return t(s,e),s.prototype.renderHeader=function e(){var t,o=this.props,l=o.prefix,a=o.title,i=o.headerStyle,s=this.renderCloseLink(),c=n(((t={})[l+"drawer-header"]=!0,t[l+"drawer-no-title"]=!a,t));return r.createElement("div",{className:c,style:i,role:"heading","aria-level":"1"},a,s)},s.prototype.renderBody=function e(){var t=this.props,o=t.prefix,l=t.children,n=t.bodyStyle;return l?r.createElement("div",{className:o+"drawer-body",style:n},l):null},s.prototype.renderCloseLink=function e(){var t=this.props,o=t.prefix,l=t.closeable,n=t.onClose,i=t.locale;return l?r.createElement("a",{role:"button","aria-label":i.close,className:o+"drawer-close",onClick:n},r.createElement(a,{className:o+"drawer-close-icon",type:"close"})):null},s.prototype.render=function e(){var t,o=this.props,l=o.prefix,a=o.className,c=o.closeable,d=o.placement,u=o.role,p=o.rtl,f=T(Object.keys(s.propTypes),this.props),m=n(((t={})[l+"drawer"]=!0,t[l+"drawer-"+d]=!0,t[l+"closeable"]=c,t[a]=!!a,t)),h={role:u,"aria-modal":"true"},v=this.renderHeader(),y=this.renderBody();return r.createElement("div",i({},h,{className:m},f,{dir:p?"rtl":void 0}),r.createElement("div",{style:{height:"100%",overflow:"auto"}},v,y))},s}(s.exports.Component),E.propTypes={prefix:c.string,className:c.string,closeable:c.bool,role:c.string,title:c.node,placement:c.oneOf(["top","right","bottom","left"]),rtl:c.bool,onClose:c.func,locale:c.object,headerStyle:c.object,bodyStyle:c.object,afterClose:c.func,beforeOpen:c.func,beforeClose:c.func,cache:c.bool,shouldUpdatePosition:c.bool},E.defaultProps={prefix:"next-",closeable:!0,role:"dialog",onClose:P,locale:d.Drawer},N),L,j;S.displayName="Inner";var A=function e(){},D=u.Popup,B=e.pickOthers,M=(j=L=function(e){function n(){var t,r,a;o(this,n);for(var i=arguments.length,s=Array(i),c=0;c<i;c++)s[c]=arguments[c];return t=r=l(this,e.call.apply(e,[this].concat(s))),r.getAlign=function(e){var t=void 0;switch(e){case"top":case"left":t="tl tl";break;case"bottom":t="bl bl";break;default:t="tr tr"}return t},r.getAnimation=function(e){if("animation"in r.props)return r.props.animation;var t=void 0;switch(e){case"top":t={in:"slideInDown",out:"slideOutUp"};break;case"bottom":t={in:"slideInUp",out:"slideOutDown"};break;case"left":t={in:"slideInLeft",out:"slideOutLeft"};break;default:t={in:"slideInRight",out:"slideOutRight"}}return t},r.getOverlayRef=function(e){r.overlay=e},r.mapcloseableToConfig=function(e){return["esc","close","mask"].reduce((function(t,o){var l=o.charAt(0).toUpperCase()+o.substr(1),n="boolean"==typeof e?e:e.split(",").indexOf(o)>-1;return"esc"===o||"mask"===o?t["canCloseBy"+l]=n:t["canCloseBy"+l+"Click"]=n,t}),{})},r.handleVisibleChange=function(e,t,o){var l=r.props,n=l.onClose,a=l.onVisibleChange;!1===e&&n&&n(t,o),a&&a(e,t,o)},l(r,a=t)}return t(n,e),n.prototype.renderInner=function e(t){var o=this.props,l=o.prefix,a=o.className,s=o.children,c=o.title,d=o.onClose,u=o.locale,p=o.headerStyle,f=o.bodyStyle,m=o.placement,h=o.rtl,v=B(Object.keys(n.propTypes),this.props);return r.createElement(S,i({prefix:l,title:c,className:a,locale:u,closeable:t,rtl:h,headerStyle:p,bodyStyle:f,placement:m,onClose:d.bind(this,"closeClick")},v),s)},n.prototype.render=function e(){var t=this.props,o=t.prefix,l=t.style,n=t.width,a=t.height,s=t.trigger,c=t.triggerType;t.animation;var d=t.hasMask,u=t.visible,f=t.placement;t.onClose,t.onVisibleChange;var m=t.closeable,h=t.closeMode,v=t.rtl,y=t.popupContainer,g=p(t,["prefix","style","width","height","trigger","triggerType","animation","hasMask","visible","placement","onClose","onVisibleChange","closeable","closeMode","rtl","popupContainer"]),b=i({width:n,height:a},l),x="closeMode"in this.props?Array.isArray(h)?h.join(","):h:m,w=this.mapcloseableToConfig(x),C=w.canCloseByCloseClick,k=p(w,["canCloseByCloseClick"]),O=i({prefix:o,visible:u,trigger:s,triggerType:c,onVisibleChange:this.handleVisibleChange,animation:this.getAnimation(f),hasMask:d,align:this.getAlign(f)},k,{canCloseByOutSideClick:!1,disableScroll:!0,ref:this.getOverlayRef,rtl:v,target:"viewport",style:b,needAdjust:!1,container:y}),E=this.renderInner(C);return r.createElement(D,i({},O,g),E)},n}(s.exports.Component),L.displayName="Drawer",L.propTypes=i({},D.propTypes||{},{prefix:c.string,pure:c.bool,rtl:c.bool,trigger:c.element,triggerType:c.oneOfType([c.string,c.array]),width:c.oneOfType([c.number,c.string]),height:c.oneOfType([c.number,c.string]),closeable:c.oneOfType([c.string,c.bool]),cache:c.bool,closeMode:c.oneOfType([c.arrayOf(c.oneOf(["close","mask","esc"])),c.oneOf(["close","mask","esc"])]),onClose:c.func,afterOpen:c.func,placement:c.oneOf(["top","right","bottom","left"]),title:c.node,headerStyle:c.object,bodyStyle:c.object,visible:c.bool,hasMask:c.bool,onVisibleChange:c.func,animation:c.oneOfType([c.object,c.bool]),locale:c.object,popupContainer:c.any}),L.defaultProps={prefix:"next-",triggerType:"click",trigger:null,closeable:!0,onClose:A,hasMask:!0,placement:"right",locale:d.Drawer},j);M.displayName="Drawer",M.Inner=S;var R=f.config(M),I={momentLocale:"zh-cn",Timeline:{expand:"\u5c55\u5f00",fold:"\u6536\u8d77"},Balloon:{close:"\u5173\u95ed"},Card:{expand:"\u5c55\u5f00",fold:"\u6536\u8d77"},Calendar:{today:"\u4eca\u5929",now:"\u6b64\u523b",ok:"\u786e\u5b9a",clear:"\u6e05\u9664",month:"\u6708",year:"\u5e74",prevYear:"\u4e0a\u4e00\u5e74",nextYear:"\u4e0b\u4e00\u5e74",prevMonth:"\u4e0a\u4e2a\u6708",nextMonth:"\u4e0b\u4e2a\u6708",prevDecade:"\u4e0a\u5341\u5e74",nextDecade:"\u540e\u5341\u5e74",yearSelectAriaLabel:"\u9009\u62e9\u5e74\u4efd",monthSelectAriaLabel:"\u9009\u62e9\u6708\u4efd"},DatePicker:{placeholder:"\u8bf7\u9009\u62e9\u65e5\u671f",datetimePlaceholder:"\u8bf7\u9009\u62e9\u65e5\u671f\u548c\u65f6\u95f4",monthPlaceholder:"\u8bf7\u9009\u62e9\u6708",yearPlaceholder:"\u8bf7\u9009\u62e9\u5e74",weekPlaceholder:"\u8bf7\u9009\u62e9\u5468",now:"\u6b64\u523b",selectTime:"\u9009\u62e9\u65f6\u95f4",selectDate:"\u9009\u62e9\u65e5\u671f",ok:"\u786e\u5b9a",clear:"\u6e05\u9664",startPlaceholder:"\u8d77\u59cb\u65e5\u671f",endPlaceholder:"\u7ed3\u675f\u65e5\u671f",hour:"\u65f6",minute:"\u5206",second:"\u79d2"},Dialog:{close:"\u5173\u95ed",ok:"\u786e\u5b9a",cancel:"\u53d6\u6d88"},Drawer:{close:"\u5173\u95ed",ok:"\u786e\u5b9a",cancel:"\u53d6\u6d88"},Message:{closeAriaLabel:"\u5173\u95ed"},Pagination:{prev:"\u4e0a\u4e00\u9875",next:"\u4e0b\u4e00\u9875",goTo:"\u5230\u7b2c",page:"\u9875",go:"\u786e\u5b9a",total:"\u7b2c{current}\u9875\uff0c\u5171{total}\u9875",labelPrev:"\u4e0a\u4e00\u9875\uff0c\u5f53\u524d\u7b2c{current}\u9875",labelNext:"\u4e0b\u4e00\u9875\uff0c\u5f53\u524d\u7b2c{current}\u9875",inputAriaLabel:"\u8bf7\u8f93\u5165\u8df3\u8f6c\u5230\u7b2c\u51e0\u9875",selectAriaLabel:"\u8bf7\u9009\u62e9\u6bcf\u9875\u663e\u793a\u51e0\u6761",pageSize:"\u6bcf\u9875\u663e\u793a\uff1a"},Input:{clear:"\u6e05\u9664"},List:{empty:"\u6ca1\u6709\u6570\u636e"},Select:{selectPlaceholder:"\u8bf7\u9009\u62e9",autoCompletePlaceholder:"\u8bf7\u8f93\u5165",notFoundContent:"\u65e0\u9009\u9879",maxTagPlaceholder:"\u5df2\u9009\u62e9 {selected}/{total} \u9879",selectAll:"\u5168\u9009"},Table:{empty:"\u6ca1\u6709\u6570\u636e",ok:"\u786e\u5b9a",reset:"\u91cd\u7f6e",asc:"\u5347\u5e8f",desc:"\u964d\u5e8f",expanded:"\u5df2\u5c55\u5f00",folded:"\u5df2\u6298\u53e0",filter:"\u7b5b\u9009",selectAll:"\u5168\u9009"},TimePicker:{placeholder:"\u8bf7\u9009\u62e9\u65f6\u95f4",clear:"\u6e05\u9664",hour:"\u65f6",minute:"\u5206",second:"\u79d2"},Transfer:{items:"\u9879",item:"\u9879",moveAll:"\u79fb\u52a8\u5168\u90e8",searchPlaceholder:"\u8bf7\u8f93\u5165",moveToLeft:"\u64a4\u9500\u9009\u4e2d\u5143\u7d20",moveToRight:"\u63d0\u4ea4\u9009\u4e2d\u5143\u7d20"},Upload:{card:{cancel:"\u53d6\u6d88",addPhoto:"\u4e0a\u4f20\u56fe\u7247",download:"\u4e0b\u8f7d",delete:"\u5220\u9664"},drag:{text:"\u70b9\u51fb\u6216\u8005\u62d6\u52a8\u6587\u4ef6\u5230\u865a\u7ebf\u6846\u5185\u4e0a\u4f20",hint:"\u652f\u6301 docx, xls, PDF, rar, zip, PNG, JPG \u7b49\u7c7b\u578b\u7684\u6587\u4ef6"},upload:{delete:"\u5220\u9664"}},Search:{buttonText:"\u641c\u7d22"},Tag:{delete:"\u5220\u9664"},Rating:{description:"\u8bc4\u5206\u9009\u9879"},Switch:{on:"\u5df2\u6253\u5f00",off:"\u5df2\u5173\u95ed"},Tab:{closeAriaLabel:"\u5173\u95ed"}},V=function(){return V=Object.assign||function(e){for(var t,o=1,l=arguments.length;o<l;o++)for(var n in t=arguments[o])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e},V.apply(this,arguments)},z=function(e,t){var o={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(o[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var n=0,l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(o[l[n]]=e[l[n]]);return o},F=C(r.forwardRef((function(e,t){var o,l,a=e.visible,i=void 0!==a&&a,c=e.onOk,d=e.onCancel,u=e.renderFooter,p=e.hasFooterLine,f=e.footerAlign,v=e.children,y=e.locale,g=void 0===y?I.Drawer:y,b=e.okText,x=void 0===b?g.ok:b,w=e.cancelText,C=void 0===w?g.cancel:w,O=e.cancelBtnProps,E=void 0===O?{}:O,N=e.okBtnProps,P=void 0===N?{}:N,T=e.footerClass,S=e.size,L=void 0===S?"mini":S,j=e.width,A=e.className,D=e.actionRef,B=z(e,["visible","onOk","onCancel","renderFooter","hasFooterLine","footerAlign","children","locale","okText","cancelText","cancelBtnProps","okBtnProps","footerClass","size","width","className","actionRef"]),M=s.exports.useState(i),F=M[0],H=M[1],U=s.exports.useState(!1),K=U[0],J=U[1],q=s.exports.useState(!1),G=q[0];q[1];var Y=s.exports.useRef(null),W=m("--alicloudfe-components-theme").trim(),_,Q,X,Z;null==D||D((function(){H(!0)}),(function(){H(!1)}),(function(e){J(e)}),(function(e){}));var $=function(e){var t,o,l,n;if((null==e?void 0:e.current)&&"wind"!==W&&!W.startsWith("xconsole")){var r=h.findDOMNode(e.current),a=null===(o=null===(t=null==r?void 0:r.getElementsByClassName("next-drawer"))||void 0===t?void 0:t[0])||void 0===o?void 0:o.firstChild;a&&(a.style.overflow="hidden");var i=null===(l=null==r?void 0:r.getElementsByClassName("next-drawer-body"))||void 0===l?void 0:l[0];i&&(i.style.overflow="auto");var s=null===(n=null==r?void 0:r.getElementsByClassName("next-drawer-footer"))||void 0===n?void 0:n[0];s&&((null==i?void 0:i.clientHeight)<(null==i?void 0:i.scrollHeight)?s.classList.add("next-drawer-footer-has-shadow"):s.classList.remove("next-drawer-footer-has-shadow"))}},ee=null;s.exports.useEffect((function(){var e;$(null!=t?t:Y);var o=h.findDOMNode((null!=t?t:Y).current),l=null===(e=null==o?void 0:o.getElementsByClassName("next-drawer-body"))||void 0===e?void 0:e[0];return l&&!ee&&(ee=new MutationObserver((function(){$(null!=t?t:Y)}))).observe(l,{attributes:!0,attributeFilter:["style"],attributeOldValue:!0,childList:!0,subtree:!0}),function(){ee&&(ee.disconnect(),ee.takeRecords(),ee=null)}})),s.exports.useEffect((function(){H(i)}),[i]);var te=n(((o={"next-drawer-has-footer":c||d||u})[A]=!!A,o)),oe=n(((l={"next-drawer-footer":!0,"next-drawer-footer-line":p,"next-drawer-footer-right":"right"===f,"next-drawer-footer-left":"left"===f,"next-drawer-footer-center":"center"===f})[T]=!!T,l)),le=function(){if(j)return j;if(L)switch(L){case"mini":default:return 400;case"small":return 600;case"medium":return 800;case"large":return 1200}};return r.createElement(R,V({},B,{ref:t||Y,visible:F,width:le(),className:te}),v,(c||d||u)&&r.createElement("div",{className:oe},c&&!u&&r.createElement(k,V({type:"primary",onClick:c,style:{marginRight:8},loading:K},P),x),d&&!u&&r.createElement(k,V({onClick:d,loading:G},E),C),u&&u))}))),H=function(e){var t=e.onOk,o=e.onCancel,l=e.onClose,n=e.content,a=z(e,["onOk","onCancel","onClose","content"]),i,s,c;i=function(e){var o,l,n;if(t){var r=null==t?void 0:t(e);if(r instanceof Promise&&(null===(o=null==c?void 0:c.setOKLoading)||void 0===o||o.call(c,!0),r.then((function(e){var t,o,l;if(!1!==e)return null===(t=null==c?void 0:c.setOKLoading)||void 0===t||t.call(c,!1),void(null===(o=null==c?void 0:c.close)||void 0===o||o.call(c));null===(l=null==c?void 0:c.setOKLoading)||void 0===l||l.call(c,!1)})).catch((function(){}))),"boolean"==typeof r&&r)return void(null===(l=null==c?void 0:c.close)||void 0===l||l.call(c))}else null===(n=null==c?void 0:c.close)||void 0===n||n.call(c)},s=function(e){var t,l,n;if(o){var r=null==o?void 0:o(e);if(r instanceof Promise&&(null===(t=null==c?void 0:c.setCancelLoading)||void 0===t||t.call(c,!0),r.then((function(e){var t,o;!1!==e&&(null===(t=null==c?void 0:c.setCancelLoading)||void 0===t||t.call(c,!1),null===(o=null==c?void 0:c.close)||void 0===o||o.call(c))})).catch((function(){}))),"boolean"==typeof r&&r)return void(null===(l=null==c?void 0:c.close)||void 0===l||l.call(c))}else null===(n=null==c?void 0:c.close)||void 0===n||n.call(c)};var d=f.config(F,{componentName:"Drawer"}),u=document.createElement("div");u.setAttribute("id","next-quick-drawer"),document.body.appendChild(u);var p=f.getContext();return h.render(r.createElement(f,V({},p),r.createElement(d,V({},a,{visible:!0,actionRef:function(e,t,o,l){c={show:e,close:t,setOKLoading:o,setCancelLoading:l}},onOk:i,onCancel:s,onClose:null!=l?l:function(){var e;null===(e=null==c?void 0:c.close)||void 0===e||e.call(c)}}),n)),u),{hide:function(){var e;null===(e=null==c?void 0:c.close)||void 0===e||e.call(c)},show:function(){var e;null===(e=null==c?void 0:c.show)||void 0===e||e.call(c)}}};v(F,R),F.displayName=R.displayName,F.show=H;var U=F;const K=e=>{const{title:t,extra:o,children:l}=e;return s.exports.createElement(g,{spacing:8},s.exports.createElement("div",{className:"box-hd flex-r",style:{justifyContent:"flex-start"}},s.exports.createElement("h3",{className:"mr-10"},t),o),l)},J=({secretList:e,loading:t=!1,setSecretList:o})=>{const l=t=>{const l=y.exports.map(e,(e=>e.key===t.key?{...e,showPassword:!e.showPassword}:e));o(l)};return r.createElement(b,{dataSource:e,loading:t,columns:[{dataIndex:"key",title:"\u53d8\u91cf",width:"35%",cell:e=>r.createElement("span",{className:"mr-16 copy-trigger"},e," ",r.createElement(x,{content:e,size:"xs"}))},{dataIndex:"value",width:"45%",title:"\u503c",cell:(e,t,o)=>r.createElement("div",{className:"flex-r",style:{justifyContent:"flex-start"}},o.showPassword?r.createElement("span",{className:"mr-16 copy-trigger"},e," ",r.createElement(x,{content:e,size:"xs"})):r.createElement("span",{className:"mr-16"},"***************"),r.createElement(a,{className:"mr-8 cursor-pointer",size:"small",type:o.showPassword?"eye-slash":"eye",onClick:()=>l(o)}))},{title:"\u64cd\u4f5c",width:100,cell:(e,t,{key:o,value:l})=>r.createElement(r.Fragment,null,r.createElement(x,{content:JSON.stringify({[o]:l}),type:"button",text:"\u590d\u5236"}))}]})};var q=s.exports.memo(J),G="";const Y=({title:e,loading:t=!1,onSubmit:o},l)=>{const[n,a]=s.exports.useState(!1),i=O.useField(),{init:c,getValue:d,setValue:u}=i;s.exports.useImperativeHandle(l,(()=>({setValue:u,getValue:d,closeDrawer:p,setVisible:a})));const p=()=>{a(!1),u("secrets",[])};return r.createElement(U,{title:e,placement:"right",width:"60%",visible:n,onClose:p,className:"dialog-drawer"},r.createElement("div",{className:"dialog-body secrets-content"},r.createElement(w,{...c("secrets")})),r.createElement("div",{className:"dialog-footer"},r.createElement(k,{className:"mr-10",type:"primary",onClick:o,loading:t},"\u786e\u5b9a"),r.createElement(k,{type:"normal",onClick:p},"\u53d6\u6d88")))};var W=s.exports.forwardRef(Y);export{U as D,K as P,q as S,W as a};