/* Khaemenes Sovereign Interlingual — shared offline translation bridge v1
 * No fetch, network APIs, external dependencies, secret access, or student record sync.
 * Imported user-confirmed v2 phrases are origin-local; campus seed is a public draft.
 * "Translation" is an exact phrase lookup, not general machine translation.
 */
(function(root){"use strict";
const LIBRARY_KEY="khaemenes_interlingual_library_v2";
const SEED=root.KhaemenesSovereignSeeds||{phrases:{}};
const DICTIONARY=root.KhaemenesSovereignDictionary||{entries:[],creativeVocabulary:[]};
const dictionaryEntries=[
 ...(Array.isArray(DICTIONARY.entries)?DICTIONARY.entries:[]),
 ...(Array.isArray(root.KhaemenesLexiconExpansion?.entries)?root.KhaemenesLexiconExpansion.entries:[])
];
const fold=text=>String(text||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase();
function publicEntry(entry){
 // Preschool bilingual theme lists contain translations, not definitions.
 if(entry?.provenance?.path==="assets/dictionary.js")return {...entry,definition:null,editorial:{...entry.editorial,status:"translation-only-no-definition"}};
 return entry;
}
/* Browser-local editorial drafts are separate from the canonical public JSON.
 * Never silently promote learner notes into published definitions or translations. */
const DRAFT_KEY="khaemenes_dictionary_drafts_v1",MAX_DRAFTS=200;
function cleanDraft(record){
 if(!record||typeof record!=="object")return null;
 const trim=(value,max)=>typeof value==="string"?value.trim().slice(0,max):"";
 const term=trim(record.term,95),definition=trim(record.definition,1200);
 if(!term||!definition)return null;
 const related=Array.isArray(record.synonyms)?record.synonyms:typeof record.synonyms==="string"?record.synonyms.split(","):[];
 const synonyms=[...new Set(related.map(x=>trim(x,95)).filter(Boolean))].slice(0,12);
 return {
  id:trim(record.id,100)||"draft-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7),
  language:"en",term,definition,partOfSpeech:trim(record.partOfSpeech,70)||null,
  example:trim(record.example,500)||null,pronunciation:null,etymology:null,
  synonyms,tags:["local-draft"],translations:{},domain:"local-vocabulary",
  provenance:{type:"browser-local-author",sourceStatus:"unreviewed-user-draft"},
  editorial:{status:"local-draft",translationStatus:"not-applicable"}
 };
}
function listLocalEntries({query=""}={}){
 try{
  const input=JSON.parse(root.localStorage.getItem(DRAFT_KEY)||"[]");
  if(!Array.isArray(input))return [];
  const q=fold(query);
  return input.slice(0,MAX_DRAFTS).map(cleanDraft).filter(Boolean).filter(r=>!q||fold(r.term).includes(q)||fold(r.definition).includes(q)||r.synonyms.some(x=>fold(x).includes(q)));
 }catch{return []}
}
function writeLocalEntries(rows){
 try{root.localStorage.setItem(DRAFT_KEY,JSON.stringify(rows));return true}catch{return false}
}
function saveLocalEntry(record){
 const rows=listLocalEntries(),safe=cleanDraft(record);
 if(!safe)return {ok:false,error:"Term and definition are required."};
 if(rows.length>=MAX_DRAFTS)return {ok:false,error:"Local draft limit reached. Export before adding more."};
 safe.id="draft-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9);
 rows.push(safe);
 return writeLocalEntries(rows)?{ok:true,id:safe.id}:{ok:false,error:"Browser storage unavailable; export existing drafts."};
}
function removeLocalEntry(id){
 const rows=listLocalEntries(),next=rows.filter(e=>e.id!==id);
 return next.length!==rows.length&&writeLocalEntries(next);
}
function exportLocalEntries(){
 return {schema:"khaemenes-dictionary-drafts",version:1,exportedAt:new Date().toISOString(),
  editorialNotice:"Unreviewed local drafts, not official definitions or translation authority.",entries:listLocalEntries()};
}
function importLocalEntries(value){
 if(!value||value.schema!=="khaemenes-dictionary-drafts"||value.version!==1||!Array.isArray(value.entries)||value.entries.length>MAX_DRAFTS)return {ok:false,error:"Invalid or oversized dictionary draft pack."};
 const saved=listLocalEntries(),existing=new Set(saved.map(e=>e.id));let added=0;
 for(const entry of value.entries){
  const record=cleanDraft(entry);if(!record)continue;
  if(existing.has(record.id)||saved.length>=MAX_DRAFTS)continue;
  saved.push(record);existing.add(record.id);added++;
 }
 return writeLocalEntries(saved)?{ok:true,added}:{ok:false,error:"Unable to save imported drafts."};
}
function lookupDefinition(word,{limit=12}={}){
 const wanted=fold(word);if(!wanted)return [];
 return [...dictionaryEntries,...listLocalEntries()].filter(e=>fold(e.term)===wanted).slice(0,Math.min(50,Math.max(1,limit))).map(publicEntry);
}
function searchDictionary(query,{limit=25,domain="",includeCreative=false}={}){
 const q=fold(query);if(!q)return [];
 const max=Math.min(100,Math.max(1,Number(limit)||25));
 const scored=[];
 for(const e of [...dictionaryEntries,...listLocalEntries()]){
  if(domain&&e.domain!==domain)continue;
  // Preserve exact-term priority; search examples and grammatical labels only as fallbacks.
  // Source text is never rewritten or treated as an inferred definition.
  const term=fold(e.term),definition=fold(e.definition),synonyms=(e.synonyms||[]).map(fold);
  const example=fold(e.example),partOfSpeech=fold(e.partOfSpeech);
  const tags=Array.isArray(e.tags)?e.tags.map(fold):[];
  const rank=term===q?0:term.startsWith(q)?1:term.includes(q)?2:synonyms.some(x=>x.includes(q))?3:definition.includes(q)?4:example.includes(q)?5:partOfSpeech.includes(q)?6:tags.some(x=>x.includes(q))?7:99;
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
 for(const e of [...dictionaryEntries,...listLocalEntries()]){
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
 return {localDrafts:listLocalEntries().length,definedEntries:dictionaryEntries.filter(e=>e.provenance?.path!=="assets/dictionary.js").length,translationOnlyEntries:dictionaryEntries.filter(e=>e.provenance?.path==="assets/dictionary.js").length,allRecords:dictionaryEntries.length,creativeVocabulary:(DICTIONARY.creativeVocabulary||[]).length,duplicateForms:(DICTIONARY.duplicateSurfaceForms||[]).length,network:"never"};
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
   return {
    translation:record.translation,verified:true,source:"sovereign-local-reviewed",
    status:record.reviewStatus==="self-reviewed"?"user-reviewed":"legacy-review-needs-reconfirmation",
    reviewStatus:record.reviewStatus||"legacy-review-unconfirmed",
    reviewedAt:record.reviewedAt||null,origin:record.origin||null
   };
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
 listLocalEntries,
 saveLocalEntry,
 removeLocalEntry,
 exportLocalEntries,
 importLocalEntries,
 lookupThesaurus,
 thesaurusStats,
 dictionaryStats,
 stats,
 portablePack,
 languages:()=>Object.keys(SEED.phrases||{}),
 storageKey:LIBRARY_KEY
});
})(window);
