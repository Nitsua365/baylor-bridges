(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[229],{4309:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/home",function(){return t(3326)}])},3326:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return es}});var r=t(7568),i=t(603),u=t(655),o=t(5893),a=t(9025),c=t(8163),s=t(5321),f=t(1163),l=t(7294);/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ function d(e,n,t,r){return new(t||(t=Promise))(function(i,u){function o(e){try{c(r.next(e))}catch(n){u(n)}}function a(e){try{c(r.throw(e))}catch(n){u(n)}}function c(e){var n;e.done?i(e.value):((n=e.value)instanceof t?n:new t(function(e){e(n)})).then(o,a)}c((r=r.apply(e,n||[])).next())})}function v(e,n){var t,r,i,u,o={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return u={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u;function a(u){return function(a){return function(u){if(t)throw TypeError("Generator is already executing.");for(;o;)try{if(t=1,r&&(i=2&u[0]?r.return:u[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,u[1])).done)return i;switch(r=0,i&&(u=[2&u[0],i.value]),u[0]){case 0:case 1:i=u;break;case 4:return o.label++,{value:u[1],done:!1};case 5:o.label++,r=u[1],u=[0];continue;case 7:u=o.ops.pop(),o.trys.pop();continue;default:if(!(i=(i=o.trys).length>0&&i[i.length-1])&&(6===u[0]||2===u[0])){o=0;continue}if(3===u[0]&&(!i||u[1]>i[0]&&u[1]<i[3])){o.label=u[1];break}if(6===u[0]&&o.label<i[1]){o.label=i[1],i=u;break}if(i&&o.label<i[2]){o.label=i[2],o.ops.push(u);break}i[2]&&o.ops.pop(),o.trys.pop();continue}u=n.call(e,o)}catch(a){u=[6,a],r=0}finally{t=i=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}([u,a])}}}var h,g,p,b=function(){},y=b(),w=Object,m=function(e){return e===y},E=function(e){return"function"==typeof e},R=function(e,n){return w.assign({},e,n)},O="undefined",k=function(){return typeof window!=O},T=new WeakMap,x=0,S=function(e){var n,t,r=typeof e,i=e&&e.constructor,u=i==Date;if(w(e)!==e||u||i==RegExp)n=u?e.toJSON():"symbol"==r?e.toString():"string"==r?JSON.stringify(e):""+e;else{if(n=T.get(e))return n;if(n=++x+"~",T.set(e,n),i==Array){for(t=0,n="@";t<e.length;t++)n+=S(e[t])+",";T.set(e,n)}if(i==w){n="#";for(var o=w.keys(e).sort();!m(t=o.pop());)m(e[t])||(n+=t+":"+S(e[t])+",");T.set(e,n)}}return n},_=!0,C=function(){return _},V=k(),D=typeof document!=O,I=V&&window.addEventListener?window.addEventListener.bind(window):b,L=D?document.addEventListener.bind(document):b,P=V&&window.removeEventListener?window.removeEventListener.bind(window):b,F=D?document.removeEventListener.bind(document):b,j=function(){var e=D&&document.visibilityState;return m(e)||"hidden"!==e},N={initFocus:function(e){return L("visibilitychange",e),I("focus",e),function(){F("visibilitychange",e),P("focus",e)}},initReconnect:function(e){var n=function(){_=!0,e()},t=function(){_=!1};return I("online",n),I("offline",t),function(){P("online",n),P("offline",t)}}},A=!k()||"Deno"in window,M=A?l.useEffect:l.useLayoutEffect,W="undefined"!=typeof navigator&&navigator.connection,Z=!A&&W&&(["slow-2g","2g"].includes(W.effectiveType)||W.saveData),J=function(e){if(E(e))try{e=e()}catch(n){e=""}var t=[].concat(e),r=(e="string"==typeof e?e:(Array.isArray(e)?e.length:e)?S(e):"")?"$swr$"+e:"";return[e,t,r]},q=new WeakMap,X=function(e,n,t,r,i,u,o){void 0===o&&(o=!0);var a=q.get(e),c=a[0],s=a[1],f=a[3],l=c[n],d=s[n];if(o&&d)for(var v=0;v<d.length;++v)d[v](t,r,i);return u&&(delete f[n],l&&l[0])?l[0](2).then(function(){return e.get(n)}):e.get(n)},$=0,G=function(){return++$},H=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];return d(void 0,void 0,void 0,function(){var n,t,r,i,u,o,a,c,s,f,l,d,h,g,p,b,w,O,k,T,x;return v(this,function(v){switch(v.label){case 0:if(n=e[0],t=e[1],r=e[2],o=!!m((u="boolean"==typeof(i=e[3])?{revalidate:i}:i||{}).populateCache)||u.populateCache,a=!1!==u.revalidate,c=!1!==u.rollbackOnError,s=u.optimisticData,l=(f=J(t))[0],d=f[2],!l)return[2];if(g=q.get(n)[2],e.length<3)return[2,X(n,l,n.get(l),y,y,a,!0)];if(p=r,w=G(),g[l]=[w,0],O=!m(s),k=n.get(l),O&&(T=E(s)?s(k):s,n.set(l,T),X(n,l,T)),E(p))try{p=p(n.get(l))}catch(h){b=h}if(!(p&&E(p.then)))return[3,2];return[4,p.catch(function(e){b=e})];case 1:if(p=v.sent(),w!==g[l][0]){if(b)throw b;return[2,p]}b&&O&&c&&(o=!0,p=k,n.set(l,k)),v.label=2;case 2:return o&&(b||(E(o)&&(p=o(p,k)),n.set(l,p)),n.set(d,R(n.get(d),{error:b}))),g[l][1]=G(),[4,X(n,l,p,b,y,a,!!o)];case 3:if(x=v.sent(),b)throw b;return[2,o?x:p]}})})},Q=function(e,n){for(var t in e)e[t][0]&&e[t][0](n)},U=function(e,n){if(!q.has(e)){var t=R(N,n),r={},i=H.bind(y,e),u=b;if(q.set(e,[r,{},{},{},i]),!A){var o=t.initFocus(setTimeout.bind(y,Q.bind(y,r,0))),a=t.initReconnect(setTimeout.bind(y,Q.bind(y,r,1)));u=function(){o&&o(),a&&a(),q.delete(e)}}return[e,i,u]}return[e,q.get(e)[4]]},z=function(e,n,t,r,i){var u=t.errorRetryCount,o=i.retryCount,a=~~((Math.random()+.5)*(1<<(o<8?o:8)))*t.errorRetryInterval;(m(u)||!(o>u))&&setTimeout(r,a,i)},B=U(new Map),K=B[0],Y=R({onLoadingSlow:b,onSuccess:b,onError:b,onErrorRetry:z,onDiscarded:b,revalidateOnFocus:!0,revalidateOnReconnect:!0,revalidateIfStale:!0,shouldRetryOnError:!0,errorRetryInterval:Z?1e4:5e3,focusThrottleInterval:5e3,dedupingInterval:2e3,loadingTimeout:Z?5e3:3e3,compare:function(e,n){return S(e)==S(n)},isPaused:function(){return!1},cache:K,mutate:B[1],fallback:{}},{isOnline:C,isVisible:j}),ee=function(e,n){var t=R(e,n);if(n){var r=e.use,i=e.fallback,u=n.use,o=n.fallback;r&&u&&(t.use=r.concat(u)),i&&o&&(t.fallback=R(i,o))}return t},en=(0,l.createContext)({}),et=function(e){var n=e.value,t=ee((0,l.useContext)(en),n),r=n&&n.provider,i=(0,l.useState)(function(){return r?U(r(t.cache||K),n):y})[0];return i&&(t.cache=i[0],t.mutate=i[1]),M(function(){return i?i[2]:y},[]),(0,l.createElement)(en.Provider,R(e,{value:t}))},er=function(e,n){var t=(0,l.useState)({})[1],r=(0,l.useRef)(e),i=(0,l.useRef)({data:!1,error:!1,isValidating:!1}),u=(0,l.useCallback)(function(e){var u=!1,o=r.current;for(var a in e){var c=a;o[c]!==e[c]&&(o[c]=e[c],i.current[c]&&(u=!0))}u&&!n.current&&t({})},[]);return M(function(){r.current=e}),[r,i.current,u]},ei=function(e,n,t){var r=n[e]||(n[e]=[]);return r.push(t),function(){var e=r.indexOf(t);e>=0&&(r[e]=r[r.length-1],r.pop())}},eu={dedupe:!0},eo=function(e,n,t){var r=t.cache,i=t.compare,u=t.fallbackData,o=t.suspense,a=t.revalidateOnMount,c=t.refreshInterval,s=t.refreshWhenHidden,f=t.refreshWhenOffline,h=q.get(r),g=h[0],p=h[1],b=h[2],w=h[3],T=J(e),x=T[0],S=T[1],_=T[2],C=(0,l.useRef)(!1),V=(0,l.useRef)(!1),D=(0,l.useRef)(x),I=(0,l.useRef)(n),L=(0,l.useRef)(t),P=function(){return L.current},F=function(){return P().isVisible()&&P().isOnline()},j=function(e){return r.set(_,R(r.get(_),e))},N=r.get(x),W=m(u)?t.fallback[x]:u,Z=m(N)?W:N,$=r.get(_)||{},Q=$.error,U=!C.current,z=function(){return U&&!m(a)?a:!P().isPaused()&&(o?!m(Z)&&t.revalidateIfStale:m(Z)||t.revalidateIfStale)},B=!!x&&!!n&&(!!$.isValidating||U&&z()),K=er({data:Z,error:Q,isValidating:B},V),Y=K[0],ee=K[1],en=K[2],et=(0,l.useCallback)(function(e){return d(void 0,void 0,void 0,function(){var n,u,o,a,c,s,f,l,d,h,g,p,R;return v(this,function(v){switch(v.label){case 0:if(n=I.current,!x||!n||V.current||P().isPaused())return[2,!1];a=!0,c=e||{},s=!w[x]||!c.dedupe,f=function(){return!V.current&&x===D.current&&C.current},l=function(){var e=w[x];e&&e[1]===o&&delete w[x]},d={isValidating:!1},h=function(){j({isValidating:!1}),f()&&en(d)},j({isValidating:!0}),en({isValidating:!0}),v.label=1;case 1:return v.trys.push([1,3,,4]),s&&(X(r,x,Y.current.data,Y.current.error,!0),t.loadingTimeout&&!r.get(x)&&setTimeout(function(){a&&f()&&P().onLoadingSlow(x,t)},t.loadingTimeout),w[x]=[n.apply(void 0,S),G()]),u=(R=w[x])[0],o=R[1],[4,u];case 2:if(u=v.sent(),s&&setTimeout(l,t.dedupingInterval),!w[x]||w[x][1]!==o)return s&&f()&&P().onDiscarded(x),[2,!1];if(j({error:y}),d.error=y,!m(g=b[x])&&(o<=g[0]||o<=g[1]||0===g[1]))return h(),s&&f()&&P().onDiscarded(x),[2,!1];return i(Y.current.data,u)?d.data=Y.current.data:d.data=u,i(r.get(x),u)||r.set(x,u),s&&f()&&P().onSuccess(u,x,t),[3,4];case 3:return p=v.sent(),l(),!P().isPaused()&&(j({error:p}),d.error=p,s&&f()&&(P().onError(p,x,t),("boolean"==typeof t.shouldRetryOnError&&t.shouldRetryOnError||E(t.shouldRetryOnError)&&t.shouldRetryOnError(p))&&F()&&P().onErrorRetry(p,x,t,et,{retryCount:(c.retryCount||0)+1,dedupe:!0}))),[3,4];case 4:return a=!1,h(),f()&&s&&X(r,x,d.data,d.error,!1),[2,!0]}})})},[x]),eo=(0,l.useCallback)(H.bind(y,r,function(){return D.current}),[]);if(M(function(){I.current=n,L.current=t}),M(function(){if(x){var e,n=x!==D.current,t=et.bind(y,eu),r=0,u=function(e){if(0==e){var n=Date.now();P().revalidateOnFocus&&n>r&&F()&&(r=n+P().focusThrottleInterval,t())}else if(1==e)P().revalidateOnReconnect&&F()&&t();else if(2==e)return et()},o=ei(x,p,function(e,n,t){en(R({error:n,isValidating:t},i(Y.current.data,e)?y:{data:e}))}),a=ei(x,g,u);return V.current=!1,D.current=x,C.current=!0,n&&en({data:Z,error:Q,isValidating:B}),z()&&(m(Z)||A?t():(e=t,k()&&typeof window.requestAnimationFrame!=O?window.requestAnimationFrame(e):setTimeout(e,1))),function(){V.current=!0,o(),a()}}},[x,et]),M(function(){var e;function n(){var n=E(c)?c(Z):c;n&&-1!==e&&(e=setTimeout(t,n))}function t(){!Y.current.error&&(s||P().isVisible())&&(f||P().isOnline())?et(eu).then(n):n()}return n(),function(){e&&(clearTimeout(e),e=-1)}},[c,s,f,et]),(0,l.useDebugValue)(Z),o&&m(Z)&&x)throw I.current=n,L.current=t,V.current=!1,m(Q)?et(eu):Q;return{mutate:eo,get data(){return ee.data=!0,Z},get error(){return ee.error=!0,Q},get isValidating(){return ee.isValidating=!0,B}}};w.defineProperty(et,"default",{value:Y});var ea=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var t,r=R(Y,(0,l.useContext)(en)),i=E(e[1])?[e[0],e[1],e[2]||{}]:[e[0],null,(null===e[1]?e[2]:e[1])||{}],u=i[0],o=i[1],a=ee(r,i[2]),c=eo,s=a.use;if(s)for(var f=s.length;f-- >0;)c=s[f](c);return c(u,o||a.fetcher,a)},ec=function(){var e=(0,f.useRouter)(),n=(0,c.a)().user,t=(0,l.useState)(!1),r=t[0],i=t[1];return(0,l.useEffect)(function(){n?i(!0):(e.replace("/login"),i(!1))},[n]),[r]},es=function(){var e,n=(0,c.a)(),t=n.logOut,l=n.user,d=(0,i.Z)(ec(),1)[0],v=(0,f.useRouter)(),h=ea("/users/".concat(null==l?void 0:l.uid),(0,r.Z)(function(){var e;return(0,u.__generator)(this,function(e){switch(e.label){case 0:return[4,(0,s.QT)((0,s.JU)(a.db,"users",l.uid))];case 1:return[2,e.sent().data()]}})})).data,g=(e=(0,r.Z)(function(){return(0,u.__generator)(this,function(e){switch(e.label){case 0:return[4,t()];case 1:return e.sent(),v.replace("/"),[2]}})}),function(){return e.apply(this,arguments)});return d?d&&h&&(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("div",{children:Object.entries(h).map(function(e){var n=(0,i.Z)(e,2),t=n[0],r=n[1];return(0,o.jsx)("div",{children:"".concat(t," : ").concat(r,"\n")},"".concat(t," : ").concat(r))})}),(0,o.jsx)("button",{onClick:g,children:"Logout"})]}):(0,o.jsx)(o.Fragment,{})}},1163:function(e,n,t){e.exports=t(387)}},function(e){e.O(0,[774,888,179],function(){return e(e.s=4309)}),_N_E=e.O()}]);