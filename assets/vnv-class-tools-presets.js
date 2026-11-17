/* Verve N Veda · Class Tools age/course presets v1.0.0
   Configuration only. Load before vnv-class-tools-toolbar.js when a school needs
   a context other than the canonical High School student-profile default. */
(()=>{"use strict";
const PARENT="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
const SEARCH="https://vervenveda.com/PLERASearch.github.io/";
const makeHelp=(audience)=>({
 title:"How Class Tools Work",
 paragraphs:[
  "<strong>Lessons stay primary.</strong> Use these tools to support the "+audience+" lesson you are working on.",
  "<strong>Choose the right level.</strong> The toolbar reads approved public ecosystem resources instead of sending learners into repository pages.",
  "<strong>Assessments stay protected.</strong> Tools support learning and practice; assessment rules still control what may be used during a quiz or exam."
 ]
});
const elementary=Object.freeze({
 id:"elementary",
 match:()=>/\/Khaemenes_Elementary\.github\.io\/grades\/grade-(01|02|03|04|05)(?:\/|$)/i.test(location.pathname),
 toggleLabel:"Learning Tools",
 ariaLabel:"Elementary learning tools",
 tools:[
  {type:"ecosystem-list",label:"Games",sub:"Practice & play",filter:{category:"games",limit:9}},
  {type:"materials",label:"Materials",sub:"Printables & lessons"},
  {type:"ecosystem-list",label:"Explore",sub:"Learning discoveries",filter:{category:"education",limit:9}},
  {type:"link",label:"Parent Tools",sub:"Family support",href:PARENT},
  {type:"ecosystem-link",label:"Search",sub:"Search ecosystem",ecosystemId:"plera",fallbackHref:SEARCH},
  {type:"help",label:"Instructions",sub:"How to use tools"}
 ],
 materials:{
  title:"Learning Materials",
  intro:"Stay with your current grade lesson first. Use the printable packet, lesson activity, or approved resource that matches what you are learning.",
  links:[]
 },
 help:makeHelp("elementary")
});
const middle=Object.freeze({
 id:"middle-school",
 match:()=>/\/Khaemenes_Middle\.github\.io\/grades\/grade-(06|07|08)(?:\/|$)/i.test(location.pathname),
 toggleLabel:"Class Tools",
 ariaLabel:"Middle school class tools",
 tools:[
  {type:"ecosystem-list",label:"Games",sub:"Practice & strategy",filter:{category:"games",limit:9}},
  {type:"materials",label:"Materials",sub:"Lessons & printables"},
  {type:"ecosystem-list",label:"Research",sub:"Read & verify",filter:{category:"research",limit:9}},
  {type:"link",label:"Parent Tools",sub:"Family support",href:PARENT},
  {type:"ecosystem-link",label:"Search",sub:"Search ecosystem",ecosystemId:"plera",fallbackHref:SEARCH},
  {type:"help",label:"Instructions",sub:"How to use tools"}
 ],
 materials:{
  title:"Learning Materials",
  intro:"Use the current subject or weekly lesson to keep printables, evidence pages, videos, and practice aligned to your class.",
  links:[]
 },
 help:makeHelp("middle-school")
});
const linguistics=Object.freeze({
 id:"linguistics",
 match:()=>/\/Khaemenes_Linguistics\.github\.io\//i.test(location.pathname),
 toggleLabel:"Language Tools",
 ariaLabel:"Language learning tools",
 tools:[
  {type:"ecosystem-list",label:"Practice",sub:"Language activities",filter:{repository:"vervenveda/Khaemenes_Linguistics.github.io",limit:9}},
  {type:"materials",label:"Materials",sub:"Lessons & references"},
  {type:"ecosystem-list",label:"Reference",sub:"Research language",filter:{category:"research",limit:9}},
  {type:"link",label:"Parent Tools",sub:"Family support",href:PARENT},
  {type:"ecosystem-link",label:"Search",sub:"Search ecosystem",ecosystemId:"plera",fallbackHref:SEARCH},
  {type:"help",label:"Instructions",sub:"How to use tools"}
 ],
 materials:{
  title:"Language Materials",
  intro:"Open the active language lesson first so vocabulary, listening, reading, speaking, writing, and printables stay at the correct level.",
  links:[]
 },
 help:makeHelp("language")
});
const highSchool=Object.freeze({
 id:"high-school",
 match:()=>/\/Khaemenes_High\.github\.io\/grades\/grade-(09|10|11|12)\/student-profile\/(?:index\.html)?$/i.test(location.pathname),
 toggleLabel:"Class Tools",
 ariaLabel:"High school class tools",
 tools:[
  {type:"link",label:"Games",sub:"Practice & logic",href:"games/"},
  {type:"materials",label:"Materials",sub:"Videos & printables"},
  {type:"notes",label:"Notes",sub:"Study workspace"},
  {type:"link",label:"Parent Tools",sub:"Family support",href:PARENT},
  {type:"ecosystem-link",label:"Search",sub:"Search ecosystem",ecosystemId:"plera",fallbackHref:SEARCH},
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
 help:makeHelp("high-school")
});
const presets=Object.freeze({elementary,middle,linguistics,highSchool});
window.VNVClassToolsPresets=presets;
window.VNVSelectClassToolsPreset=function(name){
 const chosen=presets[name];
 if(!chosen)throw new Error("Unknown VNV class-tools preset: "+name);
 window.KhaemenesClassToolsConfigV1=chosen;
 return chosen;
};
})();
