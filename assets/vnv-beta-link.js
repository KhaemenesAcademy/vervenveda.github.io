/* Verve N Veda · retired standalone Beta compatibility shim.
   The official replacement is the six-button ecosystem toolbar:
   https://vervenveda.com/assets/vnv-ecosystem-toolbar.js
   This file intentionally constructs no standalone Beta UI. */
(()=>{"use strict";
const OFFICIAL="https://vervenveda.com/assets/vnv-ecosystem-toolbar.js";

function retireLegacy(){
  try{
    for(const id of ["vnvBetaProgramLink","vnvBetaProgramFallback","khaemenesLearnerUtilityToolbar"]){
      document.getElementById(id)?.remove();
    }
    document.getElementById("vnvBetaProgramLinkStyles")?.remove();
    document.getElementById("khaemenesLearnerUtilityToolbarStyles")?.remove();
  }catch{}
}

function ensureOfficial(){
  try{
    retireLegacy();
    if(window.VNVEcosystemToolbar?.mount){
      window.VNVEcosystemToolbar.mount();
      retireLegacy();
      return;
    }
    let script=document.querySelector('script[src="'+OFFICIAL+'"]');
    if(!script){
      script=document.createElement("script");
      script.src=OFFICIAL;
      script.defer=true;
      script.dataset.vnvEcosystemToolbar="1";
      (document.head||document.documentElement).append(script);
    }
    script.addEventListener("load",()=>{
      try{window.VNVEcosystemToolbar?.mount?.()}catch{}
      retireLegacy();
    },{once:true});
  }catch{}
}

function start(){
  retireLegacy();
  ensureOfficial();
  setTimeout(retireLegacy,120);
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();

window.VNVBetaProgram=Object.freeze({
  version:"2.0.0-retired",
  retired:true,
  mount:ensureOfficial,
  href:()=> "https://vervenveda.com/beta/"
});
})();
