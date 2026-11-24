/* Khaemenes shared translator loader v1.0
 * Additive and local-first. Runs after pre-existing page engines without replacing them.
 * Loads missing optional vocabulary resources in dependency order; never sends text.
 */
(function(root){"use strict";
const VERSION="1.1.0";
const script=document.currentScript;
const base=new URL(".",script.src);
const definitions=[
 ["campus","khaemenes-campus-phrases.js",()=>!!root.KhaemenesSovereignSeeds],
 ["dictionary","sovereign-dictionary.generated.js",()=>!!root.KhaemenesSovereignDictionary],
 ["lexicon","khaemenes-lexicon-expansion.js",()=>!!root.KhaemenesLexiconExpansion],
 ["transliteration","khaemenes-transliteration.js",()=>!!root.KhaemenesTransliteration],
 ["core","khaemenes-interlingual-core.js",()=>!!root.KhaemenesSovereignTranslate],
 ["reviewPolicy","khaemenes-review-policy.js",()=>!!root.KhaemenesReviewPolicy]
];
let lastReport=null,active=null;
function loadFile(name){
 return new Promise((resolve,reject)=>{
  const tag=document.createElement("script");
  tag.src=new URL(name,base).href;tag.async=false;
  tag.addEventListener("load",()=>resolve(),{once:true});
  tag.addEventListener("error",()=>reject(Error("Local resource missing: "+name)),{once:true});
  document.head.appendChild(tag);
 });
}
async function ensure({full=false,upgradeLegacyCore=false}={}){
 if(active)return active;
 active=(async()=>{
  const records=[];
  for(const [key,file,ready] of definitions){
   if(!full&&["dictionary","lexicon","transliteration"].includes(key))continue;
   const coreUpgrade=key==="core"&&upgradeLegacyCore&&typeof root.KhaemenesSovereignTranslate?.listLocalEntries!=="function";
   if(coreUpgrade&&full&&records.some(r=>["dictionary","lexicon","transliteration"].includes(r.key)&&!["existing","loaded"].includes(r.state))){records.push({key,state:"skipped-incomplete-resources"});continue}
   if(ready()&&!coreUpgrade){records.push({key,state:"existing"});continue}
   try{await loadFile(file);records.push({key,state:ready()?"loaded":"loaded-no-global"})}
   catch(error){records.push({key,state:"unavailable",reason:error.message})}
  }
  const canonicalCore=typeof root.KhaemenesSovereignTranslate?.listLocalEntries==="function";
  lastReport={version:VERSION,mode:full?"complete":"base",upgradeLegacyCore,canonicalCore,records,externalRequests:0};
  root.dispatchEvent(new CustomEvent("khaemenes:translator-resources",{detail:lastReport}));
  return lastReport;
 })();
 try{return await active}finally{active=null}
}
root.KhaemenesTranslatorLoader=Object.freeze({version:VERSION,ensure,status:()=>lastReport,resources:definitions.map(([key])=>key)});
})(window);
