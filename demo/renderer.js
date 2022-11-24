(()=>{var e={102:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Client=void 0;const s=n(475);class i{constructor(e,t){this.ipcRenderer=e,this.remoteCtx={id:t}}remoteContext(){return this.remoteCtx}send(...e){this.ipcRenderer.send("rpc:message",...e)}on(e){this.ipcRenderer.on("rpc:message",((t,...n)=>{e(...n)}))}disconnect(){this.ipcRenderer.send("rpc:disconnect")}}class r extends s.RpcClient{constructor(e,t){super(new i(e,"rpc.electron.main"),t),this.ipcRenderer=e,e.send("rpc:hello"),e.on("rpc:hello",(()=>{console.log("Client get rpc:hello")}))}disconnect(){this.connection.disconnect()}}t.Client=r},473:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createProxyService=t.asProxyService=void 0;const s=n(475);t.asProxyService=s.ProxyHelper.asProxyService,t.createProxyService=s.ProxyHelper.createProxyService},475:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.RpcClient=t.RpcServer=t.ProxyHelper=t.markDynamicService=t.createRpcService=void 0;class n{constructor(e){this.service=e}call(e,t,n){const s=this.service,i=s[t];if("function"==typeof i)return i.apply(s,n);throw new Error(`method not found: ${t}`)}listen(e,t,n){this.call(e,"on",[t,n])}unlisten(e,t,n){this.call(e,"off",[t,n])}}function s(e){return new n(e)}t.createRpcService=s;class i{constructor(){this.nextId=0,this.storage={},this.ids=new WeakMap,this.connectionIds=new Map,this.services=new Map}add(e,t){const{id:n,name:s}=this.save(e);this.storage[n].connections.add(t);let i=this.connectionIds.get(t);return i||(i=new Set,this.connectionIds.set(t,i)),i.add(n),{id:n,name:s}}registerService(e,t){this.services.set(e,t)}get(e){return this.services.get(e)}deref(e,t){const n=this.storage[e];if(n&&(n.connections.delete(t),0===n.connections.size)){this.ids.delete(n.object),delete this.storage[e];const t=`__rpc_dyn__${e}`;this.services.delete(t),console.log(`DynamicServices delete ${e}`)}}removeConnection(e){const t=this.connectionIds.get(e);t&&(t.forEach((t=>{this.deref(t,e)})),this.connectionIds.delete(e))}save(e){let t=this.ids.get(e);return t||(t=++this.nextId,this.storage[t]={object:e,connections:new Set},this.ids.set(e,t)),{id:t,name:`__rpc_dyn__${t}`}}}function r(e){return e.__rpc_dyn__=!0,e}t.markDynamicService=r;class o{constructor(e){this.objectCache=new Map,this.finalizationRegistry=new FinalizationRegistry((t=>{const n=this.objectCache.get(t);void 0!==n&&void 0===n.deref()&&(this.objectCache.delete(t),console.log(`ObjectRegistry ${t}`),e(t))}))}add(e,t){const n=new WeakRef(t);this.objectCache.set(e,n),this.finalizationRegistry.register(t,e),console.log(`finalizationRegistry add ${e}`)}get(e){const t=this.objectCache.get(e);if(void 0!==t){const e=t.deref();if(void 0!==e)return e}}}var c;!function(e){e.asProxyService=function(e){return e},e.createProxyService=function(e,t,n){return new Proxy({},{get(s,i){var r;if("string"==typeof i){if(null===(r=null==n?void 0:n.properties)||void 0===r?void 0:r.has(i))return n.properties.get(i);if("then"===i)return;return"on"===i?(n,s)=>e.listen(t,n,s):"once"===i?(n,s)=>e.listen(t,n,s,!0):"off"===i?(n,s)=>e.unlisten(t,n,s):(...n)=>e.call(t,i,n)}}})}}(c=t.ProxyHelper||(t.ProxyHelper={})),t.RpcServer=class{constructor(e){this.ctx=e,this.services=new Map,this.connections=new Set,this.activeRequests=new Map,this.eventHandlers=new Map,this.eventRoutes=new Map,this.connectionEvents=new Map,this.dynamicServices=new i}addConnection(e){this.connections.add(e),e.on(((...t)=>{const[n,s,...i]=t;this.onRawMessage(e,n,s,i)})),this.activeRequests.set(e,new Set),this.connectionEvents.set(e,new Set)}onDisconnect(e){console.log("onDisconnect"),this.connections.delete(e),this.activeRequests.delete(e),this.dynamicServices.removeConnection(e);const t=this.connectionEvents.get(e);t&&t.forEach((t=>{const[n,s]=t.split(".");try{this.onEventUnlisten(e,n,s)}catch(e){}})),this.connectionEvents.delete(e)}registerService(e,t){this.services.set(e,t)}getService(e){return e.startsWith("__rpc_")?this.dynamicServices.get(e):this.services.get(e)}call(e,t,n,s){const i=this.getService(t);if(i){let t=i.call(e,n,s);return(!(r=t)||"object"!=typeof r&&"function"!=typeof r||"function"!=typeof r.then)&&(t=Promise.resolve(t)),t}throw new Error(`service not found: ${t}`);var r}listen(e,t,n,s){const i=this.getService(t);if(!i)throw new Error(`service not found: ${t}`);i.listen(e,n,s)}unlisten(e,t,n,s){const i=this.getService(t);if(!i)throw new Error(`service not found: ${t}`);i.unlisten(e,n,s)}onRawMessage(e,t,n,s){switch(t){case 100:{const[t,i,r]=s;return this.onPromise(e,n,t,i,r)}case 102:{const[t,i,r]=s;return this.onEventListen(e,n,t,i,r)}case 103:{const[t,n,i]=s;return this.onEventUnlisten(e,t,n,i)}case 110:{const[t,n,i]=s;return this.onDeref(e,i)}}}saveDynamicService(e,t){const{id:n,name:i}=this.dynamicServices.add(e,t);return this.dynamicServices.get(i)||("call"in e&&"function"==typeof e.call?this.dynamicServices.registerService(i,e):this.dynamicServices.registerService(i,r(s(e)))),{id:n,name:i}}onDeref(e,t){this.dynamicServices.deref(t,e)}onPromise(e,t,n,s,i){var r;let o;null===(r=this.activeRequests.get(e))||void 0===r||r.add(t);try{o=this.call(e.remoteContext(),n,s,i)}catch(e){o=Promise.reject(e)}o.then((n=>{var s;if(this.activeRequests.has(e)){if(n&&n.__rpc_dyn__){const s=this.saveDynamicService(n,e);this.sendResponse(e,201,t,{data:s,rpc:{dynamicId:s.id}})}else this.sendResponse(e,201,t,{data:n});null===(s=this.activeRequests.get(e))||void 0===s||s.delete(t)}}),(n=>{var s;n instanceof Error&&(this.activeRequests.has(e)?this.sendResponse(e,202,t,{message:n.message,name:n.name,stack:n.stack?n.stack.split?n.stack.split("\n"):n.stack:void 0}):this.sendResponse(e,203,t,n),null===(s=this.activeRequests.get(e))||void 0===s||s.delete(t))}))}onEventListen(e,t,n,s,i){var r;const o=`${n}.${s}`;null===(r=this.connectionEvents.get(e))||void 0===r||r.add(o);const c=this.eventRoutes.get(o)||[];if(c.includes(e)||(c.push(e),this.eventRoutes.set(o,c)),this.eventHandlers.has(o)){const t=this.eventHandlers.get(o),i=(...t)=>{this.connections.has(e)&&this.sendResponse(e,204,o,[n,s,t])};t.set(e,i),this.eventHandlers.set(o,t),this.listen(e.remoteContext(),n,s,i)}else{const t=new Map,i=(...t)=>{this.connections.has(e)&&this.sendResponse(e,204,o,[n,s,t])};t.set(e,i),this.eventHandlers.set(o,t),this.listen(e.remoteContext(),n,s,i)}}onEventUnlisten(e,t,n,s){const i=`${t}.${n}`,r=this.eventHandlers.get(i);if(r){const s=r.get(e);s&&(this.unlisten(e.remoteContext(),t,n,s),r.delete(e))}const o=this.eventRoutes.get(i);o&&(o.splice(o.indexOf(e),1),this.eventRoutes.set(i,o),o.length||(this.eventRoutes.delete(i),this.eventHandlers.delete(i)))}sendResponse(e,t,n,s){e.send(t,n,s)}},t.RpcClient=class{constructor(e,t){this.connection=e,this._events=t,this.requestId=0,this.handlers=new Map,this.connection.on(((...e)=>{const[t,n,...s]=e;this.onRawMessage(t,n,...s)})),this.objectRegistry=new o((e=>{this.connection.send(110,++this.requestId,"rpc","deref",e)}))}call(e,t,n){return this.requestPromise(e,t,n)}listen(e,t,n,s){const i=`${e}.${t}`;s?this._events.once(i,n):this._events.on(i,n),1===this._events.listenerCount(i)&&this.requestEventListen(e,t)}unlisten(e,t,n){const s=`${e}.${t}`;this._events.off(s,n),0===this._events.listenerCount(s)&&this.requestEventUnlisten(e,t)}requestPromise(e,t,n){const s=++this.requestId,i=new Promise(((i,r)=>{this.connection.send(100,s,e,t,n),this.handlers.set(s,((e,t,n)=>{switch(e){case 201:{this.handlers.delete(t);const e=n;if(e.rpc){const{name:t}=e.data,{dynamicId:n}=e.rpc,s=new Map;s.set("__rpc__",{dynamicId:n,name:t});let r=this.objectRegistry.get(n);r||(r=c.createProxyService(this,t,{properties:s}),this.objectRegistry.add(n,r)),i(r)}else i(e.data)}break;case 202:{this.handlers.delete(t);const e=n,s=new Error(e.message);s.stack=e.stack,s.name=e.name,r(e)}break;case 203:this.handlers.delete(t),r(n)}}))}));return i}requestEventListen(e,t,n){const s=this.requestId++;this.connection.send(102,s,e,t,n)}requestEventUnlisten(e,t,n){const s=this.requestId++;this.connection.send(103,s,e,t,n)}onEventFire(e,t,n){this._events.emit(`${e}.${t}`,...n)}onRawMessage(e,t,...n){const s=e;switch(s){case 201:case 202:case 203:{const[e]=n,i=this.handlers.get(t);null==i||i(s,t,e);break}case 204:{const[e,t,s]=n[0];this.onEventFire(e,t,s);break}}}}},34:e=>{"use strict";var t=Object.prototype.hasOwnProperty,n="~";function s(){}function i(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function r(e,t,s,r,o){if("function"!=typeof s)throw new TypeError("The listener must be a function");var c=new i(s,r||e,o),a=n?n+t:t;return e._events[a]?e._events[a].fn?e._events[a]=[e._events[a],c]:e._events[a].push(c):(e._events[a]=c,e._eventsCount++),e}function o(e,t){0==--e._eventsCount?e._events=new s:delete e._events[t]}function c(){this._events=new s,this._eventsCount=0}Object.create&&(s.prototype=Object.create(null),(new s).__proto__||(n=!1)),c.prototype.eventNames=function(){var e,s,i=[];if(0===this._eventsCount)return i;for(s in e=this._events)t.call(e,s)&&i.push(n?s.slice(1):s);return Object.getOwnPropertySymbols?i.concat(Object.getOwnPropertySymbols(e)):i},c.prototype.listeners=function(e){var t=n?n+e:e,s=this._events[t];if(!s)return[];if(s.fn)return[s.fn];for(var i=0,r=s.length,o=new Array(r);i<r;i++)o[i]=s[i].fn;return o},c.prototype.listenerCount=function(e){var t=n?n+e:e,s=this._events[t];return s?s.fn?1:s.length:0},c.prototype.emit=function(e,t,s,i,r,o){var c=n?n+e:e;if(!this._events[c])return!1;var a,h,l=this._events[c],v=arguments.length;if(l.fn){switch(l.once&&this.removeListener(e,l.fn,void 0,!0),v){case 1:return l.fn.call(l.context),!0;case 2:return l.fn.call(l.context,t),!0;case 3:return l.fn.call(l.context,t,s),!0;case 4:return l.fn.call(l.context,t,s,i),!0;case 5:return l.fn.call(l.context,t,s,i,r),!0;case 6:return l.fn.call(l.context,t,s,i,r,o),!0}for(h=1,a=new Array(v-1);h<v;h++)a[h-1]=arguments[h];l.fn.apply(l.context,a)}else{var d,u=l.length;for(h=0;h<u;h++)switch(l[h].once&&this.removeListener(e,l[h].fn,void 0,!0),v){case 1:l[h].fn.call(l[h].context);break;case 2:l[h].fn.call(l[h].context,t);break;case 3:l[h].fn.call(l[h].context,t,s);break;case 4:l[h].fn.call(l[h].context,t,s,i);break;default:if(!a)for(d=1,a=new Array(v-1);d<v;d++)a[d-1]=arguments[d];l[h].fn.apply(l[h].context,a)}}return!0},c.prototype.on=function(e,t,n){return r(this,e,t,n,!1)},c.prototype.once=function(e,t,n){return r(this,e,t,n,!0)},c.prototype.removeListener=function(e,t,s,i){var r=n?n+e:e;if(!this._events[r])return this;if(!t)return o(this,r),this;var c=this._events[r];if(c.fn)c.fn!==t||i&&!c.once||s&&c.context!==s||o(this,r);else{for(var a=0,h=[],l=c.length;a<l;a++)(c[a].fn!==t||i&&!c[a].once||s&&c[a].context!==s)&&h.push(c[a]);h.length?this._events[r]=1===h.length?h[0]:h:o(this,r)}return this},c.prototype.removeAllListeners=function(e){var t;return e?(t=n?n+e:e,this._events[t]&&o(this,t)):(this._events=new s,this._eventsCount=0),this},c.prototype.off=c.prototype.removeListener,c.prototype.addListener=c.prototype.on,c.prefixed=n,c.EventEmitter=c,e.exports=c},107:(e,t,n)=>{const{Client:s}=n(102),{asProxyService:i,createProxyService:r}=n(473),o={asProxyService:i,createProxyService:r},{createRpcService:c,RpcServer:a,RpcClient:h,RpcMessageType:l}=n(475);e.exports={Client:s,createRpcService:c,RpcServer:a,RpcClient:h,RpcMessageType:l,ProxyHelper:o}}},t={};function n(s){var i=t[s];if(void 0!==i)return i.exports;var r=t[s]={exports:{}};return e[s](r,r.exports,n),r.exports}(()=>{const e=n(107);console.log(e);const{Client:t,ProxyHelper:s}=n(107),i=n(34),r=new t(window.ipcRenderer,new i),o=e=>s.createProxyService(r,e),c=e=>{document.getElementById("result").innerText=JSON.stringify(e,null,2)},a={openLink:async()=>{const e=o("window"),t=await e.createMyShell();s.asProxyService(t).openExternal("https://google.com")},maximize:()=>{o("window").maximize()},restore:()=>{o("window").restore()},test:async()=>{const e=o("window");e.once("blur",(()=>{c("blur")}));let t=0;const n=()=>{t+=1,c(`focus ${t}`),t>=4&&e.off("focus",n)};e.on("focus",n),e.on("resize",(e=>{c(e)}))}};["openLink","maximize","restore","test"].forEach((e=>{document.getElementById(e).addEventListener("click",(()=>{const t=a[e];t&&t()}))}))})()})();