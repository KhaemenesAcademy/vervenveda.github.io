/* Verve N Veda gateway forensic chrome probe v1.3.0
 * Opt-in only: ?chrome_audit=1. Read-only observation, no cookies, storage,
 * learner records, registry, outbound requests, or reporting.
 * Gateway uses native #networkTicker / .site-header / #menuOverlay,
 * not the Grade 09 injected header/ticker IDs.
 */
(()=>{"use strict";
const params=new URLSearchParams(location.search);
if(params.get("chrome_audit")!=="1"||window.VNVGatewayChromeAudit)return;
const TARGETS=[
 ["333 ticker",()=>document.getElementById("networkTicker")||document.getElementById("vnv333NetworkTicker")],
 ["Auto ticker",()=>document.getElementById("vnvTickerAutoPopulate")],
 ["VNV header",()=>document.querySelector("header.site-header")||document.getElementById("vnvHeaderAutoPopulate")],
 ["Branched menu",()=>document.getElementById("menuOverlay")||document.getElementById("vnvEnrichedMenuOverlay")],
 ["Universal toolbar",()=>document.getElementById("vnvEcosystemUtilityDock")],
 ["Translator rail",()=>document.getElementById("vnv-language-rail")]
];
const tracked=new Set(["networkTicker","vnv333NetworkTicker","vnvTickerAutoPopulate","vnvHeaderAutoPopulate","menuOverlay","vnvEnrichedMenuOverlay","vnvEcosystemUtilityDock","vnv-language-rail"]);
const traces=[];let queued=false,closed=false,panel=null,output=null;
const when=()=>Math.round(performance.now())+"ms";
function summary(name,find){
 const el=find();if(!el)return name+": MISSING";
 let css,rect;
 try{css=getComputedStyle(el);rect=el.getBoundingClientRect()}catch{return name+": CSS read failed"}
 const mounted=el.isConnected;
 const visible=mounted&&css.display!=="none"&&css.visibility!=="hidden"&&Number(css.opacity)>0&&rect.height>0&&rect.width>0;
 const x=Math.round(rect.x),y=Math.round(rect.y),w=Math.round(rect.width),h=Math.round(rect.height);
 const parent=el.parentElement?.tagName?.toLowerCase()||"?";
 const closedMenu=name==="Branched menu"&&mounted&&document.getElementById("menuButton")?.getAttribute("aria-expanded")==="false";
 const state=closedMenu?"CLOSED (expected)":visible?"PRESENT":"HIDDEN";
 return name+": "+state+" · "+w+"×"+h+" at ("+x+","+y+")"+
  " · display "+css.display+" · visibility "+css.visibility+" · opacity "+css.opacity+" · parent "+parent;
}
function display(){
 if(closed||!document.body)return;
 if(!panel){
  panel=document.createElement("aside");panel.id="vnvGatewayChromeAuditPanel";
  panel.setAttribute("aria-label","VNV gateway chrome forensic probe");
  panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:8px;bottom:8px;width:min(680px,calc(100vw - 16px));max-height:48vh;overflow:auto;padding:13px 15px;border:2px solid #b48b45;border-radius:7px;background:#243038!important;color:#fff8e9!important;font:400 14px/1.45 ui-monospace,monospace!important;box-shadow:0 12px 40px #0009";
  const title=document.createElement("strong");title.textContent="VNV Gateway · Header/Ticker Forensic Audit";
  title.style.cssText="display:block;color:#fff8e9!important;font-size:16px!important;margin-bottom:8px";
  const close=document.createElement("button");close.type="button";close.textContent="Close diagnostics";
  close.style.cssText="background:#fff8e9!important;color:#243038!important;border:0;border-radius:7px;padding:8px 12px;margin-bottom:8px;font-size:16px!important";
  close.addEventListener("click",()=>{closed=true;observer.disconnect();panel?.remove();panel=null;output=null});
  output=document.createElement("pre");
  output.style.cssText="font:inherit!important;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;color:#fff8e9!important;background:transparent!important";
  panel.append(title,close,output);document.body.append(panel);
 }
 output.textContent="Current (no student data):\n"+
 TARGETS.map(([name,find])=>summary(name,find)).join("\n")+
 "\n\nBootstrap status (presentation only):\n"+JSON.stringify(window.VNVGatewayBootstrap?.verify?.()||{state:"unavailable"},null,2)+"\n\nEarly refresh timeline:\n"+(window.VNVEarlyRefreshTrace?.events?.().slice(-24).join("\n")||"Early probe unavailable")+"\n\nLater events:\n"+traces.slice(-16).join("\n");
}
function record(note){
 if(closed)return;
 traces.push(when()+" "+note);if(traces.length>40)traces.shift();
 if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;display()})}
}
function trackedName(node){
 if(node.nodeType!==1)return null;
 if(tracked.has(node.id)||node.matches?.("header.site-header"))return node.id||"VNV header";
 for(const id of tracked)if(node.querySelector?.("#"+id))return id;
 if(node.querySelector?.("header.site-header"))return "VNV header";
 return null;
}
const observer=new MutationObserver(records=>{
 const changes=[];
 for(const r of records){
  if(r.type==="attributes"){
   const target=trackedName(r.target);
   if(target)changes.push("ATTRIBUTE "+target+" ("+r.attributeName+")");
   continue;
  }
  for(const node of r.addedNodes){const found=trackedName(node);if(found)changes.push("ADDED "+found)}
  for(const node of r.removedNodes){const found=trackedName(node);if(found)changes.push("REMOVED "+found)}
 }
 if(changes.length)record([...new Set(changes)].join("; "));
});
function begin(){
 if(closed||!document.body)return;
 observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["style","hidden","class","aria-hidden"]});
 record("Probe started");
}
if(document.body)begin();else document.addEventListener("DOMContentLoaded",begin,{once:true});
document.addEventListener("DOMContentLoaded",()=>record("DOMContentLoaded"),{once:true});
window.addEventListener("load",()=>record("window load"),{once:true});
window.addEventListener("pageshow",()=>record("pageshow"));
window.addEventListener("error",e=>{
 if(e.target&&e.target!==window&&e.target.tagName==="SCRIPT")record("SCRIPT LOAD ERROR: "+(e.target.src||"").split("/").slice(-1)[0]);
 else if(e.message)record("JS ERROR: "+String(e.message).slice(0,140));
},true);
window.addEventListener("unhandledrejection",e=>record("PROMISE REJECTION: "+String(e.reason?.message||"unknown").slice(0,130)));
window.VNVGatewayChromeAudit=Object.freeze({version:"1.4.0",snapshot:()=>TARGETS.map(([name,find])=>summary(name,find)),events:()=>traces.slice()});
})();
