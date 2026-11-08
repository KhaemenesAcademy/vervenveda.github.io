/* Verve N Veda · single-source ecosystem utility rail. No grades, profile writes or assessments. */
(()=>{"use strict";
if(window.VNVEcosystemToolbar)return;
const A="https://vervenveda.com/Khaemenes_Academy.github.io/",V="https://vervenveda.com/";
const ROOT="vnvEcosystemUtilityDock";
const ACADEMY_TICKER="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-academy-ticker.js";
let mounted=false;

function ensureAcademyTicker(){
 try{
  const host=String(location.hostname||"").toLowerCase();
  const path=String(location.pathname||"").toLowerCase();
  const academy=host.includes("khaemenes_academy")||path.includes("/khaemenes_academy.github.io/");
  if(!academy)return;
  /* AutoPopulate migration guard: never resurrect the legacy Academy ticker on a migrated page. */
  if(window.VNV_TICKER?.autoPopulate||document.getElementById("vnvTickerAutoPopulate")||document.querySelector('script[data-vnv-ticker-autopopulate]'))return;
  if(window.KhaemenesAcademyTicker?.mount){window.KhaemenesAcademyTicker.mount();return;}
  if(document.querySelector('script[data-khaemenes-academy-ticker]'))return;
  const s=document.createElement("script");
  s.src=ACADEMY_TICKER;
  s.defer=true;
  s.dataset.khaemenesAcademyTicker="1";
  (document.head||document.documentElement).append(s);
 }catch{}
}
function academyStudentSurface(){
 try{
  const host=String(location.hostname||"").toLowerCase();
  const path=String(location.pathname||"").toLowerCase();
  return (host.includes("khaemenes_high")||path.includes("/khaemenes_high.github.io/")||host.includes("khaemenes_academy")||path.includes("/khaemenes_academy.github.io/"))
    && (/\/student-profile\//.test(path)||/\/student\//.test(path)||/\/grades\/grade-(?:09|10|11|12)\//.test(path));
 }catch{return false}
}
function mount(){
 if(mounted||!document.body)return;
 // Existing protected examinations must not gain study/search shortcuts.
 if(/\/(quiz|quizzes|exam|exams|assessment|assessments)\//i.test(location.pathname)||document.documentElement.hasAttribute("data-closed-book")||document.body.hasAttribute("data-closed-book"))return;
 ensureAcademyTicker();
 if(document.getElementById(ROOT))return;
 const style=document.createElement("style");style.id="vnvEcosystemUtilityStyles";style.textContent=`/* Verve N Veda canonical ecosystem toolbar — six controls, isolated from page layout. */
/* Hide only duplicate floating utility launchers; retain lesson-specific in-page tools. */
body:has(#vnvEcosystemUtilityDock) :is(#khaemenesLearnerUtilityToolbar,#khaeLandingUtilityDock,#khaemenesHomeUtilityDock,#vnvBetaProgramLink,#vnvBetaProgramFallback,a[aria-label="Open the Verve N Veda Beta Program"]){display:none!important}
\nhtml:root body #vnvEcosystemUtilityDock{position:fixed!important;inset:auto max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) auto!important;z-index:2147482500!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:stretch!important;width:min(480px,calc(100vw - 24px))!important;box-sizing:border-box!important;gap:7px!important;padding:10px!important;border:1px solid rgba(180,139,69,.48)!important;border-radius:7px!important;background:rgba(255,253,248,.97)!important;box-shadow:0 10px 30px rgba(15,25,37,.17)!important;backdrop-filter:blur(10px)!important}\nhtml:root body #vnvEcosystemUtilityDock>a,html:root body #vnvEcosystemUtilityDock>button{all:unset!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;min-width:0!important;width:100%!important;height:auto!important;min-height:52px!important;max-height:none!important;border:1px solid rgba(23,57,47,.35)!important;border-radius:7px!important;background:#f5f8f6!important;color:#17392f!important;padding:5px!important;text-align:center!important;font:400 16px/1.2 "Nunito","Brandon Grotesque","Avenir Next",Arial,sans-serif!important;letter-spacing:0!important;white-space:normal!important;overflow:visible!important;cursor:pointer!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"profile\"]{background:#fffdf8!important;border-color:rgba(180,139,69,.72)!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"updates\"]{background:#f8f4e9!important;border-color:rgba(114,95,130,.35)!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"mentor\"]{background:#fff4d8!important;color:#493719!important;border-color:#b48b45!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"support\"]{background:#6d8374!important;color:#fff!important;border-color:#516b5b!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"beta\"]{background:#0f1925!important;color:#f7efe0!important;border-color:rgba(183,147,77,.72)!important}\nhtml:root body #vnvEcosystemUtilityDock>a:focus-visible,html:root body #vnvEcosystemUtilityDock>button:focus-visible{outline:3px solid #b48b45!important;outline-offset:2px!important}\n#vnvEcosystemUtilityUpdates{border:1px solid #b48b45;border-radius:7px;background:#fffdf8;color:#17211d;padding:22px;max-width:min(560px,calc(100vw - 28px))}\n#vnvEcosystemUtilityUpdates::backdrop{background:rgba(7,21,33,.52)}\n@media(max-width:380px){html:root body #vnvEcosystemUtilityDock{grid-template-columns:repeat(3,minmax(0,1fr))!important;width:min(354px,calc(100vw - 16px))!important;right:8px!important;bottom:8px!important;padding:7px!important;gap:5px!important}html:root body #vnvEcosystemUtilityDock>a,html:root body #vnvEcosystemUtilityDock>button{height:auto!important;min-height:52px!important;max-height:none!important;font-size:16px!important;padding:5px!important}}\n#vnvArchaemenesMentorDialog{position:fixed!important;inset:0!important;margin:auto!important;width:min(1080px,calc(100vw - 28px))!important;max-width:1080px!important;height:min(90vh,880px)!important;max-height:90vh!important;padding:0!important;overflow:hidden!important;border:4px solid #caa862!important;border-radius:7px!important;background:#fffdf8!important;color:#102b48!important;box-shadow:0 24px 80px rgba(0,0,0,.4)!important;z-index:2147483000!important}\n#vnvArchaemenesMentorDialog::backdrop{background:rgba(8,20,33,.78)!important}\n#vnvArchaemenesMentorDialog[open]{display:flex!important;flex-direction:column!important}\n#vnvArchaemenesMentorDialog .vnv-mentor-popup-header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding:12px 16px;background:#102b48;color:#fffdf8}\n#vnvArchaemenesMentorDialog .vnv-mentor-popup-header strong{font:400 18px Cinzel,Georgia,serif!important;color:#fffdf8!important}\n#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions{display:flex;gap:8px;align-items:center}\n#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions a,#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions button{padding:9px 12px;min-height:40px;box-sizing:border-box;border:1px solid #f3ca71;border-radius:7px;background:#f3ca71;color:#102b48;font:400 16px Nunito,Arial,sans-serif;cursor:pointer;text-decoration:none}\n#vnvArchaemenesMentorDialog iframe{display:block;width:100%;flex:1;min-height:0;border:0;background:#fffdf8}\n@media(max-width:600px){#vnvArchaemenesMentorDialog{width:calc(100vw - 12px)!important;height:94dvh!important;max-height:94dvh!important}#vnvArchaemenesMentorDialog .vnv-mentor-popup-header strong{font-size:16px!important}}\n\n/* Crisp shared VNV framing for Archaemenes; the embedded site retains its own design. */
#vnvArchaemenesMentorDialog{
 border:2px solid #b48b45!important;
 background:#f4f0e7!important;
 color:#243038!important;
 box-shadow:0 24px 70px rgba(8,18,15,.42)!important;
}
#vnvArchaemenesMentorDialog::backdrop{background:rgba(8,19,16,.72)!important}
#vnvArchaemenesMentorDialog .vnv-mentor-popup-header{
 display:flex!important;
 align-items:center!important;
 justify-content:space-between!important;
 padding:13px 18px!important;
 min-height:64px!important;
 gap:12px!important;
 border-bottom:2px solid #b48b45!important;
 background:#243038!important;
 color:#fff8e9!important;
}
#vnvArchaemenesMentorDialog .vnv-mentor-popup-header strong{
 font:400 clamp(17px,2vw,20px)/1.3 Cinzel,Georgia,serif!important;
 color:#fff8e9!important;
 -webkit-text-fill-color:#fff8e9!important;
 letter-spacing:.015em!important;
}
#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions{
 display:flex!important;gap:8px!important;flex-wrap:wrap!important;justify-content:center!important;
}
#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions a,
#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions button{
 min-height:40px!important;padding:8px 13px!important;
 border:1px solid #b48b45!important;border-radius:7px!important;
 background:#fff8e9!important;color:#243038!important;
 -webkit-text-fill-color:#243038!important;
 font:400 16px/1.3 Nunito,Arial,sans-serif!important;
 text-align:center!important;
 box-shadow:none!important;
}
#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions a:hover,
#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions button:hover{
 background:#f0e3cf!important;
}
#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions :is(a,button):focus-visible{
 outline:3px solid #e1c287!important;outline-offset:2px!important;
}
#vnvArchaemenesMentorDialog iframe{background:#f4f0e7!important}
@media(max-width:700px){
 #vnvArchaemenesMentorDialog .vnv-mentor-popup-header{
  flex-direction:column!important;justify-content:center!important;padding:12px!important;
 }
 #vnvArchaemenesMentorDialog .vnv-mentor-popup-header strong{text-align:center!important}
}
@media print{#vnvEcosystemUtilityDock,#vnvEcosystemUtilityUpdates,#vnvArchaemenesMentorDialog{display:none!important}}`;document.head.append(style);
 const dock=document.createElement("nav");dock.id=ROOT;dock.setAttribute("aria-label","Verve N Veda ecosystem utilities");
// Legacy campus dock is removed only after the canonical dock can mount;
// never touch lesson-specific evidence and assessment controls.
for(const legacy of ["khaeLandingUtilityDock","khaemenesHomeUtilityDock"]){
 const other=document.getElementById(legacy);
 if(other)other.style.setProperty("display","none","important");
}
 const link=(key,label,url)=>{const e=document.createElement("a");e.dataset.vnvTool=key;e.textContent=label;e.href=url;e.setAttribute("aria-label",label==="Profile"?"Open learner or scholar profile":label);dock.append(e);return e};
 const protectStudentResource=(anchor,label)=>{
  if(!academyStudentSurface())return anchor;
  anchor.target="_blank";anchor.rel="noopener noreferrer";
  anchor.setAttribute("aria-label",label+" — opens in a new tab");
  return anchor;
 };
 // One canonical chooser; no learner selection or account mutation.
 const profileLink=link("profile","Profile","#choose-profile");
 profileLink.setAttribute("aria-haspopup","dialog");
 profileLink.setAttribute("aria-controls","vnvProfileGradeChooser");
 profileLink.setAttribute("aria-label","Choose a Student or Parent Profile");
 const profileDialog=document.createElement("dialog");profileDialog.id="vnvProfileGradeChooser";profileDialog.setAttribute("aria-labelledby","vnvProfileChooseHeading");
 const chooserCss=document.createElement("style");chooserCss.id="vnvProfileGradeChooserCSS";
 chooserCss.textContent=`
 #vnvProfileGradeChooser{width:min(94vw,850px);max-height:calc(100dvh - 24px);margin:auto;padding:25px;overflow:auto;background:#fff8e9;color:#202724;border:2px solid #b48b45;border-radius:7px;box-shadow:0 22px 60px #0006}
 #vnvProfileGradeChooser::backdrop{background:rgba(10,20,18,.75)}
 #vnvProfileGradeChooser *{box-sizing:border-box}
 #vnvProfileGradeChooser header{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
 #vnvProfileGradeChooser h2{font:400 33px/1.25 Cinzel,Georgia,serif;color:#202724;margin:0}
 #vnvProfileGradeChooser h3{font:400 24px/1.25 Cinzel,Georgia,serif;color:#202724;margin:19px 0 10px}
 #vnvProfileGradeChooser p{font:400 18px/1.55 Nunito,Arial,sans-serif;color:#34463b}
 #vnvProfileGradeChooser .vnv-profile-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
 #vnvProfileGradeChooser a{display:flex;align-items:center;justify-content:center;min-height:53px;padding:9px;border:1px solid #b48b45;border-radius:7px;background:#202724;color:#fff8e9;text-align:center;text-decoration:none;font:400 16px/1.3 Nunito,Arial,sans-serif}
 #vnvProfileGradeChooser a:hover{background:#3a5449}
 #vnvProfileGradeChooser button{min-height:47px;padding:9px 16px;border:1px solid #202724;border-radius:7px;background:#fff8e9;color:#202724;font:400 16px/1.3 Nunito,Arial,sans-serif;cursor:pointer}
 #vnvProfileGradeChooser a:focus-visible,#vnvProfileGradeChooser button:focus-visible{outline:3px solid #b48b45;outline-offset:2px}
 @media(max-width:650px){#vnvProfileGradeChooser .vnv-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#vnvProfileGradeChooser{padding:15px}}
 /* Unified charcoal/parchment modal system: only these two utility dialogs. */
 #vnvProfileGradeChooser,#vnvEcosystemUtilityUpdates{
   box-sizing:border-box!important;
   border:2px solid #b48b45!important;
   border-radius:7px!important;
   background:#f4f0e7!important;
   color:#243038!important;
   box-shadow:0 24px 70px rgba(10,20,18,.38)!important;
   max-height:calc(100dvh - 32px)!important;
   overflow:auto!important;
   padding:0!important;
 }
 #vnvProfileGradeChooser{width:min(860px,calc(100vw - 32px))!important;}
 #vnvEcosystemUtilityUpdates{width:min(590px,calc(100vw - 32px))!important;max-width:none!important;}
 #vnvProfileGradeChooser::backdrop,#vnvEcosystemUtilityUpdates::backdrop{background:rgba(8,19,16,.70)!important;}
 #vnvProfileGradeChooser > header,#vnvEcosystemUtilityUpdates > header{
   display:flex!important;align-items:center!important;justify-content:center!important;
   flex-wrap:wrap!important;gap:13px!important;
   margin:0!important;padding:24px 24px 20px!important;
   border-bottom:2px solid #b48b45!important;
   background:#243038!important;color:#fff8e9!important;
   text-align:center!important;
 }
 #vnvProfileGradeChooser > header h2,#vnvEcosystemUtilityUpdates > header h2{
   flex:1 1 100%!important;margin:0!important;
   font:400 clamp(26px,4vw,33px)/1.25 Cinzel,Georgia,serif!important;
   color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important;
   text-align:center!important;
 }
 #vnvProfileGradeChooser > header button,#vnvEcosystemUtilityUpdates > header button{
   min-height:39px!important;padding:7px 20px!important;
   border:1px solid #c8ad76!important;border-radius:7px!important;
   background:#fff8e9!important;color:#243038!important;
   -webkit-text-fill-color:#243038!important;
   font:400 16px/1.35 Nunito,Arial,sans-serif!important;
   cursor:pointer!important;
 }
 #vnvProfileGradeChooser > p{
   max-width:730px!important;
   margin:20px auto!important;padding:0 24px!important;
   font:400 18px/1.55 Nunito,Arial,sans-serif!important;
   color:#34463b!important;text-align:center!important;
 }
 #vnvProfileGradeChooser > h3{
   margin:24px 24px 12px!important;
   font:400 24px/1.3 Cinzel,Georgia,serif!important;
   text-align:center!important;color:#243038!important;
 }
 #vnvProfileGradeChooser .vnv-profile-grid{
   display:grid!important;
   grid-template-columns:repeat(4,minmax(0,1fr))!important;
   gap:10px!important;margin:0 24px!important;
 }
 #vnvProfileGradeChooser .vnv-profile-grid a{
   min-height:48px!important;padding:10px 12px!important;
   border:1px solid #b48b45!important;border-radius:7px!important;
   background:#243038!important;color:#fff8e9!important;
   -webkit-text-fill-color:#fff8e9!important;
   font:400 16px/1.3 Nunito,Arial,sans-serif!important;
   text-align:center!important;text-decoration:none!important;
 }
 #vnvProfileGradeChooser .vnv-profile-grid a:hover{background:#394a43!important;}
 #vnvEcosystemUtilityUpdates .vnv-updates-body{
   padding:26px 26px 28px!important;text-align:center!important;
 }
 #vnvEcosystemUtilityUpdates .vnv-updates-body p{
   margin:0 auto 22px!important;max-width:460px!important;
   font:400 18px/1.6 Nunito,Arial,sans-serif!important;
   color:#34463b!important;text-align:center!important;
 }
 #vnvEcosystemUtilityUpdates .vnv-updates-actions{
   display:flex!important;justify-content:center!important;flex-wrap:wrap!important;gap:10px!important;
 }
 #vnvEcosystemUtilityUpdates .vnv-updates-actions a{
   display:inline-flex!important;align-items:center!important;justify-content:center!important;
   min-height:44px!important;padding:10px 18px!important;
   border:1px solid #b48b45!important;border-radius:7px!important;
   background:#243038!important;color:#fff8e9!important;
   -webkit-text-fill-color:#fff8e9!important;
   font:400 16px/1.35 Nunito,Arial,sans-serif!important;
   text-decoration:none!important;
 }
 #vnvEcosystemUtilityUpdates .vnv-updates-actions a:hover{background:#394a43!important;}
 #vnvProfileGradeChooser :is(a,button):focus-visible,
 #vnvEcosystemUtilityUpdates :is(a,button):focus-visible{outline:3px solid #b48b45!important;outline-offset:3px!important;}
 @media(max-width:650px){
   #vnvProfileGradeChooser .vnv-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;margin:0 15px!important;}
   #vnvProfileGradeChooser > header,#vnvEcosystemUtilityUpdates > header{padding:19px 14px!important;}
   #vnvProfileGradeChooser > h3{margin-inline:15px!important;}
   #vnvProfileGradeChooser > p{padding-inline:15px!important;}
   #vnvEcosystemUtilityUpdates .vnv-updates-body{padding:20px 15px!important;}
 }
 @media(max-width:360px){
   #vnvProfileGradeChooser .vnv-profile-grid{grid-template-columns:minmax(0,1fr)!important;}
 }
 `;document.head.append(chooserCss);
 const chooserHead=document.createElement("header");
 const chooserHeading=document.createElement("h2");chooserHeading.id="vnvProfileChooseHeading";chooserHeading.textContent="Choose Your Profile";
 const chooserClose=document.createElement("button");chooserClose.type="button";chooserClose.textContent="Close";chooserClose.addEventListener("click",()=>profileDialog.close());
 chooserHead.append(chooserHeading,chooserClose);profileDialog.append(chooserHead);
 const intro=document.createElement("p");intro.textContent="Choose a student grade or parent portal. Opening a grade does not change any learner's enrollment or records.";profileDialog.append(intro);
 const chooserGroups=[
  ["Early Learning",[["Pre-K",V+"Khaemenes_Preschool.github.io/student-profile/#learningStudio"],["Kindergarten",V+"Khaemenes_KinderGarden.github.io/student-profile/"]]],
  ["Elementary Grades 1–5",[1,2,3,4,5].map(n=>["Grade "+n,V+"Khaemenes_Elementary.github.io/student-profile/"] )],
  ["Middle Grades 6–8",[6,7,8].map(n=>["Grade "+n,V+"Khaemenes_Middle.github.io/grades/grade-"+String(n).padStart(2,"0")+"/"])],
  ["High School Grades 9–12",[9,10,11,12].map(n=>["Grade "+n,V+"Khaemenes_High.github.io/grades/grade-"+String(n).padStart(2,"0")+"/student-profile/"])],
  ["Family & Adult",[["Parent / Guardian",A+"family/#khaeFamilyParentProfileHero"],["Higher Learning",A+"adult/"]]]
 ];
 for(const [name,items] of chooserGroups){
  const h=document.createElement("h3");h.textContent=name;profileDialog.append(h);
  const grid=document.createElement("nav");grid.className="vnv-profile-grid";grid.setAttribute("aria-label",name);
  for(const [label,url] of items){const item=document.createElement("a");item.href=url;item.textContent=label;grid.append(item)}
  profileDialog.append(grid);
 }
 const qualifier=document.createElement("p");qualifier.textContent="Elementary grades share their current profile page. Middle School choices currently open the grade landing pages.";profileDialog.append(qualifier);
 profileLink.addEventListener("click",e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  e.preventDefault();if(!profileDialog.open)profileDialog.showModal();chooserClose.focus();
 });
 profileDialog.addEventListener("click",e=>{if(e.target===profileDialog)profileDialog.close()});
 profileDialog.addEventListener("close",()=>profileLink.focus());
 protectStudentResource(link("search","Search",V+"PLERASearch.github.io/"),"Search");
 const updates=document.createElement("button");updates.type="button";updates.dataset.vnvTool="updates";updates.textContent="Updates";dock.append(updates);
 const mentorUrl="https://artist1970.github.io/Archaemenes.github.io/#archaemenesConversation";
  // The in-dialog frame opens at the page hero, not at the lower conversation anchor.
  const mentorLandingUrl="https://artist1970.github.io/Archaemenes.github.io/";
 const mentor=link("mentor","Mentor",mentorUrl);
 mentor.setAttribute("aria-haspopup","dialog");
 mentor.setAttribute("aria-controls","vnvArchaemenesMentorDialog");
 const mentorDialog=document.createElement("dialog");
 mentorDialog.id="vnvArchaemenesMentorDialog";
 mentorDialog.setAttribute("aria-label","Conversation with Archaemenes");
 const mentorHeader=document.createElement("div");mentorHeader.className="vnv-mentor-popup-header";
 const mentorTitle=document.createElement("strong");mentorTitle.textContent="Archaemenes · Scholarly Conversation";
 const mentorActions=document.createElement("div");mentorActions.className="vnv-mentor-popup-actions";
 const mentorDirect=document.createElement("a");mentorDirect.href=mentorUrl;mentorDirect.target="_blank";mentorDirect.rel="noopener noreferrer";mentorDirect.textContent="Open Mentor in New Tab";
 const mentorClose=document.createElement("button");mentorClose.type="button";mentorClose.textContent="Close";mentorClose.setAttribute("aria-label","Close Archaemenes conversation");
 mentorClose.addEventListener("click",()=>mentorDialog.close());
 mentorActions.append(mentorDirect,mentorClose);mentorHeader.append(mentorTitle,mentorActions);
 const mentorFrame=document.createElement("iframe");mentorFrame.title="Archaemenes public mentor conversation";mentorFrame.loading="lazy";mentorFrame.referrerPolicy="no-referrer";
 mentorDialog.append(mentorHeader,mentorFrame);
 mentor.addEventListener("click",e=>{if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();try{mentorDialog.showModal();mentorFrame.src=mentorLandingUrl;mentorClose.focus()}catch{window.open(mentorUrl,"_blank","noopener,noreferrer")}});
 mentorDialog.addEventListener("click",e=>{if(e.target===mentorDialog)mentorDialog.close()});
 mentorDialog.addEventListener("close",()=>mentorFrame.removeAttribute("src"));
 protectStudentResource(link("support","Support","https://buy.stripe.com/aFa8wQ5xf9Scf65caT4AU0s"),"Support");
 // Beta reports carry public route context only. Never transmit search/hash,
// user state, identifiers from protected routes or filesystem/network internals.
 const betaLink=protectStudentResource(link("beta","Beta",V+"beta/"),"Beta");
 function betaPublicSource(){
  try{
   const url=new URL(location.href);
   if(url.protocol!=="https:"&&url.protocol!=="http:")return "";
   const host=url.hostname.toLowerCase();
   if(host!=="vervenveda.com"&&host!=="www.vervenveda.com"&&!/^(?:[a-z0-9-]+)\.github\.io$/.test(host))return "";
   const pathname=decodeURIComponent(url.pathname);
   const parts=pathname.split("/").filter(Boolean);
   if(parts.length>12||parts.some(part=>part.length>64||!/^[-a-zA-Z0-9_.]+$/.test(part)||/[0-9]{7,}/.test(part)||/@/.test(part)))return "";
   if(parts.some(part=>/^(?:admin|private|internal|api|account|auth|session|token|checkout|payment|vault)$/i.test(part)))return "";
   const path="/"+parts.join("/");
   return (host==="vervenveda.com"||host==="www.vervenveda.com"?path:host+path).slice(0,240);
  }catch{return ""}
 }
 const refreshBeta=()=>{
  const source=betaPublicSource();
  betaLink.href=V+"beta/"+(source?"?source="+encodeURIComponent(source):"");
 };
 betaLink.addEventListener("pointerenter",refreshBeta);
 betaLink.addEventListener("focus",refreshBeta);
 betaLink.addEventListener("click",refreshBeta,true);
 window.addEventListener("pageshow",refreshBeta);
 refreshBeta();
 const dialog=document.createElement("dialog");dialog.id="vnvEcosystemUtilityUpdates";dialog.setAttribute("aria-labelledby","vnvUpdatesHeading");
 const updatesHeader=document.createElement("header");
 const title=document.createElement("h2");title.id="vnvUpdatesHeading";title.textContent="Updates & Help";
 const close=document.createElement("button");close.type="button";close.textContent="Close";close.setAttribute("aria-label","Close Updates and Help");
 close.addEventListener("click",()=>dialog.close());updatesHeader.append(title,close);
 const updatesBody=document.createElement("div");updatesBody.className="vnv-updates-body";
 const note=document.createElement("p");note.textContent="Academy information and assistance.";
 const updatesActions=document.createElement("nav");updatesActions.className="vnv-updates-actions";updatesActions.setAttribute("aria-label","Academy assistance");
 const help=document.createElement("a");help.href=A+"#help";help.textContent="Academy Help Desk";
 updatesActions.append(help);updatesBody.append(note,updatesActions);dialog.append(updatesHeader,updatesBody);
 updates.addEventListener("click",()=>{if(!dialog.open)dialog.showModal();close.focus()});
 dialog.addEventListener("close",()=>updates.focus());
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 document.body.append(dock,dialog,mentorDialog,profileDialog);mounted=true;
}
window.VNVEcosystemToolbar=Object.freeze({version:"1.0.7",mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();