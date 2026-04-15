export const defaults=()=>({
  currency:0,totalEarned:0,bagels:0,totalBagels:0,
  streak:0,lastDate:null,
  records:[],owned:[],placed:[],fridge:[],npcs:[],
  shopName:"My Little Bistro",popularity:0,
  achievements:[],tagUsage:{},
  profile:{nickname:"HoneyBagel",avatarUrl:"",avatarBgHex:"#B8F3F9",bio:"",favTags:[]},
});

export const fmtDate=iso=>{const d=new Date(iso);return`${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}-${d.getFullYear()}`;};

export function load(){try{const s=localStorage.getItem("fb_v5");const d=s?{...defaults(),...JSON.parse(s)}:defaults();if(d.achievements.length>0&&typeof d.achievements[0]==="string")d.achievements=d.achievements.map(id=>({id,unlockedAt:new Date().toISOString()}));if(d.profile&&d.profile.avatarEmoji&&!d.profile.avatarUrl){d.profile={...d.profile,avatarUrl:"",avatarBgHex:"#B8F3F9"};}return d;}catch{return defaults();}}

export function save(s){try{localStorage.setItem("fb_v5",JSON.stringify(s));}catch{}}
