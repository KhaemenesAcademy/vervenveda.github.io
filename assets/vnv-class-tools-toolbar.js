/* Verve N Veda · Universal Class Tools Toolbar v1.1.0
   Canonical lower-left learning-tools companion to vnv-ecosystem-toolbar.js.
   Idempotent. Directory-backed. Navigation only; no grading/mastery mutations. */
(()=>{
"use strict";
const API_KEY="VNVClassToolsToolbar";
const LEGACY_API_KEY="KhaemenesClassToolsToolbarV1";
const CONFIG_KEY="KhaemenesClassToolsConfigV1";
const ROOT_ID="vnvClassToolsToolbar";
const STYLE_ID="vnvClassToolsToolbarStyles";
const DIRECTORY_URLS=Object.freeze([
 "https://khaemenesacademy.github.io/vervenveda.github.io/ecosystem/master-ecosystem-directory.json",
 "https://vervenveda.com/ecosystem/master-ecosystem-directory.json"
]);

const HIGH_DEFAULT=Object.freeze({
 id:"high-school",
 match:/\/grades\/grade-(09|10|11|12)\/student-profile\/(?:index\.html)?$/i,
 toggleLabel:"Class Tools",
 ariaLabel:"Class tools",
 tools:[
  {type:"link",label:"Games",sub:"Practice & logic",href:"games/"},
  {type:"materials",label:"Materials",sub:"Videos & printables"},
  {type:"notes",label:"Notes",sub:"Study workspace"},
  {type:"link",label:"Parent Tools",sub:"Family support",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"},
  {type:"ecosystem-link",label:"Search",sub:"Search ecosystem",ecosystemId:"plera",fallbackHref:"https://vervenveda.com/PLERASearch.github.io/"},
  {type:"help",label:"Instructions",sub:"How to use tools"}
 ],
 materials:{
  title:"Learning Materials",
  intro:"Open your current lesson first so its games, approved videos, printables and class-specific tools stay matched to what you are learning.",
  links:[
   {label:"Open Daily Lessons",href:"daily-lessons/"},
   {label:"Scientific Calculator",ecosystemId:"pro-calculator",fallbackHref:"https://vervenveda.github.io/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/"}
  ]
 },
 help:{
  title:"How Class Tools Work",
  paragraphs:[
   "<strong>Lessons stay primary.</strong> Games and videos reinforce classwork; they do not replace written work or mastery checks.",
   "<strong>Printables stay connected.</strong> Open the current lesson to use the worksheet or evidence page that belongs with it.",
   "<strong>Assessment rules still apply.</strong> Use calculators and other tools only when that assessment allows them."
  ]
 }
});

let directoryPromise=null;
let controller=null;

const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const cfg=()=>window[CONFIG_KEY]&&typeof window[CONFIG_KEY]==="object"?window[CONFIG_KEY]:HIGH_DEFAULT;
const routeAllowed=c=>{
 if(c.match instanceof RegExp)return c.match.test(location.pathname);
 if(typeof c.match==="function")return !!c.match(location);
 if(Array.isArray(c.paths))return c.paths.some(p=>location.pathname.includes(String(p)));
 return c===HIGH_DEFAULT?HIGH_DEFAULT.match.test(location.pathname):true;
};
const activeEntry=e=>e&&e.directoryVisible===true&&e.access==="free-public"&&e.status==="active"&&typeof e.url==="string";

async function directory(){
 if(directoryPromise)return directoryPromise;
 directoryPromise=(async()=>{
  let lastError=null;
  for(const url of DIRECTORY_URLS){
   try{
    const r=await fetch(url,{cache:"no-store",credentials:"omit"});
    if(!r.ok)throw Error("HTTP "+r.status);
    const data=await r.json();
    if(Array.isArray(data?.entries))return data.entries.filter(activeEntry);
   }catch(err){lastError=err}
  }
  console.warn("VNV Class Tools directory unavailable; local fallbacks remain active.",lastError);
  return [];
 })();
 return directoryPromise;
}
async function resolveEcosystemId(id,fallback=""){
 const entries=await directory();
 const hit=entries.find(e=>e.id===id);
 return hit?.url||fallback||"";
}
function filtered(entries,filter={}){
 const types=new Set((filter.types||[]).map(String));
 const ids=new Set((filter.ids||[]).map(String));
 return entries.filter(e=>{
  if(filter.category&&e.category!==filter.category)return false;
  if(filter.repository&&e.repository!==filter.repository)return false;
  if(types.size&&!types.has(e.type))return false;
  if(ids.size&&!ids.has(e.id))return false;
  if(filter.titleIncludes&&!String(e.title).toLowerCase().includes(String(filter.titleIncludes).toLowerCase()))return false;
  return true;
 }).slice(0,Number(filter.limit)||12);
}
function removeDuplicates(){
 [...document.querySelectorAll("#"+ROOT_ID)].slice(1).forEach(n=>n.remove());
 [...document.querySelectorAll("#"+STYLE_ID)].slice(1).forEach(n=>n.remove());
}
function isMounted(){return !!document.getElementById(ROOT_ID)}
function installStyle(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement("style");s.id=STYLE_ID;s.textContent=[
  '#vnvClassToolsToolbar{position:fixed;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));z-index:2147482400;width:min(320px,calc(100vw - 24px));font:400 16px/1.4 "Brandon Grotesque","Avenir Next",Arial,sans-serif}',
  '#vnvClassToolsToggle{min-height:48px;padding:10px 16px;border:1px solid rgba(180,139,69,.72);border-radius:7px;background:#243038;color:#fff8e9;font:400 16px/1.35 Cinzel,Georgia,serif;box-shadow:0 8px 24px #0004;cursor:pointer}',
  '#vnvClassToolsPanel{margin-top:6px;padding:7px;border:1px solid rgba(180,139,69,.48);border-radius:7px;background:rgba(255,253,248,.97);box-shadow:0 10px 30px rgba(15,25,37,.17);backdrop-filter:blur(10px)}',
  '#vnvClassToolsPanel[hidden],#vnvClassToolsPanel [hidden]{display:none!important}',
  '#vnvClassToolsPanel .vct-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}',
  '#vnvClassToolsPanel .vct-tool{box-sizing:border-box;display:flex;min-width:0;min-height:70px;padding:8px 5px;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:1px solid rgba(180,139,69,.5);border-radius:7px;background:#fffdf8;color:#243038;text-align:center;text-decoration:none;cursor:pointer;font:400 16px/1.25 "Brandon Grotesque","Avenir Next",Arial,sans-serif}',
  '#vnvClassToolsPanel .vct-tool strong{font:400 16px/1.2 Cinzel,Georgia,serif;color:#243038}',
  '#vnvClassToolsPanel .vct-tool span{font-size:16px;line-height:1.2;color:#4b554f}',
  '#vnvClassToolsPanel .vct-pop{margin-top:7px;padding:12px;border:1px solid #b48b45;border-radius:7px;background:#fffaf0;color:#243038;max-height:42vh;overflow:auto}',
  '#vnvClassToolsPanel .vct-pop h2{margin:0 0 7px;font:400 20px/1.3 Cinzel,Georgia,serif}',
  '#vnvClassToolsPanel .vct-pop p{margin:7px 0;font-size:16px;line-height:1.5}',
  '#vnvClassToolsPanel .vct-links{display:grid;gap:6px;margin-top:9px}',
  '#vnvClassToolsPanel .vct-links a{display:block;min-height:44px;box-sizing:border-box;padding:10px;border:1px solid #b48b45;border-radius:7px;background:#243038;color:#fff8e9;text-align:center;text-decoration:none;font-size:16px}',
  '#vnvClassToolsToolbar :is(button,a):focus-visible{outline:3px solid #e0bf83;outline-offset:3px}',
  '@media(max-width:620px){#vnvClassToolsToolbar{width:min(294px,calc(100vw - 20px))}#vnvClassToolsPanel .vct-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}',
  '@media print{#vnvClassToolsToolbar{display:none!important}}'
 ].join("");
 (document.head||document.documentElement).append(s);
}
async function materialLinks(c){
 const out=[];
 for(const item of c.materials?.links||[]){
  const href=item.ecosystemId?await resolveEcosystemId(item.ecosystemId,item.fallbackHref):item.href;
  if(href)out.push({label:item.label||"Open",href});
 }
 return out;
}
async function resolvedTools(c){
 const out=[];
 for(const tool of (c.tools||[]).slice(0,6)){
  const copy={...tool};
  if(copy.type==="ecosystem-link"){
   copy.href=await resolveEcosystemId(copy.ecosystemId,copy.fallbackHref);
   copy.type="link";
  }
  out.push(copy);
 }
 return out;
}
function toolHTML(t,i){
 const body='<strong>'+esc(t.label||"Tool")+'</strong><span>'+esc(t.sub||"")+'</span>';
 if(t.type==="link")return '<a class="vct-tool" href="'+esc(t.href||"#")+'">'+body+'</a>';
 if(t.type==="materials")return '<button class="vct-tool" type="button" data-vct-materials>'+body+'</button>';
 if(t.type==="notes")return '<button class="vct-tool" type="button" data-vct-notes>'+body+'</button>';
 if(t.type==="help")return '<button class="vct-tool" type="button" data-vct-help>'+body+'</button>';
 if(t.type==="ecosystem-list")return '<button class="vct-tool" type="button" data-vct-list="'+i+'">'+body+'</button>';
 return '<button class="vct-tool" type="button" data-vct-action="'+esc(t.action||"")+'">'+body+'</button>';
}
function pop(title,intro,attrs=""){
 return '<div class="vct-pop" '+attrs+' hidden><h2>'+esc(title)+'</h2><p>'+esc(intro||"")+'</p><div class="vct-links"></div></div>';
}
async function mount(){
 const c=cfg();if(!routeAllowed(c)||!document.body)return false;
 removeDuplicates();
 if(isMounted()){document.documentElement.dataset.vnvClassTools="mounted";return true;}
 if(controller)controller.abort();controller=new AbortController();
 installStyle();
 const tools=await resolvedTools(c);
 const mats=await materialLinks(c);
 const root=document.createElement("aside");root.id=ROOT_ID;root.dataset.vnvClassToolsConfig=String(c.id||"custom");root.setAttribute("aria-label",c.ariaLabel||"Class tools");
 root.innerHTML='<button id="vnvClassToolsToggle" type="button" aria-expanded="false" aria-controls="vnvClassToolsPanel">'+esc(c.toggleLabel||"Class Tools")+'</button>'+
  '<section id="vnvClassToolsPanel" hidden aria-label="'+esc(c.ariaLabel||"Class tools")+' menu">'+
   '<div class="vct-grid">'+tools.map(toolHTML).join("")+'</div>'+
   pop(c.materials?.title||"Learning Materials",c.materials?.intro||"Open the materials that match your class.",'data-vct-materials-panel')+
   '<div class="vct-pop" data-vct-help-panel hidden><h2>'+esc(c.help?.title||"How Class Tools Work")+'</h2>'+(c.help?.paragraphs||[]).map(p=>'<p>'+String(p)+'</p>').join("")+'</div>'+
   pop("Ecosystem Tools","Approved public tools from the Verve N Veda ecosystem directory.",'data-vct-directory-panel')+
  '</section>';
 document.body.append(root);
 const toggle=root.querySelector("#vnvClassToolsToggle"),panel=root.querySelector("#vnvClassToolsPanel");
 const matLinks=root.querySelector("[data-vct-materials-panel] .vct-links");
 mats.forEach(x=>{const a=document.createElement("a");a.href=x.href;a.textContent=x.label;matLinks.append(a)});
 const hidePops=()=>root.querySelectorAll(".vct-pop").forEach(p=>p.hidden=true);
 const setOpen=open=>{panel.hidden=!open;toggle.setAttribute("aria-expanded",open?"true":"false");if(!open)hidePops()};
 toggle.addEventListener("click",()=>setOpen(panel.hidden),{signal:controller.signal});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden){setOpen(false);toggle.focus()}},{signal:controller.signal});
 root.querySelector("[data-vct-materials]")?.addEventListener("click",()=>{const p=root.querySelector("[data-vct-materials-panel]");const open=p.hidden;hidePops();p.hidden=!open},{signal:controller.signal});
 root.querySelector("[data-vct-help]")?.addEventListener("click",()=>{const p=root.querySelector("[data-vct-help-panel]");const open=p.hidden;hidePops();p.hidden=!open},{signal:controller.signal});
 root.querySelector("[data-vct-notes]")?.addEventListener("click",()=>{
  if(typeof c.openNotes==="function"){c.openNotes({root,setOpen});return}
  const trigger=document.querySelector('[data-profile-dialog-for="my-profile-extras"],[data-profile-dialog-for="study-studio"],button[aria-controls*="study" i],a[href*="study" i]');
  if(trigger){setOpen(false);trigger.click();return}
  const target=document.querySelector("#my-profile-extras,#studyStudio,[data-study-studio]");
  if(target){setOpen(false);target.scrollIntoView({behavior:"smooth",block:"start"});return}
  if(c.notesHref)location.href=new URL(c.notesHref,location.href).href;
 },{signal:controller.signal});
 root.querySelectorAll("[data-vct-list]").forEach(btn=>btn.addEventListener("click",async()=>{
  const t=tools[Number(btn.dataset.vctList)],p=root.querySelector("[data-vct-directory-panel]"),box=p.querySelector(".vct-links");
  hidePops();box.replaceChildren();
  const entries=filtered(await directory(),t.filter||{});
  entries.forEach(e=>{const a=document.createElement("a");a.href=e.url;a.textContent=e.title;box.append(a)});
  if(!entries.length){const note=document.createElement("p");note.textContent="No approved directory tools match this view.";box.append(note)}
  p.hidden=false;
 },{signal:controller.signal}));
 root.querySelectorAll("[data-vct-action]").forEach(btn=>btn.addEventListener("click",()=>{
  const fn=c.actions?.[btn.dataset.vctAction];if(typeof fn==="function")fn({root,setOpen,button:btn});
 },{signal:controller.signal}));
 document.documentElement.dataset.vnvClassTools="mounted";
 document.documentElement.dataset.vnvClassToolsConfig=String(c.id||"custom");
 return true;
}
function unmount(){if(controller)controller.abort();document.getElementById(ROOT_ID)?.remove();document.documentElement.dataset.vnvClassTools="unmounted";}
const api=Object.freeze({version:"1.1.0",mount,unmount,isMounted,directory});
window[API_KEY]=api;window[LEGACY_API_KEY]=api;
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>void mount(),{once:true});
else void mount();
})();