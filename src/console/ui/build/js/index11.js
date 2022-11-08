import{K as e,v as t,_ as o,d as n,e as i,V as r,R as a,i as l,j as s,N as c,r as u,P as p,s as d,W as f,x as g,k as m,f as h,J as v,S as y,C as b,p as C,X as x,q as k,t as N,A as w,z as P}from"./index.js";import{b as O}from"./index7.js";var E,S,j=e.makeChain,A=t.pickOthers,M=function e(){},T=(S=E=function(e){function t(){return n(this,t),i(this,e.apply(this,arguments))}return o(t,e),t.prototype.getNode=function e(t,o){this[t]=o},t.prototype.renderHeader=function e(){var t=this.props,o=t.prefix,n=t.title;return n?(this.titleId=r("dialog-title-"),a.createElement("div",{className:o+"dialog-header",id:this.titleId,ref:this.getNode.bind(this,"headerNode"),role:"heading","aria-level":"1"},n)):null},t.prototype.renderBody=function e(){var t=this.props,o=t.prefix,n=t.children;return n?a.createElement("div",{className:o+"dialog-body",ref:this.getNode.bind(this,"bodyNode")},n):null},t.prototype.renderFooter=function e(){var t,o=this,n=this.props,i=n.prefix,r=n.footer,c=n.footerAlign,u=n.footerActions,p=n.locale,d=n.height;if(!1===r)return null;var f=l(((t={})[i+"dialog-footer"]=!0,t[i+"align-"+c]=!0,t[i+"dialog-footer-fixed-height"]=!!d,t)),g=!0!==r&&r?r:u.map((function(e){var t=o.props[e+"Props"],n=s({},t,{prefix:i,className:l(i+"dialog-btn",t.className),onClick:j(o.props["on"+(e[0].toUpperCase()+e.slice(1))],t.onClick),children:t.children||p[e]});return"ok"===e&&(n.type="primary"),a.createElement(O,s({key:e},n))}));return a.createElement("div",{className:f,ref:this.getNode.bind(this,"footerNode")},g)},t.prototype.renderCloseLink=function e(){var t=this.props,o=t.prefix,n=t.closeable,i=t.onClose,r=t.locale;return n?a.createElement("a",{role:"button","aria-label":r.close,className:o+"dialog-close",onClick:i},a.createElement(c,{className:o+"dialog-close-icon",type:"close"})):null},t.prototype.render=function e(){var o,n=this.props,i=n.prefix,r=n.className,c=n.closeable,u=n.title,p=n.role,d=n.rtl,f=n.height,g=A(Object.keys(t.propTypes),this.props),m=l(((o={})[i+"dialog"]=!0,o[i+"closeable"]=c,o[r]=!!r,o)),h=this.renderHeader(),v=this.renderBody(),y=this.renderFooter(),b=this.renderCloseLink(),C={role:p,"aria-modal":"true"};return u&&(C["aria-labelledby"]=this.titleId),g.style=s({},g.style,{height:f}),a.createElement("div",s({},C,{className:m},g,{dir:d?"rtl":void 0}),h,v,y,b)},t}(u.exports.Component),E.propTypes={prefix:p.string,className:p.string,title:p.node,children:p.node,footer:p.oneOfType([p.bool,p.node]),footerAlign:p.oneOf(["left","center","right"]),footerActions:p.array,onOk:p.func,onCancel:p.func,okProps:p.object,cancelProps:p.object,closeable:p.bool,onClose:p.func,locale:p.object,role:p.string,rtl:p.bool,height:p.string},E.defaultProps={prefix:"next-",footerAlign:"right",footerActions:["ok","cancel"],onOk:M,onCancel:M,okProps:{},cancelProps:{},closeable:!0,onClose:M,locale:d.Dialog,role:"dialog"},S),I,D;T.displayName="Inner";var z=function e(){},B=f.limitTabRange,F=e.bindCtx,U=t.pickOthers,V=g.getStyle,H=g.setStyle;function R(e,t){var o=V(e,"boxSizing");return y.ieVersion&&-1!==["width","height"].indexOf(t)&&"border-box"===o?parseFloat(e.getBoundingClientRect()[t].toFixed(1)):V(e,t)}var L=(D=I=function(e){function t(o,r){n(this,t);var a=i(this,e.call(this,o,r));return F(a,["onKeyDown","beforePosition","adjustPosition","getOverlayRef"]),a}return o(t,e),t.prototype.componentDidMount=function e(){m.on(document,"keydown",this.onKeyDown),this.useCSSToPosition()||this.adjustPosition()},t.prototype.componentWillUnmount=function e(){m.off(document,"keydown",this.onKeyDown)},t.prototype.useCSSToPosition=function e(){var t=this.props,o=t.align,n=t.isFullScreen;return"cc cc"===o&&n},t.prototype.onKeyDown=function e(t){var o=this.getInnerNode();o&&B(o,t)},t.prototype.beforePosition=function e(){if(this.props.visible&&this.overlay){var t=this.getInner();if(t){var o=this.getInnerNode();this._lastDialogHeight!==R(o,"height")&&this.revertSize(t.bodyNode)}}},t.prototype.adjustPosition=function e(){if(this.props.visible&&this.overlay){var t=this.getInner();if(t){var o=this.getInnerNode(),n=V(o,"top"),i=this.props.minMargin;n<i&&(n=i,H(o,"top",i+"px"));var r=R(o,"height"),a=window.innerHeight||document.documentElement.clientHeight;a<r+2*n-1||this.props.height?this.adjustSize(t,o,Math.min(r,a-2*n)):this.revertSize(t.bodyNode),this._lastDialogHeight=r}}},t.prototype.adjustSize=function e(t,o,n){var i=t.headerNode,r=t.bodyNode,a,l=[i,t.footerNode].map((function(e){return e?R(e,"height"):0})),s,c,u,p=n-l[0]-l[1]-["padding-top","padding-bottom"].reduce((function(e,t){return e+V(o,t)}),0);p<0&&(p=1),r&&(this.dialogBodyStyleMaxHeight=r.style.maxHeight,this.dialogBodyStyleOverflowY=r.style.overflowY,H(r,{"max-height":p+"px","overflow-y":"auto"}))},t.prototype.revertSize=function e(t){H(t,{"max-height":this.dialogBodyStyleMaxHeight,"overflow-y":this.dialogBodyStyleOverflowY})},t.prototype.mapcloseableToConfig=function e(t){return["esc","close","mask"].reduce((function(e,o){var n=o.charAt(0).toUpperCase()+o.substr(1),i="boolean"==typeof t?t:t.split(",").indexOf(o)>-1;return"esc"===o||"mask"===o?e["canCloseBy"+n]=i:e["canCloseBy"+n+"Click"]=i,e}),{})},t.prototype.getOverlayRef=function e(t){this.overlay=t},t.prototype.getInner=function e(){return this.overlay.getInstance().getContent()},t.prototype.getInnerNode=function e(){return this.overlay.getInstance().getContentNode()},t.prototype.renderInner=function e(o){var n=this.props,i=n.prefix,r=n.className,l=n.title,c=n.children,u=n.footer,p=n.footerAlign,d=n.footerActions,f=n.onOk,g=n.onCancel,m=n.okProps,h=n.cancelProps,v=n.onClose,y=n.locale,b=n.visible,C=n.rtl,x=n.height,k=U(Object.keys(t.propTypes),this.props);return a.createElement(T,s({prefix:i,className:r,title:l,footer:u,footerAlign:p,footerActions:d,onOk:b?f:z,onCancel:b?g:z,okProps:m,cancelProps:h,locale:y,closeable:o,rtl:C,onClose:v.bind(this,"closeClick"),height:x},k),c)},t.prototype.render=function e(){var t=this.props,o=t.prefix,n=t.visible,i=t.hasMask,r=t.animation,l=t.autoFocus,c=t.closeable,u=t.closeMode,p=t.onClose,d=t.afterClose,f=t.shouldUpdatePosition,g=t.align,m=t.popupContainer,y=t.cache,b=t.overlayProps,C=t.rtl,x=this.useCSSToPosition(),k="closeMode"in this.props?Array.isArray(u)?u.join(","):u:c,N=this.mapcloseableToConfig(k),w=N.canCloseByCloseClick,P=h(N,["canCloseByCloseClick"]),O=s({disableScroll:!0,container:m,cache:y},b,{prefix:o,visible:n,animation:r,hasMask:i,autoFocus:l,afterClose:d},P,{canCloseByOutSideClick:!1,align:!x&&g,onRequestClose:p,needAdjust:!1,ref:this.getOverlayRef,rtl:C,maskClass:x?o+"dialog-container":"",isChildrenInMask:x&&i});x||(O.beforePosition=this.beforePosition,O.onPosition=this.adjustPosition,O.shouldUpdatePosition=f);var E=this.renderInner(w);return a.createElement(v,O,x&&!i?a.createElement("div",{className:o+"dialog-container",dir:C?"rtl":void 0},E):E)},t}(u.exports.Component),I.propTypes={prefix:p.string,pure:p.bool,rtl:p.bool,className:p.string,visible:p.bool,title:p.node,children:p.node,footer:p.oneOfType([p.bool,p.node]),footerAlign:p.oneOf(["left","center","right"]),footerActions:p.array,onOk:p.func,onCancel:p.func,okProps:p.object,cancelProps:p.object,closeable:p.oneOfType([p.string,p.bool]),closeMode:p.oneOfType([p.arrayOf(p.oneOf(["close","mask","esc"])),p.oneOf(["close","mask","esc"])]),cache:p.bool,onClose:p.func,afterClose:p.func,hasMask:p.bool,animation:p.oneOfType([p.object,p.bool]),autoFocus:p.bool,align:p.oneOfType([p.string,p.bool]),isFullScreen:p.bool,shouldUpdatePosition:p.bool,minMargin:p.number,overlayProps:p.object,locale:p.object,height:p.string,popupContainer:p.any},I.defaultProps={prefix:"next-",pure:!1,visible:!1,footerAlign:"right",footerActions:["ok","cancel"],onOk:z,onCancel:z,cache:!1,okProps:{},cancelProps:{},closeable:"esc,close",onClose:z,afterClose:z,hasMask:!0,animation:{in:"fadeInUp",out:"fadeOutUp"},autoFocus:!1,align:"cc cc",isFullScreen:!1,shouldUpdatePosition:!1,minMargin:40,overlayProps:{},locale:d.Dialog},D),W,q;L.displayName="Dialog";var K=function e(){},Y=(q=W=function(e){function r(){var t,o,a;n(this,r);for(var l=arguments.length,s=Array(l),c=0;c<l;c++)s[c]=arguments[c];return t=o=i(this,e.call.apply(e,[this].concat(s))),o.state={visible:void 0===o.props.visible?o.props.defaultVisible:o.props.visible},o.onClose=function(){"visible"in o.props||o.setState({visible:!1}),o.props.onClose(!1)},i(o,a=t)}return o(r,e),r.getDerivedStateFromProps=function e(t){return"visible"in t?{visible:t.visible}:{}},r.prototype.render=function e(){var o,n=this.props,i=n.prefix;n.pure;var u=n.className,p=n.style,d=n.type,f=n.shape,g=n.size,m=n.title,h=n.children;n.defaultVisible,n.visible;var v=n.iconType,y=n.closeable;n.onClose;var b=n.afterClose,C=n.animation,k=n.rtl,N=n.locale,w=s({},t.pickOthers(Object.keys(r.propTypes),this.props)),P=this.state.visible,O=i+"message",E=l(((o={})[O]=!0,o[i+"message-"+d]=d,o[""+i+f]=f,o[""+i+g]=g,o[i+"title-content"]=!!m,o[i+"only-content"]=!m&&!!h,o[u]=u,o)),S=P?a.createElement("div",s({role:"alert",style:p},w,{className:E,dir:k?"rtl":void 0}),y?a.createElement("a",{role:"button","aria-label":N.closeAriaLabel,className:O+"-close",onClick:this.onClose},a.createElement(c,{type:"close"})):null,a.createElement(c,{className:O+"-symbol "+(!v&&O+"-symbol-icon"),type:v}),m?a.createElement("div",{className:O+"-title"},m):null,h?a.createElement("div",{className:O+"-content"},h):null):null;return C?a.createElement(x.Expand,{animationAppear:!1,afterLeave:b},S):S},r}(u.exports.Component),W.propTypes={prefix:p.string,pure:p.bool,className:p.string,style:p.object,type:p.oneOf(["success","warning","error","notice","help","loading"]),shape:p.oneOf(["inline","addon","toast"]),size:p.oneOf(["medium","large"]),title:p.node,children:p.node,defaultVisible:p.bool,visible:p.bool,iconType:p.string,closeable:p.bool,onClose:p.func,afterClose:p.func,animation:p.bool,locale:p.object,rtl:p.bool},W.defaultProps={prefix:"next-",pure:!1,type:"success",shape:"inline",size:"medium",defaultVisible:!0,closeable:!1,onClose:K,afterClose:K,animation:!0,locale:d.Message},q);Y.displayName="Message";var _=b.config(C(Y)),J,X,G=b.config,Q=void 0,Z={},$=(X=J=function(e){function t(){var o,r,a;n(this,t);for(var l=arguments.length,s=Array(l),c=0;c<l;c++)s[c]=arguments[c];return o=r=i(this,e.call.apply(e,[this].concat(s))),r.state={visible:!0},r.handleClose=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];r.setState({visible:!1}),e||r.props.onClose&&r.props.onClose()},i(r,a=o)}return o(t,e),t.prototype.componentWillUnmount=function e(){var t=this.props.timeoutId;if(t in Z){var o=Z[t];clearTimeout(o),delete Z[t]}},t.prototype.render=function e(){var t=this.props,o=t.prefix,n=t.type,i=t.title,r=t.content,l=t.align,c=t.offset,u=t.hasMask,p=t.afterClose,d=t.animation,f=t.overlayProps;t.timeoutId;var g=t.className,m=t.style,y=h(t,["prefix","type","title","content","align","offset","hasMask","afterClose","animation","overlayProps","timeoutId","className","style"]),b=this.state.visible;return a.createElement(v,s({},f,{prefix:o,animation:d,visible:b,align:l,offset:c,hasMask:u,afterClose:p}),a.createElement(_,s({},y,{prefix:o,visible:!0,type:n,shape:"toast",title:i,style:m,className:o+"message-wrapper "+g,onClose:this.handleClose}),r))},t}(a.Component),J.contextTypes={prefix:p.string},J.propTypes={prefix:p.string,type:p.string,title:p.node,content:p.node,align:p.string,offset:p.array,hasMask:p.bool,afterClose:p.func,animation:p.oneOfType([p.object,p.bool]),overlayProps:p.object,onClose:p.func,timeoutId:p.string,style:p.object,className:p.string},J.defaultProps={prefix:"next-",align:"tc tc",offset:[0,30],hasMask:!1,animation:{in:"pulse",out:"zoomOut"},style:{},className:""},X);$.displayName="Mask";var ee=G($),te=function e(t){t.duration;var o=t.afterClose,n=t.contextConfig,i=h(t,["duration","afterClose","contextConfig"]),r=document.createElement("div");document.body.appendChild(r);var l=function e(){k.unmountComponentAtNode(r),document.body.removeChild(r),o&&o()},c=n;c||(c=b.getContext());var u=void 0,p=void 0,d=!1,f=function e(){var t=u&&u.getInstance();t&&t.handleClose(!0),d=!0};return k.render(a.createElement(b,c,a.createElement(ee,s({afterClose:l},i,{ref:function e(t){p=t}}))),r,(function(){(u=p)&&d&&f()})),{component:u,destroy:f}};function oe(e,t){var o={};return"string"==typeof e||a.isValidElement(e)?o.title=e:ne(e)&&(o=s({},e)),"number"!=typeof o.duration&&(o.duration=3e3),t&&(o.type=t),o}function ne(e){return"[object Object]"==={}.toString.call(e)}function ie(e,t){re(),e=oe(e,t);var o=r();if(Q=te(s({},e,{timeoutId:o})),e.duration>0){var n=setTimeout(re,e.duration);Z[o]=n}}function re(){Q&&(Q.destroy(),Q=null)}function ae(e){ie(e)}function le(){re()}function se(e){ie(e,"success")}function ce(e){ie(e,"warning")}function ue(e){ie(e,"error")}function pe(e){ie(e,"help")}function de(e){ie(e,"loading")}function fe(e){ie(e,"notice")}var ge=ae,me=le,he=se,ve=ce,ye=ue,be=pe,Ce=de,xe=fe,ke=function e(t){var o=function e(o){return a.createElement(b.Consumer,null,(function(e){return a.createElement(t,s({},o,{contextMessage:{show:function t(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return ae(s({},o,{contextConfig:e}))},hide:le,success:function t(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return se(s({},o,{contextConfig:e}))},warning:function t(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return ce(s({},o,{contextConfig:e}))},error:function t(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return ue(s({},o,{contextConfig:e}))},help:function t(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return pe(s({},o,{contextConfig:e}))},loading:function t(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return de(s({},o,{contextConfig:e}))},notice:function t(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return fe(s({},o,{contextConfig:e}))}}}))}))};return o},Ne={top:8,maxCount:0,duration:3e3},we=function e(t){var o=t.prefix,n=void 0===o?"next-":o,i=t.dataSource,r=void 0===i?[]:i,l,c=u.exports.useState()[1];return r.forEach((function(e){e.timer||(e.timer=setTimeout((function(){var t=r.indexOf(e);if(t>-1){var o=r[t];"function"==typeof o.onClose&&o.onClose(),r.splice(t,1),c({})}}),e.duration))})),a.createElement("div",{className:n+"message-wrapper-v2",style:{top:Ne.top}},a.createElement(x,{animationAppear:!0,animation:{appear:"pulse",enter:"pulse",leave:n+"message-fade-leave"},singleMode:!1},r.map((function(e){var t=e.key,o=e.className,i=e.type,r=e.title,l=e.content,c=e.style,u=h(e,["key","className","type","title","content","style"]);return a.createElement("div",{className:n+"message-list",key:t},a.createElement(_,s({},u,{className:o,prefix:n,visible:!0,type:i,shape:"toast",title:r,style:c}),l))}))))},Pe=b.config(we),Oe=void 0,Ee=[],Se=function e(t){var o=t.key,n=void 0===o?r("message-"):o,i=h(t,["key"]);Oe||(Oe=document.createElement("div"),document.body.appendChild(Oe));var l=Ne.maxCount,c=Ne.duration,u=s({key:n,duration:c},i);return Ee.push(u),l&&Ee.length>l&&Ee.shift(),k.render(a.createElement(b,b.getContext(),a.createElement(Pe,{dataSource:Ee})),Oe),{key:n,close:function e(){u.timer&&clearTimeout(u.timer);var t=Ee.indexOf(u);t>-1&&("function"==typeof u.onClose&&u.onClose(),Ee.splice(t,1),k.render(a.createElement(b,b.getContext(),a.createElement(Pe,{dataSource:Ee})),Oe))}}};function je(e){if(e){var t=Ee.findIndex((function(t){return t.key===e}));Ee.splice(t,1)}else Ee=[];Oe&&k.render(a.createElement(b,b.getContext(),a.createElement(Pe,{dataSource:Ee})),Oe)}function Ae(e,o){var n={};return"string"==typeof e||a.isValidElement(e)?n.title=e:"Object"===t.typeOf(e)&&(n=s({},e)),o&&(n.type=o),n}function Me(e){return function(t){return t=Ae(t,e),Se(t)}}function Te(){Oe&&Oe&&(k.unmountComponentAtNode(Oe),Oe.parentNode.removeChild(Oe),Oe=null)}var Ie={open:Me(),success:Me("success"),warning:Me("warning"),error:Me("error"),help:Me("help"),loading:Me("loading"),notice:Me("notice"),close:je,destory:Te,config:function e(){if(u.exports.useState){for(var t=arguments.length,o=Array(t),n=0;n<t;n++)o[n]=arguments[n];return s.apply(void 0,[Ne].concat(o))}N.warning("need react version > 16.8.0")}};_.show=ge,_.success=he,_.warning=ve,_.error=ye,_.notice=xe,_.help=be,_.loading=Ce,_.hide=me,_.withContext=ke;var De=b.config(_,{componentName:"Message"}),ze=De,Be=!1,Fe,Ue;De.config=function(e){Ie.config(e),Be||(De.show=Ie.open,De.open=Ie.open,De.hide=Ie.close,De.close=Ie.close,De.destory=Ie.destory,De.success=Ie.success,De.warning=Ie.warning,De.error=Ie.error,De.notice=Ie.notice,De.help=Ie.help,De.loading=Ie.loading,Be=!0)};var Ve=b.config(L),He=function e(){},Re={alert:"warning",confirm:"help"},Le=function e(t){var o=t.type,n=t.messageProps,i=void 0===n?{}:n,r=t.title,c=t.rtl,u=t.prefix,p=void 0===u?"next-":u,d=t.content;return a.createElement(ze,s({size:"large",shape:"addon",type:Re[o]},i,{title:r,rtl:c,className:l(p+"dialog-message",i.className)}),d)},We=(Ue=Fe=function(e){function t(){var o,r,a;n(this,t);for(var l=arguments.length,s=Array(l),c=0;c<l;c++)s[c]=arguments[c];return o=r=i(this,e.call.apply(e,[this].concat(s))),r.state={visible:!0,loading:!1},r.close=function(){r.setState({visible:!1})},r.loading=function(e){r.setState({loading:e})},i(r,a=o)}return o(t,e),t.prototype.wrapper=function e(t,o){var n=this;return function(){var e=t.apply(void 0,arguments);if(e&&e.then)n.loading(!0),e.then((function(e){if(n.loading(!1),!1!==e)return o()})).catch((function(e){throw n.loading(!1),e}));else if(!1!==e)return o()}},t.prototype.render=function e(){var t=this.props,o=t.prefix,n=t.type,i=t.title,r=t.content,c=t.messageProps,u=t.footerActions,p=t.onOk,d=t.onCancel,f=t.onClose,g=t.okProps,m=t.needWrapper,v=t.rtl,y=t.className,b=h(t,["prefix","type","title","content","messageProps","footerActions","onOk","onCancel","onClose","okProps","needWrapper","rtl","className"]),C=m&&n?null:i,x=m&&n?a.createElement(Le,{type:n,messageProps:c,title:i,rtl:v,prefix:o,content:r}):r,k=u||("alert"===n?["ok"]:"confirm"===n?["ok","cancel"]:void 0),N=this.wrapper(p,this.close),w=this.wrapper(d,this.close),P=this.wrapper(f,this.close),O=this.state,E=O.visible,S=O.loading;g.loading=S;var j=l(o+"dialog-quick",y);return a.createElement(Ve,s({prefix:o,role:"alertdialog"},b,{visible:E,title:C,rtl:v,footerActions:k,onOk:this.state.loading?He:N,onCancel:w,onClose:P,okProps:g,className:j}),x)},t}(u.exports.Component),Fe.propTypes={prefix:p.string,pure:p.bool,rtl:p.bool,type:p.oneOf(["alert","confirm"]),title:p.node,content:p.node,messageProps:p.object,footerActions:p.array,onOk:p.func,onCancel:p.func,onClose:p.func,okProps:p.object,locale:p.object,needWrapper:p.bool,className:p.string},Fe.defaultProps={prefix:"next-",pure:!1,messageProps:{},onOk:He,onCancel:He,onClose:He,okProps:{},locale:d.Dialog,needWrapper:!0},Ue);We.displayName="Modal";var qe=b.config(We,{componentName:"Dialog"}),Ke=function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o=document.createElement("div"),n=function e(){t.afterClose&&t.afterClose(),k.unmountComponentAtNode(o),o.parentNode.removeChild(o)};document.body.appendChild(o);var i=t.contextConfig;i||(i=b.getContext());var r=void 0,l=void 0;return k.render(a.createElement(b,i,a.createElement(qe,s({},t,{afterClose:n,ref:function e(t){l=t}}))),o,(function(){r=l})),{hide:function e(){var t=r&&r.getInstance();t&&t.close()}}},Ye=function e(t){return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return e.type=t,Ke(e)}},_e=Ye("alert"),Je=Ye("confirm"),Xe=function e(t){var o=function e(o){return a.createElement(b.Consumer,null,(function(e){return a.createElement(t,s({},o,{contextDialog:{show:function t(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return Ke(s({},o,{contextConfig:e}))},alert:function t(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return _e(s({},o,{contextConfig:e}))},confirm:function t(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return Je(s({},o,{contextConfig:e}))}}}))}))};return o};function Ge(e,t){if("closable"in e){t("closable","closeable","Dialog");var o=e,n=o.closable,i=h(o,["closable"]);e=s({closeable:n},i)}var r;return["target","offset","beforeOpen","onOpen","afterOpen","beforePosition","onPosition","cache","safeNode","wrapperClassName","container"].forEach((function(o){if(o in e){var n;t(o,"overlayProps."+o,"Dialog");var i=e,r=i.overlayProps,a=h(i,["overlayProps"]),l=s(((n={})[o]=e[o],n),r||{});delete a[o],e=s({overlayProps:l},a)}})),e}L.Inner=T,L.show=function(e){var t,o;return!1!==b.getContextProps(e,"Dialog").warning&&(e=Ge(e,N.deprecated)),Ke(e)},L.alert=function(e){var t,o;return!1!==b.getContextProps(e,"Dialog").warning&&(e=Ge(e,N.deprecated)),_e(e)},L.confirm=function(e){var t,o;return!1!==b.getContextProps(e,"Dialog").warning&&(e=Ge(e,N.deprecated)),Je(e)},L.withContext=Xe;var Qe=b.config(L,{transform:function e(t,o){return Ge(t,o)}}),Ze=function(){return Ze=Object.assign||function(e){for(var t,o=1,n=arguments.length;o<n;o++)for(var i in t=arguments[o])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},Ze.apply(this,arguments)},$e=function(e,t){var o={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(o[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var i=0,n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(o[n[i]]=e[n[i]]);return o},et={mini:400,small:600,medium:800,large:1200},tt={mini:440,small:600,medium:800,large:1200},ot=function(e,t){var o=t.startsWith("yunxiao")?tt[e]:et[e];return o?{style:{width:o+"px"}}:{}},nt=function(e,t){var o,n;if(e){var i=null===(o=null==e?void 0:e.getElementsByClassName(t+"dialog-body"))||void 0===o?void 0:o[0],r=null===(n=null==e?void 0:e.getElementsByClassName(t+"dialog-footer"))||void 0===n?void 0:n[0];r&&((null==i?void 0:i.clientHeight)<(null==i?void 0:i.scrollHeight)?r.classList.add(t+"dialog-footer-has-shadow"):r.classList.remove(t+"dialog-footer-has-shadow"))}},it=function(e){var t=e.size,o=$e(e,["size"]),n=e.prefix,i=void 0===n?"next-":n,r=w("--alicloudfe-components-theme").trim(),l=u.exports.useRef(null),s=function(){if("wind"!==r&&!r.startsWith("xconsole")){var e=k.findDOMNode(l.current);nt(e,i)}},c=null;u.exports.useEffect((function(){var e;s();var t=k.findDOMNode(l.current),o=null===(e=null==t?void 0:t.getElementsByClassName(i+"dialog-body"))||void 0===e?void 0:e[0];return o&&!c&&(c=new MutationObserver((function(){s()}))).observe(o,{attributes:!0,attributeFilter:["style"],attributeOldValue:!0,childList:!0,subtree:!0}),function(){c&&(c.disconnect(),c.takeRecords(),c=null)}}));var p="yunxiao"===r||"yunxiao-dark"===r||"hybridcloud"===r||"hybridcloud-dark"===r?["cancel","ok"]:["ok","cancel"],d="yunxiao"===r||"yunxiao-dark"===r?"tc tc":"cc cc",f="yunxiao"===r||"yunxiao-dark"===r?100:40;return a.createElement(Qe,Ze({},ot(t,r),{footerActions:p,align:d,minMargin:f,shouldUpdatePosition:!0},o,{ref:l}))},rt=function(e){return"yunxiao"===e||"yunxiao-dark"===e||"hybridcloud"===e||"hybridcloud-dark"===e?["cancel","ok"]:["ok","cancel"]},at=function(e){return"yunxiao"===e||"yunxiao-dark"===e?"tc tc":"cc cc"},lt=function(e){return"yunxiao"===e||"yunxiao-dark"===e?100:40},st=function(e){var t,o=e.size,n=$e(e,["size"]),i=e.prefix,r=void 0===i?"next-":i,a=null===(t=window.getComputedStyle)||void 0===t?void 0:t.call(window,window.document.body).getPropertyValue("--alicloudfe-components-theme").trim();return setTimeout((function(){for(var e,t,o,n=function(e){nt(e,r);var o=null===(t=null==e?void 0:e.getElementsByClassName(r+"dialog-body"))||void 0===t?void 0:t[0],n=new MutationObserver((function(){nt(e,r)}));n.observe(o,{attributes:!0,attributeFilter:["style"],attributeOldValue:!0,childList:!0,subtree:!0});var i=new MutationObserver((function(){var t,o;"BODY"!==(null===(o=null===(t=null==e?void 0:e.parentNode)||void 0===t?void 0:t.parentNode)||void 0===o?void 0:o.tagName)&&(n.disconnect(),n.takeRecords(),n=null,i.disconnect(),i.takeRecords(),i=null)}));i.observe(document.body,{attributes:!0,attributeFilter:["style"],attributeOldValue:!0,childList:!0,subtree:!0})},i=0,a=null!==(e=document.getElementsByClassName("quick-show"))&&void 0!==e?e:[];i<a.length;i++){var l;n(a[i])}})),Qe.show(Ze(Ze(Ze(Ze({},ot(o,a)),{footerActions:rt(a),align:at(a),minMargin:lt(a),shouldUpdatePosition:!0}),n),{className:["quick-show",e.className].filter(Boolean).join(" ")}))},ct=function(e){var t,o=null===(t=window.getComputedStyle)||void 0===t?void 0:t.call(window,window.document.body).getPropertyValue("--alicloudfe-components-theme").trim(),n=e.size,i=$e(e,["size"]);return Qe.confirm(Ze(Ze(Ze({},ot(n,o)),{footerActions:rt(o),align:at(o),minMargin:lt(o),messageProps:{type:"notice"},shouldUpdatePosition:!0}),i))},ut=function(e){var t,o=null===(t=window.getComputedStyle)||void 0===t?void 0:t.call(window,window.document.body).getPropertyValue("--alicloudfe-components-theme").trim(),n=e.size,i=$e(e,["size"]);return Qe.alert(Ze(Ze(Ze({},ot(n,o)),{footerActions:rt(o),align:at(o),minMargin:lt(o),messageProps:{type:"warning"},shouldUpdatePosition:!0}),i))};P(it,Qe,{show:!0,confirm:!0}),it.show=st,it.confirm=ct,it.alert=ut;var pt=it;export{pt as D,ze as N};
