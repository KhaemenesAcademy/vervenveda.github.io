/* Khaemenes Sovereign Interlingual — shared offline translation bridge v1
 * No fetch, network APIs, external dependencies, secret access, or student record sync.
 * Imported user-confirmed v2 phrases are origin-local; campus seed is a public draft.
 * "Translation" is an exact phrase lookup, not general machine translation.
 */
(function(root){"use strict";
const LIBRARY_KEY="khaemenes_interlingual_library_v2";
const SEED=root.KhaemenesSovereignSeeds||{phrases:{}};
const DICTIONARY=root.KhaemenesSovereignDictionary||{entries:[],creativeVocabulary:[]};
const dictionaryEntries=Array.isArray(DICTIONARY.entries)?DICTIONARY.entries:[];
const fold=text=>String(text||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase();
function publicEntry(entry){
 // Preschool bilingual theme lists contain translations, not definitions.
 if(entry?.provenance?.path==="assets/dictionary.js")return {...entry,definition:null,editorial:{...entry.editorial,status:"translation-only-no-definition"}};
 return entry;
}
function lookupDefinition(word,{limit=12}={}){
 const wanted=fold(word);if(!wanted)return [];
 return dictionaryEntries.filter(e=>fold(e.term)===wanted).slice(0,Math.min(50,Math.max(1,limit))).map(publicEntry);
}
function searchDictionary(query,{limit=25,domain="",includeCreative=false}={}){
 const q=fold(query);if(!q)return [];
 const max=Math.min(100,Math.max(1,Number(limit)||25));
 const scored=[];
 for(const e of dictionaryEntries){
  if(domain&&e.domain!==domain)continue;
  const term=fold(e.term),definition=fold(e.definition),synonyms=(e.synonyms||[]).map(fold);
  const rank=term===q?0:term.startsWith(q)?1:term.includes(q)?2:synonyms.some(x=>x.includes(q))?3:definition.includes(q)?4:99;
  if(rank<99)scored.push({rank,entry:publicEntry(e)});
 }
 scored.sort((a,b)=>a.rank-b.rank||a.entry.term.localeCompare(b.entry.term));
 const found=scored.slice(0,max).map(x=>x.entry);
 if(includeCreative&&found.length<max){
  const creative=(DICTIONARY.creativeVocabulary||[]).filter(e=>fold(e.term).includes(q)).slice(0,max-found.length);
  found.push(...creative.map(e=>({...e,editorial:{status:"creative-prompt-not-dictionary-definition"}})));
 }
 return found;
}
/* Thesaurus is limited to terms actually cited by existing source records.
 * Explanatory phrases and reverse connections are NOT promoted to strict synonyms. */
function lookupThesaurus(word,{limit=35,includeReverse=true}={}){
 const wanted=fold(word),max=Math.min(75,Math.max(1,Number(limit)||35));
 const links=new Map(),sourceRecords=[];
 if(!wanted)return {headword:word,sourceRecords,related:[],status:"no-term"};
 function add(term,direction,entry){
  const normalized=fold(term);if(!normalized||normalized===wanted)return;
  let item=links.get(normalized);
  if(!item){item={term:String(term).trim(),direct:false,reverse:false,sourceRecords:[]};links.set(normalized,item)}
  item[direction]=true;
  if(!item.sourceRecords.some(ref=>ref.id===entry.id)){
   item.sourceRecords.push({id:entry.id,term:entry.term,partOfSpeech:entry.partOfSpeech,source:entry.provenance});
  }
 }
 for(const e of dictionaryEntries){
  if(fold(e.term)===wanted){
   sourceRecords.push(publicEntry(e));
   for(const synonym of e.synonyms||[])add(synonym,"direct",e);
  }else if(includeReverse){
   for(const synonym of e.synonyms||[])if(fold(synonym)===wanted)add(e.term,"reverse",e);
  }
 }
 const related=[...links.values()].sort((a,b)=>(Number(b.direct)-Number(a.direct))||a.term.localeCompare(b.term)).slice(0,max);
 return {headword:word,sourceRecords,related,status:related.length?"source-linked":"no-source-linked-terms",notice:"Source-listed related expressions, not guaranteed interchangeable synonyms or antonyms."};
}
function thesaurusStats(){
 let withLinks=0,links=0;const unique=new Set();
 for(const entry of dictionaryEntries){
  const terms=entry.synonyms||[];if(terms.length)withLinks++;
  links+=terms.length;
  for(const term of terms)if(fold(term))unique.add(fold(term));
 }
 return {entriesWithRelatedTerms:withLinks,sourceListedLinks:links,distinctRelatedTerms:unique.size,automaticInferences:0,antonymsSupported:false};
}
function dictionaryStats(){
 return {definedEntries:dictionaryEntries.filter(e=>e.provenance?.path!=="assets/dictionary.js").length,translationOnlyEntries:dictionaryEntries.filter(e=>e.provenance?.path==="assets/dictionary.js").length,allRecords:dictionaryEntries.length,creativeVocabulary:(DICTIONARY.creativeVocabulary||[]).length,duplicateForms:(DICTIONARY.duplicateSurfaceForms||[]).length,network:"never"};
}

const legacyCode=code=>String(code||"").trim().toLowerCase()==="zh"?"zh-CN":String(code||"").trim();
const normalize=text=>String(text??"").trim().normalize("NFC");
const bucketKeys=(from,to)=>{
 const f=legacyCode(from),t=legacyCode(to);
 const result=[f+"→"+t];
 if(t==="zh-CN")result.push(f+"→zh");
 if(t==="zh")result.push(f+"→zh-CN");
 return result;
};
function loadUserLibrary(){
 try{
  const value=JSON.parse(root.localStorage.getItem(LIBRARY_KEY)||"null");
  if(value?.schema==="khaemenes-interlingual-library"&&Number(value.version)===2&&value.pairs&&typeof value.pairs==="object"&&!Array.isArray(value.pairs))return value;
 }catch{}
 return null;
}
function lookupLocal({from="en",to="es",text=""}={}){
 const phrase=normalize(text),target=legacyCode(to);
 if(!phrase||phrase.length>12000)return null;
 if(legacyCode(from)===target)return {translation:phrase,verified:true,source:"same-language",status:"identity"};
 const library=loadUserLibrary();
 for(const pk of bucketKeys(from,to)){
  const record=library?.pairs?.[pk]?.[phrase];
  if(record?.verified===true&&typeof record.translation==="string"&&record.translation.trim()){
   return {translation:record.translation,verified:true,source:"sovereign-local-reviewed",status:"user-reviewed"};
  }
 }
 // Reverse bilingual lookups use explicit Preschool translations only.
 // Do not pivot between two non-English languages or guess ambiguous meanings.
 if(legacyCode(from)!=="en"){
  if(target!=="en")return null;
  const language=legacyCode(from)==="zh-CN"?"zh":legacyCode(from);
  const matches=dictionaryEntries.filter(e=>e.provenance?.path==="assets/dictionary.js"&&fold(e.translations?.[language])===fold(phrase));
  if(matches.length===1)return {translation:matches[0].term,verified:false,source:"sovereign-preschool-reverse",status:"source-vocabulary-draft",provenance:matches[0].provenance};
  return null;
 }
 const short=target==="zh-CN"?"zh":target;
 // Bilingual Preschool entries are a small draft vocabulary, not a translation model.
 const word=fold(phrase);
 const translationRecord=dictionaryEntries.find(e=>e.provenance?.path==="assets/dictionary.js"&&fold(e.term)===word&&typeof e.translations?.[short]==="string");
 if(translationRecord){
  return {translation:translationRecord.translations[short],verified:false,source:"sovereign-preschool-dictionary",status:"source-vocabulary-draft",provenance:translationRecord.provenance};
 }
 const record=SEED.phrases?.[short]?.[phrase];
 if(record&&typeof record.text==="string"&&record.text.trim()){
  return {translation:record.text,verified:false,source:"sovereign-campus-draft",status:record.status||"draft"};
 }
 return null;
}
function stats(){
 const count={};let total=0;
 for(const [code,phrases] of Object.entries(SEED.phrases||{})){
  count[code]=Object.keys(phrases).length;total+=count[code];
 }
 let reviewed=0;const lib=loadUserLibrary();
 for(const bucket of Object.values(lib?.pairs||{}))for(const record of Object.values(bucket||{}))if(record?.verified===true)reviewed++;
 return {campusDraftPairs:total,campusLanguages:Object.keys(count).length,reviewedBrowserPairs:reviewed,byLanguage:count,network:"never"};
}
function portablePack(){
 const pairs=Object.create(null);
 for(const [language,phrases] of Object.entries(SEED.phrases||{})){
  const key="en→"+(language==="zh"?"zh-CN":language);
  const bucket=Object.create(null);
  for(const [source,record] of Object.entries(phrases)){
   if(!record?.text)continue;
   bucket[source]={translation:record.text,verified:false,source:"khaemenes-campus-curated-draft",purpose:"interface"};
  }
  pairs[key]=bucket;
 }
 return {schema:"khaemenes-interlingual-library",version:2,updatedAt:new Date().toISOString(),pairs};
}
root.KhaemenesSovereignTranslate=Object.freeze({
 version:"1.1",
 lookupLocal,
 lookupDefinition,
 searchDictionary,
 lookupThesaurus,
 thesaurusStats,
 dictionaryStats,
 stats,
 portablePack,
 languages:()=>Object.keys(SEED.phrases||{}),
 storageKey:LIBRARY_KEY
});
})(window);
