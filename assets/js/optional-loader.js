(()=>{'use strict';
let loaded=false;
const load=()=>{if(loaded)return;loaded=true;import('/assets/js/optional-integrations.js').catch(()=>{});};
const events=['pointerdown','keydown','touchstart','scroll'];
events.forEach(event=>window.addEventListener(event,load,{once:true,passive:true}));
if('requestIdleCallback' in window){requestIdleCallback(load,{timeout:5000});}
else{window.setTimeout(load,3500);}
})();
