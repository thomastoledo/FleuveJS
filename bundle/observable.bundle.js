var r={d:(t,e)=>{for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},o:(r,t)=>Object.prototype.hasOwnProperty.call(r,t)},t={};r.d(t,{IR:()=>l,y$:()=>p,T_:()=>b,gC:()=>_,hX:()=>v,rM:()=>P,Dp:()=>O,KJ:()=>y,UI:()=>g,Nl:()=>M,of:()=>E,Vl:()=>C,d_:()=>N,wt:()=>d,bw:()=>S,C4:()=>w});var e,n=function(){function r(r,t,e){this._value=r,this._flag=t,this._error=e}return Object.defineProperty(r.prototype,"value",{get:function(){return this._value},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"flag",{get:function(){return this._flag},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"error",{get:function(){return this._error},enumerable:!1,configurable:!0}),r.prototype.isUnwrapSwitch=function(){return this._flag===e.UnwrapSwitch},r.prototype.isMustStop=function(){return this._flag===e.MustStop},r.prototype.isFilterNotMatched=function(){return this._flag===e.FilterNotMatched},r.prototype.isOperationError=function(){return this._flag===e.OperationError},r}();function o(r){return"function"==typeof r}function i(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];return r.filter((function(r){return o(r)}))}!function(r){r.UnwrapSwitch="UnwrapSwitch",r.MustStop="MustStop",r.FilterNotMatched="FilterNotMatched",r.OperationError="OperationError"}(e||(e={}));var u=function(){function r(r){this._unsubscribeCallback=r}return r.prototype.unsubscribe=function(){this._unsubscribeCallback&&this._unsubscribeCallback()},r}();function s(r){return!o(r)&&function(r){for(var t=[],e=1;e<arguments.length;e++)t[e-1]=arguments[e];return t.some((function(t){return void 0!==r[t]&&null!==r[t]&&o(r[t])}))}(r,"next","error","complete")}function c(r,t,e){var n={next:r,error:t,complete:e};if(!s(n))throw new Error("Please provide functions for next, error and complete");return n}new u;var a,p=function(){function r(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];this._subscribers=[],this._isComplete=!0,this._innerSequence=r.map((function(r){return new n(r)}))}return r.prototype.pipe=function(){for(var t=[],o=0;o<arguments.length;o++)t[o]=arguments[o];for(var i=new r,u=[],s=this._innerSequence,c=0,a=s.length;c<a&&!s[c].isMustStop();c++)try{var p=this._executeOperations(s[c].value,t);p.isFilterNotMatched()||u.push(p)}catch(r){u.push(new n(s[c].value,e.OperationError,r)),c=a}return i._innerSequence=u,i},r.prototype.subscribe=function(r){var t=this;if(!o(r)&&!s(r))throw new Error("Please provide either a function or a Subscriber");var e=s(r)?r:c(r);return this._subscribers.push(e),this.executeSubscriber(e,this._innerSequence),new u((function(){return t._subscribers=t._subscribers.filter((function(t){return t!==r}))}))},r.prototype.executeSubscriber=function(r,t){for(var e=function(e,o){var i=t[e];return i.isOperationError()?(n._error=i.error,(r.error||function(){throw i.error})(i.error),"break"):i.isFilterNotMatched()||i.isMustStop()?{value:void 0}:void(r.next&&r.next(i.value))},n=this,o=0,i=t.length;o<i;o++){var u=e(o);if("object"==typeof u)return u.value;if("break"===u)break}this._isComplete&&r.complete&&r.complete()},r.prototype._computeValue=function(r){for(var t,o=[],i=1;i<arguments.length;i++)o[i-1]=arguments[i];for(var u=new n(r),s=0;s<o.length;s++)switch((u=o[s](u.value)).flag){case e.FilterNotMatched:case e.MustStop:s=o.length;break;case e.UnwrapSwitch:u=new n(null===(t=u.value._innerSequence.pop())||void 0===t?void 0:t.value)}return u},r.prototype._executeOperations=function(r,t){return this._computeValue.apply(this,function(r,t){for(var e=0,n=t.length,o=r.length;e<n;e++,o++)r[o]=t[e];return r}([r],i.apply(void 0,t)))},r}(),f=(a=function(r,t){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,t){r.__proto__=t}||function(r,t){for(var e in t)Object.prototype.hasOwnProperty.call(t,e)&&(r[e]=t[e])})(r,t)},function(r,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function e(){this.constructor=r}a(r,t),r.prototype=null===t?Object.create(t):(e.prototype=t.prototype,new e)}),l=function(r){function t(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=r.apply(this,t)||this;return n._preProcessOperations=[],n._isComplete=!1,n}return f(t,r),t.prototype.close=function(){this._isComplete=!0,this._subscribers.forEach((function(r){r.complete&&r.complete()}))},t.prototype.compile=function(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];if(this._isComplete)return this;var e=this._buildNewSequence(this._innerSequence.filter((function(r){return!r.isOperationError()})).map((function(r){return r.value})),r),n=e.findIndex((function(r){return r.isOperationError()}));return n>-1?(this._innerSequence=e.slice(0,n),this.next.apply(this,this._innerSequence.map((function(r){return r.value}))),this._innerSequence.push(e[n]),this._triggerExecution([e[n]],this._subscribers),this):(this.next.apply(this,(this._innerSequence=e).map((function(r){return r.value}))),this)},t.prototype.next=function(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];return this._isComplete||(this._innerSequence=this._buildNewSequence(r,this._preProcessOperations),this._triggerExecution(this._innerSequence,this._subscribers)),this},t.prototype._buildNewSequence=function(r,t){for(var o=[],i=0,u=r.length;i<u;i++)try{var s=this._executeOperations(r[i],t);if(s.isMustStop()){this.close();break}s.isFilterNotMatched()||o.push(s)}catch(t){this._error=t,o.push(new n(r[i],e.OperationError,t)),i=u}return o},t.prototype._triggerExecution=function(r,t){var e=this;t.forEach((function(t){return e.executeSubscriber(t,r)}))},t}(p),h=function(){var r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,t){r.__proto__=t}||function(r,t){for(var e in t)Object.prototype.hasOwnProperty.call(t,e)&&(r[e]=t[e])})(t,e)};return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}}(),b=function(r){function t(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];var o=r.call(this)||this;return o.sourceObs$=t,o.subscriptions=[],o.operators=[],o.operators=e,o._isComplete=t._isComplete,o.sourceObs$.subscribe({next:function(r){o._subscribers.forEach((function(t){if(t.next){var n=o._executeOperations(r,e);if(!n.isFilterNotMatched()&&!n.isMustStop())return t.next(n.value);n.isMustStop()&&o.close()}}))},error:function(r){o._error=r,o._subscribers.forEach((function(t){return t.error&&t.error(r)}))},complete:function(){o._isComplete=!0,o.unsubscribe(),o._subscribers.forEach((function(r){return r.complete&&r.complete()}))}}),o}return h(t,r),t.prototype.subscribe=function(r){var t=this;if(!o(r)&&!s(r))throw new Error("Please provide either a function or a Subscriber");var i=s(r)?r:c(r);this._subscribers.push(i);for(var a=[],p=this.sourceObs$._innerSequence,f=0,l=p.length;f<l;f++)try{a.push(this._executeOperations(p[f].value,this.operators))}catch(r){a.push(new n(p[f].value,e.OperationError,r)),f=l}return this.executeSubscriber(i,a),new u((function(){return t._subscribers=t._subscribers.filter((function(t){return t!==r}))}))},t.prototype.close=function(){this._subscribers.forEach((function(r){return r.complete&&r.complete()})),this.unsubscribe()},t.prototype.unsubscribe=function(){this.subscriptions.forEach((function(r){return r.unsubscribe()}))},t}(p),v=function(r){return function(t){return new n(t,r(t)?void 0:e.FilterNotMatched)}},_=function(r){var t=!1;return function(o){return new n(o,(t=t||v(r)(o).isFilterNotMatched())?e.MustStop:void 0)}},y=function(r,t,e){return function(n){var o=v(r)(n),i=o.isFilterNotMatched()?null!=e?e:[]:t,u=i.shift();return u?i.reduce((function(r,t){return t(r.value)}),u(n)):o}},w=function(r){var t=!1;return function(o){return new n(o,(t=t||!v(r)(o).isFilterNotMatched())?e.MustStop:void 0)}},g=function(r){return function(t){return new n(r(t))}};function d(r){return function(t){return new n(r(t),e.UnwrapSwitch)}}var S=function(r){return function(t){return r(t),new n(t)}},O=function(r){return new(p.bind.apply(p,function(r,t){for(var e=0,n=t.length,o=r.length;e<n;e++,o++)r[o]=t[e];return r}([void 0],r)))},m=function(r,t){for(var e=0,n=t.length,o=r.length;e<n;e++,o++)r[o]=t[e];return r},M=function(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];return new(l.bind.apply(l,m([void 0],r)))},x=function(r,t){for(var e=0,n=t.length,o=r.length;e<n;e++,o++)r[o]=t[e];return r},E=function(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];return new(p.bind.apply(p,x([void 0],r)))},C=function(r,t){var e=new l;return r.addEventListener(t,(function(r){return e.next(r)})),e};function N(){for(var r,t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=new l;return(r=n._preProcessOperations).push.apply(r,t),n}var q=function(r,t){for(var e=0,n=t.length,o=r.length;e<n;e++,o++)r[o]=t[e];return r},P=function(r){for(var t=[],e=1;e<arguments.length;e++)t[e-1]=arguments[e];var n=new(b.bind.apply(b,q([void 0,r],t)));return n},F=t.IR,j=t.y$,k=t.T_,U=t.gC,I=t.hX,$=t.rM,T=t.Dp,V=t.KJ,A=t.UI,D=t.Nl,J=t.of,K=t.Vl,L=t.d_,R=t.wt,X=t.bw,z=t.C4;export{F as MutableObservable,j as Observable,k as ObservableFork,U as asLongAs,I as filter,$ as fork,T as from,V as ifElse,A as map,D as mutable,J as of,K as onEvent,L as preProcess,R as switchMap,X as tap,z as until};