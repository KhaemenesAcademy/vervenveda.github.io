/* Verve N Veda · Ticker AutoPopulate · canonical migration engine · v1.0.1
   Purpose: one discoverable ticker authority per migrated page.
   Frozen exception: Verve N Veda public gateway root is never modified by this engine. */
(()=>{"use strict";
if(window.VNV_TICKER?.autoPopulate)return;

const VERSION="1.0.1";
const ROOT_ID="vnvTickerAutoPopulate";
const STYLE_ID="vnvTickerAutoPopulateStyles";
const PAUSE_KEY="VNV_TICKER_PAUSED";
const DEFAULT_MAX=14;

function frozenGateway(){
  const host=String(location.hostname||"").toLowerCase();
  const path=(String(location.pathname||"/").replace(/\/+$/,"")||"/").toLowerCase();
  return document.documentElement.dataset.vnvTickerGateway!=="enabled" && path==="/" && (host==="vervenveda.com"||host==="www.vervenveda.com"||host==="vervenveda.github.io");
}
function visible(el){
  if(!el||el.hidden||el.closest("[hidden],[aria-hidden='true'],dialog:not([open])"))return false;
  const s=getComputedStyle(el);
  return s.display!=="none"&&s.visibility!=="hidden";
}
function textOf(a){
  return String(a.getAttribute("data-ticker-label")||a.getAttribute("aria-label")||a.textContent||"")
    .replace(/\s+/g," ").trim();
}
function normalizedHref(a){
  const raw=a.getAttribute("href");
  if(!raw||/^\s*(?:javascript:|mailto:|tel:)/i.test(raw))return "";
  try{
    const u=new URL(raw,location.href);
    if(!/^https?:$/.test(u.protocol))return "";
    if(u.href===location.href)return "";
    return u.href;
  }catch{return "";}
}
function discover(options={}){
  const explicit=[...document.querySelectorAll("a[data-ticker]")];
  const selectors=options.selectors||[
    "header a[href]","nav a[href]","main a[href]",
    "[class*='card'] a[href]","[class*='portal'] a[href]",
    "[class*='resource'] a[href]","[class*='course'] a[href]"
  ];
  const candidates=explicit.length?explicit:[...document.querySelectorAll(selectors.join(","))];
  const exclude=options.exclude||[
    "#"+ROOT_ID+" a","[data-vnv-ticker-ignore]","a[download]",
    ".skip-link",".ticker-control",".vnv-ticker-control",
    "[aria-label*='logout' i]","[aria-label*='sign out' i]"
  ];
  const seen=new Set(), out=[];
  for(const a of candidates){
    if(!visible(a)||exclude.some(sel=>{try{return a.matches(sel)||a.closest(sel)}catch{return false}}))continue;
    const href=normalizedHref(a), label=textOf(a);
    if(!href||!label||label.length>54)continue;
    const key=href;
    if(seen.has(key))continue;
    seen.add(key);
    out.push({label,href});
    if(out.length>=Number(options.max||document.body?.dataset.vnvTickerMax||DEFAULT_MAX))break;
  }
  return out;
}
function cleanLegacy(options={}){
  if(options.cleanLegacy===false)return;
  const selectors=options.legacySelectors||[
    "#khaeNetworkTicker",
    "[data-khaemenes-academy-ticker-root]",
    ".khae-network-ticker",
    ".academy-ticker",
    ".quick-links-ticker",
    ".site-ticker"
  ];
  for(const sel of selectors){
    document.querySelectorAll(sel).forEach(el=>{if(el.id!==ROOT_ID)el.remove()});
  }
}
function ensureStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement("style");
  s.id=STYLE_ID;
  s.textContent=`
:root{--vnv-autopopulate-ticker-height:33px;--khae-ticker-height:var(--vnv-autopopulate-ticker-height)}
#${ROOT_ID}{position:sticky;top:0;z-index:2147481000;height:var(--vnv-autopopulate-ticker-height);display:grid;grid-template-columns:minmax(0,1fr) 44px;overflow:hidden;color:#f4ead1;background:linear-gradient(90deg,#07101d,#10243b 48%,#07101d);border-bottom:1px solid rgba(255,255,255,.13);box-shadow:0 4px 14px rgba(6,15,27,.12);font-family:"Brandon Grotesque","Avenir Next",Avenir,Montserrat,"Segoe UI",Arial,sans-serif}
#${ROOT_ID}[data-vnv-ticker-engine="autopopulate"]{isolation:isolate}
#${ROOT_ID} .vnv-ticker-viewport{min-width:0;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 27px,#000 calc(100% - 27px),transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 27px,#000 calc(100% - 27px),transparent 100%)}
#${ROOT_ID} .vnv-ticker-track{width:max-content;height:100%;display:flex;align-items:center;white-space:nowrap;animation:vnvAutoTickerMove 33s linear infinite;will-change:transform}
#${ROOT_ID}:hover .vnv-ticker-track,#${ROOT_ID}:focus-within .vnv-ticker-track,#${ROOT_ID}[data-paused="true"] .vnv-ticker-track{animation-play-state:paused}
#${ROOT_ID} .vnv-ticker-set{height:100%;display:flex;align-items:center;gap:14px;padding-inline:11px}
#${ROOT_ID} .vnv-ticker-label{color:#ead9b8;font-family:Cinzel,Aboreto,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-size:10px;font-weight:444;letter-spacing:.18em;text-transform:uppercase}
#${ROOT_ID} a{color:#eef3f6!important;text-decoration:none!important;font-size:10px!important;font-weight:400!important;letter-spacing:.075em!important;text-transform:uppercase!important;white-space:nowrap!important}
#${ROOT_ID} a::before{content:"·";margin-right:12px;color:rgba(255,255,255,.38)}
#${ROOT_ID} a:hover,#${ROOT_ID} a:focus-visible{color:#fff!important;text-decoration:underline!important;text-underline-offset:3px!important}
#${ROOT_ID} .vnv-ticker-control{width:44px;height:var(--vnv-autopopulate-ticker-height);display:grid;place-items:center;padding:0;border:0;border-left:1px solid rgba(255,255,255,.13);border-radius:0;color:#f4ead1;background:rgba(0,0,0,.08);font:400 11px/1 Arial,sans-serif;cursor:pointer}
#${ROOT_ID} .vnv-ticker-control:hover{background:rgba(255,255,255,.09)}
@keyframes vnvAutoTickerMove{to{transform:translateX(-33.333333%)}}
@media(max-width:560px){:root{--vnv-autopopulate-ticker-height:32px;--khae-ticker-height:var(--vnv-autopopulate-ticker-height)}#${ROOT_ID}{grid-template-columns:minmax(0,1fr) 36px}#${ROOT_ID} .vnv-ticker-set{gap:12px;padding-inline:7px}#${ROOT_ID} .vnv-ticker-label,#${ROOT_ID} a{font-size:9px!important}#${ROOT_ID} .vnv-ticker-control{width:36px}}
@media(prefers-reduced-motion:reduce){#${ROOT_ID} .vnv-ticker-track{animation:none!important;transform:none!important;overflow-x:auto}}
@media print{#${ROOT_ID}{display:none!important}}`;
  (document.head||document.documentElement).append(s);
}
function defaultLabel(){
  return document.body?.dataset.vnvTickerLabel ||
    document.querySelector("h1")?.textContent?.replace(/\s+/g," ").trim().slice(0,38) ||
    "Quick Links";
}
function setBlock(label,links,hidden){
  const set=document.createElement("div"); set.className="vnv-ticker-set";
  if(hidden)set.setAttribute("aria-hidden","true");
  const lab=document.createElement("span");lab.className="vnv-ticker-label";lab.textContent=label;
  set.append(lab);
  for(const item of links){
    const a=document.createElement("a");a.href=item.href;a.textContent=item.label;
    if(hidden)a.tabIndex=-1;
    set.append(a);
  }
  return set;
}
function fillShortSets(viewport,sets,links){
  if(!viewport||!sets?.length||!links?.length)return;
  const target=Math.max(0,viewport.clientWidth+160);
  for(const set of sets){
    set.querySelectorAll("[data-vnv-ticker-fill]").forEach(node=>node.remove());
    if(set.scrollWidth>=target)continue;
    let guard=0,index=0;
    while(set.scrollWidth<target&&guard<96){
      const item=links[index%links.length];
      const a=document.createElement("a");
      a.href=item.href;
      a.textContent=item.label;
      a.tabIndex=-1;
      a.setAttribute("aria-hidden","true");
      a.dataset.vnvTickerFill="1";
      set.append(a);
      index++;guard++;
    }
  }
}
function render(links,options={}){
  if(!links?.length)return null;
  ensureStyle();
  document.getElementById(ROOT_ID)?.remove();
  const ticker=document.createElement("div");
  ticker.id=ROOT_ID;
  ticker.dataset.vnvTickerEngine="autopopulate";
  ticker.dataset.vnvTickerVersion=VERSION;
  ticker.dataset.paused="false";
  ticker.setAttribute("aria-label",options.ariaLabel||"Page quick links");

  const viewport=document.createElement("div");viewport.className="vnv-ticker-viewport";
  const track=document.createElement("div");track.className="vnv-ticker-track";
  const label=options.label||defaultLabel();
  const sets=[setBlock(label,links,false),setBlock(label,links,true),setBlock(label,links,true)];
  track.append(...sets);
  viewport.append(track);

  const button=document.createElement("button");
  button.className="vnv-ticker-control";button.type="button";
  const pauseKey=options.pauseKey||PAUSE_KEY;
  let paused=false;try{paused=localStorage.getItem(pauseKey)==="true"}catch{}
  const apply=value=>{
    ticker.dataset.paused=String(value);
    button.setAttribute("aria-pressed",String(value));
    button.setAttribute("aria-label",value?"Resume quick-link ticker":"Pause quick-link ticker");
    button.textContent=value?"▶":"Ⅱ";
    try{localStorage.setItem(pauseKey,String(value))}catch{}
  };
  apply(paused);button.addEventListener("click",()=>apply(ticker.dataset.paused!=="true"));
  ticker.append(viewport,button);

  const anchor=document.querySelector(options.before||"[data-khae-header],.site-header,header");
  if(anchor?.parentNode)anchor.parentNode.insertBefore(ticker,anchor); else document.body.prepend(ticker);

  const refill=()=>fillShortSets(viewport,sets,links);
  requestAnimationFrame(refill);
  if(typeof ResizeObserver==="function"){
    const ro=new ResizeObserver(()=>refill());
    ro.observe(viewport);
  }else{
    window.addEventListener("resize",refill,{passive:true});
  }
  return ticker;
}
function autoPopulate(options={}){
  if(frozenGateway()||document.documentElement.dataset.vnvTicker==="off"||document.body?.dataset.vnvTicker==="off")return null;
  cleanLegacy(options);
  const links=Array.isArray(options.links)&&options.links.length?options.links:discover(options);
  return render(links,options);
}

window.VNV_TICKER=Object.freeze({version:VERSION,autoPopulate,discover});
})();