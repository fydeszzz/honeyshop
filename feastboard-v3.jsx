import { useState, useRef } from "react";

const _fl=document.createElement("link");_fl.rel="stylesheet";
_fl.href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap";
document.head.appendChild(_fl);

/* ── TOKENS ─────────────────────────────────────────────── */
const T={
  aqua:"#3DD8E8",aquaDark:"#1BB8CC",aquaLight:"#B8F3F9",aquaPale:"#D6F6FA",
  pink:"#FF6BAD",pinkDark:"#E0508F",pinkLight:"#FFB3D6",pinkPale:"#FFF0F7",
  purple:"#C084FC",purplePale:"#F5EEFF",
  white:"#FFFFFF",snow:"#F4FBFD",
  textDark:"#2D3B55",textMid:"#7A90AD",textLight:"#B0C4D8",
  gold:"#FFB830",goldLight:"#FFE5A0",
  honey:"#E8935A",
};

/* ── RARITY TABLE ───────────────────────────────────────── */
const RARITY={
  Common:   {border:"#BDBDBD",bg:"linear-gradient(135deg,#F5F5F5,#EEEEEE)",col:"#757575",anim:null},
  Rare:     {border:"#4CAF50",bg:"linear-gradient(135deg,#E8F5E9,#F1F8E9)",col:"#2E7D32",anim:null},
  Epic:     {border:"#FFC107",bg:"linear-gradient(135deg,#FFFDE7,#FFF9C4)",col:"#F57F17",anim:"epicShimmer"},
  Legendary:{border:"#9C27B0",bg:"linear-gradient(135deg,#F3E5F5,#EDE7F6)",col:"#6A1B9A",anim:"legendTrail"},
  Unique:   {border:"#FF6D00",bg:"linear-gradient(135deg,#FFF3E0,#FFE0B2)",col:"#E65100",anim:"uniqueSparkle"},
};

/* ── TAG TABLE ──────────────────────────────────────────── */
const CUISINE_TAGS=[
  {id:"taiwanese",label:"Taiwanese",dineoutonly:0},{id:"japanese",label:"Japanese",dineoutonly:0},
  {id:"korean",label:"Korean",dineoutonly:0},{id:"italian",label:"Italian",dineoutonly:0},
  {id:"american",label:"American",dineoutonly:0},{id:"chinese",label:"Chinese",dineoutonly:0},
  {id:"thai",label:"Thai",dineoutonly:0},{id:"french",label:"French",dineoutonly:0},
  {id:"vegetarian",label:"Vegetarian",dineoutonly:0},{id:"dessert",label:"Dessert",dineoutonly:0},
  {id:"noodles",label:"Noodles",dineoutonly:0},{id:"seafood",label:"Seafood",dineoutonly:0},
  {id:"bbq",label:"BBQ",dineoutonly:0},{id:"hotpot",label:"Hot Pot",dineoutonly:0},
  {id:"healthy",label:"Healthy",dineoutonly:0},{id:"spicy",label:"Spicy",dineoutonly:0},
  {id:"brunch",label:"Brunch",dineoutonly:0},
  // dineout-only
  {id:"ambiance",label:"Ambiance",dineoutonly:1},{id:"date_spot",label:"Date Spot",dineoutonly:1},
  {id:"insta",label:"Instagrammable",dineoutonly:1},{id:"hidden_gem",label:"Hidden Gem",dineoutonly:1},
  {id:"fast_casual",label:"Fast Casual",dineoutonly:1},{id:"fine_dining",label:"Fine Dining",dineoutonly:1},
  {id:"takeout",label:"Takeout",dineoutonly:1},{id:"rooftop",label:"Rooftop",dineoutonly:1},
];

/* ── STORE + GACHA TABLE (merged) ──────────────────────── */
const STORE_ITEMS=[
  {id:"sign_wood", list_category:"Signs",  name:"Wooden Sign",  price:80,  item_qty:99,rarity:"Common",   emoji:"🪵",item_col:"#C4895A",gacha_only:false},
  {id:"table_b",   list_category:"Seating",name:"Wooden Table", price:120, item_qty:99,rarity:"Common",   emoji:"🪑",item_col:"#C4895A",gacha_only:false},
  {id:"plant_s",   list_category:"Decor",  name:"Mini Plant",   price:60,  item_qty:99,rarity:"Common",   emoji:"🌱",item_col:"#4DC87A",gacha_only:false},
  {id:"lamp_b",    list_category:"Lights", name:"Pendant Lamp", price:100, item_qty:99,rarity:"Common",   emoji:"🔆",item_col:"#FFB830",gacha_only:false},
  {id:"art_ramen", list_category:"Art",    name:"Ramen Mural",  price:200, item_qty:99,rarity:"Common",   emoji:"🖼️",item_col:"#FF8C5A",gacha_only:false},
  {id:"lucky_cat", list_category:"Props",  name:"Lucky Cat",    price:180, item_qty:99,rarity:"Common",   emoji:"🐱",item_col:"#FFB830",gacha_only:false},
  {id:"plant_b",   list_category:"Decor",  name:"Banyan Tree",  price:350, item_qty:99,rarity:"Rare",     emoji:"🌳",item_col:"#2DA856",gacha_only:false},
  {id:"lamp_f",    list_category:"Lights", name:"Crystal Lamp", price:500, item_qty:99,rarity:"Rare",     emoji:"🔮",item_col:"#C084FC",gacha_only:false},
  {id:"art_sushi", list_category:"Art",    name:"Sushi Mural",  price:300, item_qty:99,rarity:"Rare",     emoji:"🎨",item_col:"#3DD8E8",gacha_only:false},
  // gacha-only (bagels)
  {id:"sign_neon", list_category:"Signs",  name:"Neon Sign",    bagels:3,  item_qty:1, rarity:"Rare",     emoji:"💡",item_col:"#FF6BAD",gacha_only:true},
  {id:"fairy_lgt", list_category:"Lights", name:"Fairy Lights", bagels:5,  item_qty:1, rarity:"Rare",     emoji:"🌟",item_col:"#FFC0CB",gacha_only:true},
  {id:"trophy",    list_category:"Props",  name:"Chef Trophy",  bagels:6,  item_qty:1, rarity:"Epic",     emoji:"🏆",item_col:"#FFD700",gacha_only:true},
  {id:"fountain",  list_category:"Props",  name:"Mini Fountain",bagels:10, item_qty:1, rarity:"Epic",     emoji:"⛲", item_col:"#3DD8E8",gacha_only:true},
  {id:"sakura",    list_category:"Decor",  name:"Sakura Tree",  bagels:12, item_qty:1, rarity:"Legendary",emoji:"🌸",item_col:"#FFB7C5",gacha_only:true},
  {id:"gold_tbl",  list_category:"Seating",name:"Gold Table",   bagels:15, item_qty:1, rarity:"Legendary",emoji:"✨",item_col:"#FFD700",gacha_only:true},
  {id:"rainbow",   list_category:"Decor",  name:"Rainbow Arch", bagels:20, item_qty:1, rarity:"Unique",   emoji:"🌈",item_col:"#FF6B6B",gacha_only:true},
];

/* ── INGREDIENT TABLE (mock) ────────────────────────────── */
const INGREDIENTS=[
  {id:"chicken",name:"Chicken Breast",emoji:"🍗",unit:"piece",food_type:"protein"},
  {id:"egg",    name:"Egg",           emoji:"🥚",unit:"piece",food_type:"protein"},
  {id:"beef",   name:"Beef",          emoji:"🥩",unit:"g",    food_type:"protein"},
  {id:"salmon", name:"Salmon",        emoji:"🐟",unit:"g",    food_type:"seafood"},
  {id:"rice",   name:"Rice",          emoji:"🍚",unit:"g",    food_type:"staple"},
  {id:"pasta",  name:"Pasta",         emoji:"🍝",unit:"g",    food_type:"staple"},
  {id:"garlic", name:"Garlic",        emoji:"🧄",unit:"clove",food_type:"veggie"},
  {id:"onion",  name:"Onion",         emoji:"🧅",unit:"piece",food_type:"veggie"},
  {id:"tomato", name:"Tomato",        emoji:"🍅",unit:"piece",food_type:"veggie"},
  {id:"spinach",name:"Spinach",       emoji:"🥬",unit:"g",    food_type:"veggie"},
  {id:"butter", name:"Butter",        emoji:"🧈",unit:"g",    food_type:"dairy"},
  {id:"milk",   name:"Milk",          emoji:"🥛",unit:"ml",   food_type:"dairy"},
  {id:"cheese", name:"Cheese",        emoji:"🧀",unit:"g",    food_type:"dairy"},
  {id:"flour",  name:"Flour",         emoji:"🌾",unit:"g",    food_type:"staple"},
];

/* ── ACHIEVEMENTS TABLE ─────────────────────────────────── */
const ACHIEVEMENTS=[
  {id:"first_cook",icon:"🍳",name:"First Dish",     desc:"Log your first home-cooked meal",  cond:s=>s.records.filter(r=>r.type==="cook").length>=1},
  {id:"first_dine",icon:"🍽️",name:"First Outing",  desc:"Log your first dining experience",  cond:s=>s.records.filter(r=>r.type==="dine").length>=1},
  {id:"cook_5",    icon:"👨‍🍳",name:"Home Chef",    desc:"Cook 5 homemade dishes",            cond:s=>s.records.filter(r=>r.type==="cook").length>=5},
  {id:"cook_10",   icon:"🌟",name:"Kitchen Star",   desc:"Cook 10 homemade dishes",           cond:s=>s.records.filter(r=>r.type==="cook").length>=10},
  {id:"dine_5",    icon:"🗺️",name:"Food Explorer", desc:"Log 5 dining experiences",          cond:s=>s.records.filter(r=>r.type==="dine").length>=5},
  {id:"earn_500",  icon:"💰",name:"Honey Hoarder",  desc:"Accumulate 500 🍯",                 cond:s=>s.totalEarned>=500},
  {id:"shop_1",    icon:"🛋️",name:"First Decor",   desc:"Own your first decoration",         cond:s=>s.owned.length>=1},
  {id:"shop_5",    icon:"🏠",name:"Cozy Shop",      desc:"Own 5 decorations",                 cond:s=>s.owned.length>=5},
  {id:"streak_3",  icon:"🔥",name:"On a Roll",      desc:"Log food 3 days in a row",         cond:s=>s.streak>=3},
  {id:"streak_7",  icon:"🗓️",name:"Week Warrior",  desc:"Log food 7 days in a row",         cond:s=>s.streak>=7},
  {id:"log_10",    icon:"📔",name:"Getting Serious",desc:"Log 10 entries total",             cond:s=>s.records.length>=10},
  {id:"rare_1",    icon:"💎",name:"Rare Collector", desc:"Pull a Rare or higher item",       cond:s=>s.owned.some(id=>{const r=STORE_ITEMS.find(i=>i.id===id)?.rarity;return["Rare","Epic","Legendary","Unique"].includes(r);})},
  {id:"fridge_5",  icon:"🧊",name:"Stocked Up",     desc:"Add 5 ingredients to fridge",      cond:s=>s.fridge.length>=5},
  {id:"first_bagel",icon:"🥯",name:"Bagel Baker",   desc:"Earn your first Bagel token",      cond:s=>s.totalBagels>=1},
  {id:"npc_1",     icon:"👥",name:"Not Alone",      desc:"Add your first NPC character",     cond:s=>s.npcs.length>=1},
];

const MEAL_FILTERS=[
  {id:"all",label:"All"},{id:"cook",label:"🍳 Home"},{id:"dine",label:"🍽️ Dining"},
  {id:"Breakfast",label:"☀️ Breakfast"},{id:"Lunch",label:"🌤️ Lunch"},
  {id:"Dinner",label:"🌙 Dinner"},{id:"Late Night",label:"🌃 Late Night"},
  {id:"Afternoon Tea",label:"☕ Tea"},
];
const MEAL_TIMES=["Breakfast","Lunch","Dinner","Late Night","Afternoon Tea"];
const FOOD_EMOJIS=["🍳","🍜","🍣","🍕","🥗","🍱","🥩","🍰","🍗","🥘","🍛","🥚","🍝","🦐","🍤","🥞","🫕","🥐"];
const mealIcon={Breakfast:"☀️",Lunch:"🌤️",Dinner:"🌙","Late Night":"🌃","Afternoon Tea":"☕"};
const NPC_AVATARS=["👦","👧","🧑","👱","🧔","🧓","👴","👵","🧙","🧚","🧜","🦸","🧑‍🍳","🧑‍🎨","🤖","👻","🐱","🐶","🐰","🦊","🐻","🐼","🦁","🐸"];
const NPC_LINES=["This smells amazing!","Table for two?","I'll have the usual!","Best spot in town!","Is the special ready?","Cozy place!","Can I see the menu?","The food here is 💯","When does kitchen open?","Love this restaurant!"];
const MOCK_ADDR=["台北市信義區松壽路12號","台北市大安區忠孝東路四段181號","台北市中山區南京東路二段15號","新北市板橋區文化路一段25號","台中市西屯區台灣大道三段99號","高雄市前鎮區中山二路123號","123 Main St, San Francisco, CA","456 Melrose Ave, Los Angeles, CA","789 5th Ave, New York, NY","321 Michigan Ave, Chicago, IL"];

/* ── STATE ──────────────────────────────────────────────── */
const defaults=()=>({
  currency:0,totalEarned:0,bagels:0,totalBagels:0,
  streak:0,lastDate:null,
  records:[],owned:[],placed:[],fridge:[],npcs:[],
  shopName:"My Little Bistro",popularity:0,
  achievements:[],tagUsage:{},
  profile:{nickname:"HoneyBagel",avatarEmoji:"👨‍🍳",bio:"",favTags:[]},
});
const fmtDate=iso=>{const d=new Date(iso);return`${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}-${d.getFullYear()}`;};
function load(){try{const s=localStorage.getItem("fb_v5");const d=s?{...defaults(),...JSON.parse(s)}:defaults();if(d.achievements.length>0&&typeof d.achievements[0]==="string")d.achievements=d.achievements.map(id=>({id,unlockedAt:new Date().toISOString()}));return d;}catch{return defaults();}}
function save(s){try{localStorage.setItem("fb_v5",JSON.stringify(s));}catch{}}

/* ══════════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════════ */
export default function App(){
  const [S,setS_raw]=useState(load);
  const [tab,setTab]=useState("journal");
  const [modal,setModal]=useState(null);
  const [toast,setToast]=useState(null);
  const [selRec,setSelRec]=useState(null);
  const [gachaRes,setGachaRes]=useState(null);
  const [gachaAnim,setGachaAnim]=useState(false);
  const [showProfile,setShowProfile]=useState(false);

  const setS=upd=>{
    setS_raw(prev=>{
      const next=typeof upd==="function"?upd(prev):upd;
      const newAchs=ACHIEVEMENTS.filter(a=>!next.achievements.some(x=>x.id===a.id)&&a.cond(next)).map(a=>({id:a.id,unlockedAt:new Date().toISOString()}));
      const final=newAchs.length?{...next,achievements:[...next.achievements,...newAchs]}:next;
      save(final);
      if(newAchs.length){const a=ACHIEVEMENTS.find(x=>x.id===newAchs[0].id);setTimeout(()=>showToast(`🏅 Achievement: ${a.name}!`,"gold"),700);}
      return final;
    });
  };
  const showToast=(msg,type="green")=>{setToast({msg,type});setTimeout(()=>setToast(null),2600);};

  const addRecord=rec=>{
    const earned=rec.type==="cook"?80:50;
    const newCount=S.records.length+1;
    const bagelBonus=newCount%5===0?1:0;
    const today=new Date().toDateString();
    // update tag usage
    const newTagUsage={...S.tagUsage};
    rec.tags?.forEach(t=>{newTagUsage[t]=(newTagUsage[t]||0)+1;});
    setS(prev=>{
      const consec=prev.lastDate===new Date(Date.now()-86400000).toDateString();
      const newStreak=prev.lastDate===today?prev.streak:consec?prev.streak+1:1;
      return{...prev,
        records:[{...rec,id:Date.now(),earned,date:new Date().toISOString()},...prev.records],
        currency:prev.currency+earned,totalEarned:prev.totalEarned+earned,
        bagels:prev.bagels+bagelBonus,totalBagels:prev.totalBagels+bagelBonus,
        popularity:prev.popularity+(rec.type==="cook"?15:8),
        streak:newStreak,lastDate:today,tagUsage:newTagUsage,
      };
    });
    showToast(bagelBonus?`+${earned} 🍯  +1 🥯 bonus!`:`+${earned} 🍯 saved!`);
    setModal(null);
  };

  const buyItem=item=>{
    if(S.currency<item.price){showToast("Not enough Honeypot! 🍯","red");return;}
    if(S.owned.includes(item.id)){showToast("Already owned!","red");return;}
    setS(prev=>({...prev,currency:prev.currency-item.price,owned:[...prev.owned,item.id]}));
    showToast(`🛍️ ${item.name} purchased!`,"gold");
  };

  const doGacha=()=>{
    if(S.bagels<GACHA_BAGEL_PRICE){showToast("Not enough Bagels 🥯","red");return;}
    setGachaAnim(true);setGachaRes(null);
    setTimeout(()=>{
      const r=Math.random();
      const gPool=STORE_ITEMS.filter(i=>i.gacha_only);
      const pool=r<0.05?gPool.filter(i=>i.rarity==="Unique"||i.rarity==="Legendary"):r<0.25?gPool.filter(i=>i.rarity==="Legendary"||i.rarity==="Epic"):r<0.6?gPool.filter(i=>i.rarity==="Epic"||i.rarity==="Rare"):gPool.filter(i=>i.rarity==="Rare");
      const safe=pool.length?pool:gPool;
      const item=safe[Math.floor(Math.random()*safe.length)];
      setGachaRes(item);
      setS(prev=>({...prev,bagels:prev.bagels-GACHA_BAGEL_PRICE,owned:prev.owned.includes(item.id)?prev.owned:[...prev.owned,item.id]}));
      setGachaAnim(false);
    },1300);
  };

  const togglePlace=id=>setS(prev=>({...prev,placed:prev.placed.includes(id)?prev.placed.filter(x=>x!==id):[...prev.placed,id]}));
  const shopLv=Math.floor(S.popularity/100)+1;
  const lvLabels=["Apprentice Cook","Rising Chef","Local Favorite","Neighborhood Gem","Popular Spot","Food Icon","Legendary Eatery"];
  const shopLvLabel=lvLabels[Math.min(shopLv-1,6)];

  return(
    <div style={{fontFamily:"'Nunito',sans-serif",background:`linear-gradient(160deg,${T.aquaPale} 0%,${T.white} 50%,${T.pinkPale} 100%)`,minHeight:"852px",maxWidth:393,margin:"0 auto",position:"relative"}}>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{width:0;}
        input,textarea,select{font-family:'Nunito',sans-serif;background:${T.snow};border:2px solid ${T.aquaLight};border-radius:14px;padding:10px 14px;color:${T.textDark};font-size:14px;outline:none;width:100%;transition:border-color .2s;}
        input:focus,textarea:focus,select:focus{border-color:${T.aqua};}
        button{cursor:pointer;font-family:'Nunito',sans-serif;}
        @keyframes floatUp{0%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(-44px)}}
        @keyframes popIn{0%{transform:scale(.4);opacity:0}65%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes sparkle{0%,100%{opacity:.22;transform:scale(.8)}50%{opacity:.8;transform:scale(1.2)}}
        @keyframes drift{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes npcWalk{0%{left:5%;transform:scaleX(1)}48%{left:78%;transform:scaleX(1)}50%{left:78%;transform:scaleX(-1)}98%{left:5%;transform:scaleX(-1)}100%{left:5%;transform:scaleX(1)}}
        @keyframes epicShimmer{0%,100%{box-shadow:0 0 8px 2px rgba(255,193,7,.35),inset 0 0 6px rgba(255,193,7,.1)}50%{box-shadow:0 0 22px 5px rgba(255,193,7,.7),inset 0 0 14px rgba(255,193,7,.25)}}
        @keyframes legendTrail{0%,100%{box-shadow:0 0 8px 2px rgba(156,39,176,.3),4px 4px 0 rgba(156,39,176,.12),8px 8px 0 rgba(156,39,176,.06)}50%{box-shadow:0 0 26px 6px rgba(156,39,176,.65),4px 4px 0 rgba(156,39,176,.28),10px 10px 0 rgba(156,39,176,.14)}}
        @keyframes uniqueSparkle{0%,100%{box-shadow:0 0 6px 2px rgba(255,109,0,.4),-4px -4px 8px rgba(255,109,0,.2),4px 4px 8px rgba(255,109,0,.2)}33%{box-shadow:5px -5px 14px 3px rgba(255,109,0,.65),-5px 5px 10px rgba(255,109,0,.35),0 0 4px rgba(255,109,0,.2)}66%{box-shadow:-5px -5px 14px 3px rgba(255,109,0,.65),5px 5px 10px rgba(255,109,0,.35),0 0 4px rgba(255,109,0,.2)}}
        .rarity-Epic{animation:epicShimmer 2s ease-in-out infinite;}
        .rarity-Legendary{animation:legendTrail 2s ease-in-out infinite;}
        .rarity-Unique{animation:uniqueSparkle 1.4s ease-in-out infinite;}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        {[[8,12,1.1,0],[85,8,.7,.6],[70,38,.9,1.2],[15,55,.6,.3],[90,62,1,.9],[40,72,.5,1.5]].map(([l,t,sc,d],i)=>(
          <div key={i} style={{position:"absolute",left:`${l}%`,top:`${t}%`,fontSize:14*sc,animation:`sparkle 2.8s ${d}s ease-in-out infinite`,color:i%2===0?T.aqua:T.pink,opacity:.28}}>✦</div>
        ))}
      </div>

      {toast&&<div style={{position:"fixed",top:76,left:"50%",transform:"translateX(-50%)",background:toast.type==="gold"?`linear-gradient(135deg,${T.gold},#FF9B30)`:toast.type==="red"?"#FF6B8A":`linear-gradient(135deg,${T.aqua},${T.aquaDark})`,color:"#fff",padding:"10px 22px",borderRadius:28,fontWeight:800,fontSize:13,zIndex:9999,animation:"floatUp 2.5s forwards",whiteSpace:"nowrap",boxShadow:`0 6px 24px rgba(61,216,232,.3)`}}>{toast.msg}</div>}

      {/* HEADER */}
      <div style={{position:"sticky",top:0,zIndex:100,padding:"7px 13px 6px",background:"rgba(255,255,255,.85)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.aquaLight}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setShowProfile(true)} style={{width:33,height:33,borderRadius:"50%",background:`linear-gradient(135deg,${T.aquaLight},${T.pinkLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,border:`2px solid ${T.white}`,boxShadow:`0 2px 8px ${T.aquaLight}`,flexShrink:0}}>
            {S.profile.avatarEmoji}
          </button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:900,fontSize:13,color:T.textDark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.1}}>{S.profile.nickname}</div>
            <div style={{fontSize:9,color:T.textMid,fontWeight:700}}>Lv.{shopLv} · {shopLvLabel}</div>
          </div>
          <div style={{flex:1.3,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:8,color:T.textLight,fontWeight:800}}>XP</span>
              <span style={{fontSize:8,color:T.textLight,fontWeight:800}}>{S.popularity%100}/100</span>
            </div>
            <div style={{background:T.aquaPale,borderRadius:6,height:6,overflow:"hidden"}}>
              <div style={{width:`${S.popularity%100}%`,background:`linear-gradient(90deg,${T.aqua},${T.pink})`,height:"100%",transition:"width .5s"}}/>
            </div>
          </div>
          <div style={{background:`linear-gradient(135deg,${T.goldLight},#FFD060)`,borderRadius:18,padding:"4px 9px",display:"flex",alignItems:"center",gap:3,boxShadow:"0 2px 6px rgba(255,184,48,.28)",flexShrink:0}}>
            <span style={{fontSize:11}}>🍯</span><span style={{fontWeight:900,fontSize:12,color:"#A06000"}}>{S.currency}</span>
          </div>
          <div style={{background:"linear-gradient(135deg,#FFE8D0,#FFCFA0)",borderRadius:18,padding:"4px 9px",display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
            <span style={{fontSize:11}}>🥯</span><span style={{fontWeight:900,fontSize:12,color:"#904000"}}>{S.bagels}</span>
          </div>
          {S.streak>0&&<div style={{background:"linear-gradient(135deg,#FFE8D0,#FFD0A0)",borderRadius:13,padding:"3px 7px",display:"flex",alignItems:"center",gap:2,flexShrink:0}}>
            <span style={{fontSize:10}}>🔥</span><span style={{fontSize:10,fontWeight:900,color:"#C05000"}}>{S.streak}</span>
          </div>}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{paddingBottom:72,position:"relative",zIndex:1}}>
        {tab==="journal"    && <JournalTab    S={S} onAdd={()=>setModal("add")} onSel={r=>{setSelRec(r);setModal("record");}}/>}
        {tab==="fridge"     && <FridgeTab     S={S} setS={setS} showToast={showToast}/>}
        {tab==="shop"       && <ShopTab       S={S} onToggle={togglePlace} shopLv={shopLv} shopLvLabel={shopLvLabel} setS={setS} showToast={showToast}/>}
        {tab==="store"      && <StoreTab      S={S} onGacha={()=>{setGachaRes(null);setModal("gacha");}} onBuy={buyItem}/>}
        {tab==="collection" && <CollectionTab S={S}/>}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:393,background:"rgba(255,255,255,.93)",backdropFilter:"blur(20px)",borderTop:`1px solid ${T.aquaLight}`,display:"flex",justifyContent:"space-around",alignItems:"center",padding:"9px 0 15px",zIndex:100}}>
        {[{id:"journal",icon:"📓"},{id:"fridge",icon:"🧊"},{id:"shop",icon:"🏪"},{id:"store",icon:"🛒"},{id:"collection",icon:"🏆"}].map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} style={{background:tab===n.id?T.aquaPale:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:56,height:46,borderRadius:18,transition:"all .18s",boxShadow:tab===n.id?`0 2px 12px rgba(61,216,232,.32)`:"none"}}>
            <span style={{fontSize:23,filter:tab===n.id?"none":"grayscale(.4)",opacity:tab===n.id?1:.38}}>{n.icon}</span>
            {tab===n.id&&<div style={{width:5,height:5,borderRadius:"50%",background:`linear-gradient(135deg,${T.aqua},${T.pink})`,marginTop:2}}/>}
          </button>
        ))}
      </div>

      {modal==="add"    && <AddModal    S={S} onClose={()=>setModal(null)} onSubmit={addRecord}/>}
      {modal==="gacha"  && <GachaModal  S={S} onClose={()=>setModal(null)} onGacha={doGacha} result={gachaRes} anim={gachaAnim} setResult={setGachaRes}/>}
      {modal==="record" && selRec && <RecordModal record={selRec} onClose={()=>setModal(null)}/>}
      {showProfile && <ProfileModal S={S} setS={setS} onClose={()=>setShowProfile(false)} showToast={showToast}/>}
    </div>
  );
}

/* ── JOURNAL ─────────────────────────────────────────────── */
function JournalTab({S,onAdd,onSel}){
  const [filter,setFilter]=useState("all");
  const recs=S.records.filter(r=>filter==="all"||r.type===filter||r.mealTime===filter);
  return(
    <div style={{animation:"fadeSlide .3s ease"}}>
      <div style={{display:"flex",gap:7,padding:"12px 14px 9px",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        {MEAL_FILTERS.map(({id,label})=>(
          <button key={id} onClick={()=>setFilter(id)} style={{background:filter===id?`linear-gradient(135deg,${T.pink},${T.purple})`:T.white,border:filter===id?"none":`2px solid ${T.aquaLight}`,borderRadius:20,padding:"6px 14px",whiteSpace:"nowrap",color:filter===id?T.white:T.textMid,fontSize:12,fontWeight:700,boxShadow:filter===id?`0 4px 12px ${T.pinkLight}`:"none",flexShrink:0,transition:"all .18s"}}>{label}</button>
        ))}
      </div>
      {recs.length===0?<EmptyJournal onAdd={onAdd}/>:(
        <div style={{padding:"0 14px"}}>{recs.map(r=><RecordCard key={r.id} record={r} onClick={()=>onSel(r)}/>)}</div>
      )}
    </div>
  );
}
function EmptyJournal({onAdd}){
  return(
    <div style={{padding:"28px 22px",textAlign:"center",animation:"fadeSlide .4s ease"}}>
      <div style={{animation:"drift 3s ease-in-out infinite",fontSize:66,marginBottom:10}}>🍽️</div>
      <div style={{fontWeight:900,fontSize:21,color:T.textDark,marginBottom:8}}>Your journal is empty!</div>
      <div style={{color:T.textMid,fontSize:14,fontWeight:600,lineHeight:1.65,marginBottom:18}}>Log your first dish or dining experience<br/>and start your food adventure ✦</div>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`linear-gradient(135deg,${T.goldLight},#FFE880)`,borderRadius:22,padding:"8px 20px",marginBottom:20,boxShadow:"0 4px 14px rgba(255,184,48,.22)"}}>
        <span>🍯</span><span style={{fontWeight:800,fontSize:13,color:"#A06000"}}>New entry earns +50 Honeypot</span>
      </div><br/>
      <button onClick={onAdd} style={{background:`linear-gradient(135deg,${T.pink},${T.purple})`,border:"none",borderRadius:24,padding:"13px 34px",color:T.white,fontSize:15,fontWeight:900,boxShadow:`0 6px 22px ${T.pinkLight}`}}>✏️  Add First Entry</button>
      <div style={{color:T.textLight,fontSize:12,fontWeight:600,marginTop:13}}>✦ Log 5 entries to earn a Bagel 🥯 ✦</div>
    </div>
  );
}
function RecordCard({record,onClick}){
  const isCook=record.type==="cook";
  return(
    <div onClick={onClick} style={{background:T.white,border:`2px solid ${isCook?T.aquaLight:T.pinkLight}`,borderRadius:20,padding:"13px 15px",marginBottom:10,cursor:"pointer",boxShadow:`0 3px 14px ${isCook?"rgba(61,216,232,.08)":"rgba(255,107,173,.08)"}`,transition:"transform .12s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:5}}>
            <span style={{background:isCook?`${T.aqua}22`:`${T.pink}22`,border:`1px solid ${isCook?T.aquaLight:T.pinkLight}`,borderRadius:10,padding:"2px 8px",color:isCook?T.aquaDark:T.pinkDark,fontSize:11,fontWeight:700}}>{isCook?"🍳 Home":"🍽️ Dining"}</span>
            <span style={{color:T.textLight,fontSize:11,fontWeight:600}}>{mealIcon[record.mealTime]} {record.mealTime}</span>
          </div>
          <div style={{fontWeight:800,fontSize:15,color:T.textDark,marginBottom:3}}>{record.title}</div>
          {record.address&&<div style={{color:T.textMid,fontSize:12,fontWeight:600,marginBottom:2}}>📍 {record.address}</div>}
          {record.rating>0&&<div style={{color:T.gold,fontSize:13}}>{"★".repeat(record.rating)}{"☆".repeat(5-record.rating)}</div>}
          {record.photos?.length>0&&<div style={{display:"flex",gap:4,marginTop:6}}>{record.photos.slice(0,3).map((p,i)=><div key={i} style={{width:44,height:44,borderRadius:10,background:`linear-gradient(135deg,${T.aquaPale},${T.pinkPale})`,border:`1px solid ${T.aquaLight}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,overflow:"hidden"}}>{p.preview?<img src={p.preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:"📷"}</div>)}{record.photos.length>3&&<div style={{width:44,height:44,borderRadius:10,background:T.aquaPale,border:`1px solid ${T.aquaLight}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:T.aquaDark}}>+{record.photos.length-3}</div>}</div>}
          {record.tags?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>{record.tags.slice(0,4).map(t=><span key={t} style={{background:T.snow,border:`1px solid ${T.aquaLight}`,borderRadius:8,padding:"2px 6px",color:T.textMid,fontSize:10,fontWeight:600}}>#{t}</span>)}</div>}
        </div>
        <div style={{textAlign:"center",marginLeft:10,minWidth:48,flexShrink:0}}>
          <div style={{fontSize:32,marginBottom:3}}>{record.emoji||"🍽️"}</div>
          <div style={{background:`linear-gradient(135deg,${T.goldLight},#FFE060)`,borderRadius:10,padding:"2px 6px",fontWeight:800,fontSize:11,color:"#A06000"}}>+{record.earned}🍯</div>
        </div>
      </div>
    </div>
  );
}

/* ── FRIDGE ──────────────────────────────────────────────── */
const FRIDGE_EMOJIS=["🥩","🥚","🥦","🧅","🧄","🥕","🍅","🫚","🥛","🧀","🐟","🍗","🥬","🌽","🍋","🫙","🧈","🥜","🌾","🍄"];
function FridgeTab({S,setS,showToast}){
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState({name:"",emoji:"🥩",qty:1,expiry:""});
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));
  const addIng=()=>{if(!form.name.trim())return;setS(prev=>({...prev,fridge:[...prev.fridge,{id:Date.now(),...form}]}));showToast(`${form.emoji} ${form.name} added!`);setAdding(false);setForm({name:"",emoji:"🥩",qty:1,expiry:""});};
  const removeIng=id=>setS(prev=>({...prev,fridge:prev.fridge.filter(i=>i.id!==id)}));
  const chgQty=(id,d)=>setS(prev=>({...prev,fridge:prev.fridge.map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+d)}:i).filter(i=>i.qty>0)}));
  const today=new Date();
  const expiringSoon=S.fridge.filter(i=>i.expiry&&(new Date(i.expiry)-today)/(1000*60*60*24)<=3);
  return(
    <div style={{padding:"13px 14px",animation:"fadeSlide .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div><div style={{fontWeight:900,fontSize:17,color:T.textDark}}>My Fridge 🧊</div><div style={{fontSize:12,color:T.textMid,fontWeight:600}}>{S.fridge.length} items stored</div></div>
        <button onClick={()=>setAdding(!adding)} style={{background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:18,padding:"8px 16px",color:T.white,fontSize:13,fontWeight:800,boxShadow:`0 4px 14px ${T.aquaLight}`}}>{adding?"Cancel":"+ Add"}</button>
      </div>
      {expiringSoon.length>0&&<div style={{background:"linear-gradient(135deg,#FFF8E0,#FFF0C0)",border:"2px solid #FFD060",borderRadius:16,padding:"10px 14px",marginBottom:12,display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:18}}>⚠️</span><div><div style={{fontWeight:800,color:"#A06000",fontSize:13}}>Expiring soon!</div><div style={{color:"#C08000",fontSize:12,fontWeight:600}}>{expiringSoon.map(i=>i.emoji+i.name).join(" · ")}</div></div></div>}
      {adding&&<div style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:20,padding:"14px",marginBottom:12}}>
        <div style={{fontWeight:800,color:T.aquaDark,fontSize:12,marginBottom:6}}>Pick emoji</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>{FRIDGE_EMOJIS.map(e=><button key={e} onClick={()=>setF("emoji",e)} style={{fontSize:20,background:form.emoji===e?T.aquaPale:T.snow,border:`2px solid ${form.emoji===e?T.aqua:T.aquaLight}`,borderRadius:10,padding:"4px 5px"}}>{e}</button>)}</div>
        <div style={{fontWeight:800,color:T.aquaDark,fontSize:12,marginBottom:5}}>Name *</div>
        <input value={form.name} onChange={e=>setF("name",e.target.value)} placeholder="e.g. Chicken breast" style={{marginBottom:10}}/>
        <div style={{display:"flex",gap:10,marginBottom:10}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,color:T.aquaDark,fontSize:12,marginBottom:5}}>Qty</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><button onClick={()=>setF("qty",Math.max(1,form.qty-1))} style={{background:T.aquaPale,border:`2px solid ${T.aquaLight}`,borderRadius:10,width:32,height:32,color:T.aquaDark,fontSize:18,fontWeight:900}}>−</button><span style={{fontWeight:900,fontSize:16,color:T.textDark,minWidth:24,textAlign:"center"}}>{form.qty}</span><button onClick={()=>setF("qty",form.qty+1)} style={{background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:10,width:32,height:32,color:T.white,fontSize:18,fontWeight:900}}>+</button></div>
          </div>
          <div style={{flex:1.4}}><div style={{fontWeight:800,color:T.aquaDark,fontSize:12,marginBottom:5}}>Best Before</div><input type="date" value={form.expiry} onChange={e=>setF("expiry",e.target.value)}/></div>
        </div>
        <button onClick={addIng} style={{width:"100%",background:form.name.trim()?`linear-gradient(135deg,${T.pink},${T.purple})`:T.snow,border:"none",borderRadius:16,padding:"11px",color:form.name.trim()?T.white:T.textLight,fontSize:14,fontWeight:900}}>✅ Add to Fridge</button>
      </div>}
      {S.fridge.length===0&&!adding?<div style={{textAlign:"center",padding:"36px 0"}}><div style={{fontSize:64,marginBottom:10,animation:"drift 3s ease-in-out infinite"}}>🧊</div><div style={{fontWeight:800,color:T.textDark,fontSize:16,marginBottom:6}}>Your fridge is empty</div><div style={{color:T.textMid,fontSize:13,fontWeight:600}}>Track stock & get expiry reminders!</div></div>:(
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {S.fridge.map(item=>{const exp=item.expiry&&(new Date(item.expiry)-today)/(1000*60*60*24)<=3;return(
          <div key={item.id} style={{background:T.white,border:`2px solid ${exp?"#FFD060":T.aquaLight}`,borderRadius:16,padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:28}}>{item.emoji}</span>
            <div style={{flex:1}}><div style={{fontWeight:800,fontSize:14,color:T.textDark}}>{item.name}</div>{item.expiry&&<div style={{fontSize:11,fontWeight:700,color:exp?"#C08000":T.textLight}}>{exp?"⚠️ Exp ":"🗓 "}{item.expiry}</div>}</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <button onClick={()=>chgQty(item.id,-1)} style={{background:T.aquaPale,border:`1.5px solid ${T.aquaLight}`,borderRadius:8,width:26,height:26,color:T.aquaDark,fontSize:15,fontWeight:900}}>−</button>
              <span style={{fontWeight:900,fontSize:14,color:T.textDark,minWidth:20,textAlign:"center"}}>{item.qty}</span>
              <button onClick={()=>chgQty(item.id,+1)} style={{background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:8,width:26,height:26,color:T.white,fontSize:15,fontWeight:900}}>+</button>
            </div>
            <button onClick={()=>removeIng(item.id)} style={{background:"none",border:"none",fontSize:17,color:T.textLight}}>✕</button>
          </div>
        );})}
      </div>
      )}
      <div style={{background:`linear-gradient(135deg,${T.aquaPale},${T.pinkPale})`,border:`2px dashed ${T.aquaLight}`,borderRadius:18,padding:"14px",marginTop:14,textAlign:"center"}}>
        <div style={{fontSize:26,marginBottom:5}}>📷</div>
        <div style={{fontWeight:800,color:T.textMid,fontSize:13}}>AI Photo Scan — Coming Soon</div>
        <div style={{color:T.textLight,fontSize:11,fontWeight:600,marginTop:3}}>Snap a photo to auto-detect ingredients & expiry dates</div>
      </div>
    </div>
  );
}

/* ── SHOP ────────────────────────────────────────────────── */
function ShopTab({S,onToggle,shopLv,shopLvLabel,setS,showToast}){
  const [view,setView]=useState("furniture");
  const placed=STORE_ITEMS.filter(i=>S.placed.includes(i.id));
  const [npcDialogue,setNpcDialogue]=useState(null); // {npcId, text}
  const dialogueRef=useRef(null);

  const handleNpcClick=(npc)=>{
    const text=NPC_LINES[Math.floor(Math.random()*NPC_LINES.length)];
    setNpcDialogue({npcId:npc.id,text});
    clearTimeout(dialogueRef.current);
    dialogueRef.current=setTimeout(()=>setNpcDialogue(null),2200);
  };

  return(
    <div style={{padding:"13px 14px 0",animation:"fadeSlide .3s ease"}}>
      {/* Restaurant floor */}
      <div style={{background:`linear-gradient(160deg,${T.aquaPale},${T.white},${T.pinkPale})`,border:`2px solid ${T.aquaLight}`,borderRadius:22,overflow:"hidden",marginBottom:12,boxShadow:`0 6px 28px rgba(61,216,232,.1)`}}>
        <div style={{padding:"12px 15px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:900,fontSize:15,color:T.textDark}}>{S.shopName}</div><div style={{fontSize:11,fontWeight:700,color:T.aquaDark}}>⭐ Lv.{shopLv} · {shopLvLabel}</div></div>
          <div style={{background:`linear-gradient(135deg,${T.aquaLight},${T.pinkLight})`,borderRadius:13,padding:"4px 10px"}}><span style={{fontSize:11,fontWeight:800,color:T.textDark}}>Pop. {S.popularity}</span></div>
        </div>
        {/* Floor canvas */}
        <div style={{background:"linear-gradient(180deg,rgba(232,251,253,.7),rgba(255,240,247,.5))",margin:"0 11px",borderRadius:16,height:150,position:"relative",border:`1.5px dashed ${T.aquaLight}`,overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 38px,${T.aquaLight}40 38px,${T.aquaLight}40 39px),repeating-linear-gradient(90deg,transparent,transparent 38px,${T.aquaLight}40 38px,${T.aquaLight}40 39px)`,borderRadius:16,pointerEvents:"none"}}/>
          {placed.length>0&&<div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 30%,${placed[0]?.item_col||T.aqua}14,transparent 60%)`,pointerEvents:"none"}}/>}
          {/* Placed items (static grid) */}
          <div style={{display:"flex",gap:7,padding:"8px 10px",flexWrap:"wrap",position:"relative"}}>
            {placed.slice(0,8).map(item=><div key={item.id} style={{width:32,height:32,background:`${item.item_col}18`,border:`1px dashed ${item.item_col}55`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{item.emoji}</div>)}
          </div>
          {/* Walking NPCs */}
          {S.npcs.map((npc,i)=>(
            <div key={npc.id} onClick={()=>handleNpcClick(npc)} style={{position:"absolute",bottom:8,fontSize:22,animation:`npcWalk ${9+i*2.3}s linear infinite`,animationDelay:`${i*-3.1}s`,cursor:"pointer",userSelect:"none",zIndex:5}}>
              {npc.avatarEmoji}
              {npcDialogue?.npcId===npc.id&&<div style={{position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%)",background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:12,padding:"5px 10px",whiteSpace:"nowrap",fontSize:11,fontWeight:700,color:T.textDark,boxShadow:`0 4px 12px rgba(61,216,232,.2)`,animation:"popIn .25s ease"}}>💬 {npcDialogue.text}</div>}
            </div>
          ))}
          {S.npcs.length===0&&placed.length===0&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><div style={{color:T.textLight,fontSize:12,fontWeight:700,textAlign:"center",lineHeight:1.5}}>Decorate your restaurant!<br/>Add NPCs in the People tab 👥</div></div>}
          <div style={{position:"absolute",top:7,right:8,background:"rgba(255,255,255,.72)",backdropFilter:"blur(6px)",borderRadius:9,padding:"3px 9px",border:`1px solid ${T.aquaLight}`}}><span style={{fontSize:9,fontWeight:800,color:T.textMid}}>🕹 Drag & drop coming soon</span></div>
        </div>
        <div style={{padding:"6px 14px 10px",display:"flex",gap:5,flexWrap:"wrap"}}>{placed.slice(0,5).map(i=><span key={i.id} style={{fontSize:10,fontWeight:700,color:i.item_col,background:`${i.item_col}18`,borderRadius:7,padding:"1px 6px"}}>{i.name}</span>)}</div>
      </div>

      {/* Sub-tabs */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {[["furniture","🛋️ Furniture"],["people","👥 People"],["info","📊 Info"]].map(([id,label])=>(
          <button key={id} onClick={()=>setView(id)} style={{flex:1,background:view===id?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.white,border:view===id?"none":`2px solid ${T.aquaLight}`,borderRadius:14,padding:"8px 4px",color:view===id?T.white:T.textMid,fontSize:12,fontWeight:800,boxShadow:view===id?`0 4px 12px ${T.aquaLight}`:"none",transition:"all .18s"}}>{label}</button>
        ))}
      </div>
      {view==="furniture"&&<FurnitureView S={S} onToggle={onToggle}/>}
      {view==="people"   &&<PeopleView   S={S} setS={setS} showToast={showToast}/>}
      {view==="info"     &&<ShopInfoView S={S} setS={setS} showToast={showToast}/>}
    </div>
  );
}
function FurnitureView({S,onToggle}){
  const owned=STORE_ITEMS.filter(i=>S.owned.includes(i.id));
  if(!owned.length)return <div style={{textAlign:"center",padding:"28px 0",color:T.textLight,fontWeight:700}}>No items yet — buy or pull from the Store! 🛒</div>;
  return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
    {owned.map(item=>{const p=S.placed.includes(item.id);const R=RARITY[item.rarity];return(
      <div key={item.id} className={`rarity-${item.rarity}`} style={{background:R.bg,border:`2.5px solid ${R.border}`,borderRadius:18,padding:"12px 10px",textAlign:"center",transition:"transform .15s"}}>
        <div style={{fontSize:30,marginBottom:5}}>{item.emoji}</div>
        <div style={{fontWeight:800,fontSize:12,color:T.textDark,marginBottom:2}}>{item.name}</div>
        <div style={{background:"rgba(255,255,255,.65)",borderRadius:8,display:"inline-block",padding:"1px 7px",color:R.col,fontSize:9,fontWeight:800,marginBottom:7}}>{item.rarity}</div>
        <button onClick={()=>onToggle(item.id)} style={{width:"100%",background:p?`${T.pink}20`:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:p?`2px solid ${T.pinkLight}`:"none",borderRadius:11,padding:"6px",color:p?T.pinkDark:T.white,fontSize:11,fontWeight:800}}>{p?"Remove":"Place"}</button>
      </div>
    );})}
  </div>;
}

/* ── PEOPLE / NPC ─────────────────────────────────────────── */
function PeopleView({S,setS,showToast}){
  const [adding,setAdding]=useState(false);
  const [npcForm,setNpcForm]=useState({name:"",avatarEmoji:"👦"});
  const addNpc=()=>{
    if(!npcForm.name.trim())return;
    const defaultLines=NPC_LINES.slice(0,4);
    setS(prev=>({...prev,npcs:[...prev.npcs,{id:Date.now(),name:npcForm.name,avatarEmoji:npcForm.avatarEmoji,dialogue:defaultLines}]}));
    showToast(`${npcForm.avatarEmoji} ${npcForm.name} joined your restaurant!`,"gold");
    setAdding(false);setNpcForm({name:"",avatarEmoji:"👦"});
  };
  const removeNpc=id=>setS(prev=>({...prev,npcs:prev.npcs.filter(n=>n.id!==id)}));
  return(
    <div>
      <div style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:18,padding:"13px 15px",marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div><div style={{fontWeight:800,color:T.textDark,fontSize:14}}>👥 Restaurant Characters</div><div style={{color:T.textMid,fontSize:12,fontWeight:600}}>{S.npcs.length} characters · walk around your restaurant</div></div>
          <button onClick={()=>setAdding(!adding)} style={{background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:14,padding:"7px 14px",color:T.white,fontSize:12,fontWeight:800}}>{adding?"Cancel":"+ Add"}</button>
        </div>
        {adding&&<div style={{background:T.snow,borderRadius:14,padding:"12px",marginBottom:10}}>
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:5}}>Pick avatar</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10,maxHeight:80,overflowY:"auto"}}>{NPC_AVATARS.map(e=><button key={e} onClick={()=>setNpcForm(f=>({...f,avatarEmoji:e}))} style={{fontSize:22,background:npcForm.avatarEmoji===e?T.aquaPale:T.snow,border:`2px solid ${npcForm.avatarEmoji===e?T.aqua:T.aquaLight}`,borderRadius:10,padding:"4px 5px"}}>{e}</button>)}</div>
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:5}}>Character name *</div>
          <input value={npcForm.name} onChange={e=>setNpcForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Grandma Rose" style={{marginBottom:10}}/>
          <button onClick={addNpc} style={{width:"100%",background:npcForm.name.trim()?`linear-gradient(135deg,${T.pink},${T.purple})`:T.snow,border:"none",borderRadius:13,padding:"10px",color:npcForm.name.trim()?T.white:T.textLight,fontSize:13,fontWeight:900}}>✅ Add to Restaurant</button>
        </div>}
        {S.npcs.length===0?<div style={{color:T.textLight,fontSize:13,fontWeight:700,textAlign:"center",padding:"16px 0"}}>No characters yet. Add one to see them walk around! 🚶</div>:(
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {S.npcs.map(npc=>(
              <div key={npc.id} style={{display:"flex",alignItems:"center",gap:10,background:T.snow,borderRadius:14,padding:"10px 12px"}}>
                <span style={{fontSize:28}}>{npc.avatarEmoji}</span>
                <div style={{flex:1}}><div style={{fontWeight:800,fontSize:14,color:T.textDark}}>{npc.name}</div><div style={{fontSize:11,color:T.textMid,fontWeight:600}}>Tap to hear dialogue in the restaurant</div></div>
                <button onClick={()=>removeNpc(npc.id)} style={{background:"none",border:"none",fontSize:16,color:T.textLight}}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:18,padding:"13px 15px",textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:6}}>🐾</div>
        <div style={{fontWeight:800,color:T.textDark,fontSize:14,marginBottom:3}}>Restaurant Pets</div>
        <div style={{color:T.textMid,fontSize:12,fontWeight:600,lineHeight:1.5}}>Adopt a pet to roam your restaurant!</div>
        <div style={{background:`linear-gradient(135deg,${T.aquaPale},${T.pinkPale})`,border:`1.5px dashed ${T.aquaLight}`,borderRadius:12,padding:"8px",marginTop:10,color:T.textLight,fontSize:12,fontWeight:700}}>🔒 Pets coming soon</div>
      </div>
    </div>
  );
}
function ShopInfoView({S,setS,showToast}){
  const [editing,setEditing]=useState(false);const [name,setName]=useState(S.shopName);
  const shopLv=Math.floor(S.popularity/100)+1;
  return <div>
    <div style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:18,padding:"12px 14px",marginBottom:10}}>
      <div style={{color:T.aquaDark,fontSize:11,fontWeight:800,marginBottom:6}}>Shop Name</div>
      {editing?<div style={{display:"flex",gap:8}}><input value={name} onChange={e=>setName(e.target.value)} maxLength={20}/><button onClick={()=>{setS(p=>({...p,shopName:name}));setEditing(false);showToast("Name updated!");}} style={{background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:11,padding:"0 14px",color:T.white,fontSize:12,fontWeight:800,whiteSpace:"nowrap"}}>Save</button></div>:<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:900,fontSize:15,color:T.textDark}}>{S.shopName}</span><button onClick={()=>setEditing(true)} style={{background:T.aquaPale,border:`1.5px solid ${T.aquaLight}`,borderRadius:10,padding:"4px 11px",color:T.aquaDark,fontSize:11,fontWeight:800}}>Rename</button></div>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      {[["📓","Logs",S.records.length,T.aquaDark],["🍳","Home",S.records.filter(r=>r.type==="cook").length,T.pink],["🍽️","Dining",S.records.filter(r=>r.type==="dine").length,T.purple],["🎒","Owned",S.owned.length,T.gold],["🍯","Earned",S.totalEarned,T.honey],["⭐","Pop.",S.popularity,T.aquaDark]].map(([ic,label,val,col])=>(
        <div key={label} style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:15,padding:"11px 12px"}}>
          <div style={{fontSize:19,marginBottom:3}}>{ic}</div><div style={{fontWeight:900,fontSize:18,color:col}}>{val}</div><div style={{color:T.textLight,fontSize:10,fontWeight:700}}>{label}</div>
        </div>
      ))}
    </div>
  </div>;
}

/* ── STORE ───────────────────────────────────────────────── */
function StoreTab({S,onGacha,onBuy}){
  const [view,setView]=useState("shop");
  return(
    <div style={{padding:"13px 14px",animation:"fadeSlide .3s ease"}}>
      <div style={{display:"flex",gap:8,marginBottom:13}}>
        {[["shop","🛍️ Shop"],["gacha","🥯 Gacha"]].map(([id,label])=>(
          <button key={id} onClick={()=>setView(id)} style={{flex:1,background:view===id?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.white,border:view===id?"none":`2px solid ${T.aquaLight}`,borderRadius:16,padding:"10px",color:view===id?T.white:T.textMid,fontSize:14,fontWeight:900,boxShadow:view===id?`0 4px 14px ${T.aquaLight}`:"none",transition:"all .18s"}}>{label}</button>
        ))}
      </div>
      {view==="shop" &&<ShopBuyView S={S} onBuy={onBuy}/>}
      {view==="gacha"&&<GachaView   S={S} onGacha={onGacha}/>}
    </div>
  );
}

function RarityItemCard({item,owned,action,actionLabel,disabled}){
  const R=RARITY[item.rarity];
  return(
    <div className={owned?`rarity-${item.rarity}`:""} style={{background:owned?R.bg:T.snow,border:`2.5px solid ${owned?R.border:"#E0E0E0"}`,borderRadius:18,padding:"13px 10px",textAlign:"center",opacity:disabled?0.5:1,position:"relative",transition:"transform .15s"}}>
      {item.gacha_only&&<div style={{position:"absolute",top:6,right:7,fontSize:10}}>🥯</div>}
      <div style={{fontSize:30,marginBottom:5}}>{owned?item.emoji:"❓"}</div>
      <div style={{fontWeight:800,fontSize:11,color:owned?T.textDark:T.textLight,marginBottom:2}}>{owned?item.name:"???"}</div>
      <div style={{background:"rgba(255,255,255,.7)",borderRadius:8,display:"inline-block",padding:"1px 7px",color:R.col,fontSize:9,fontWeight:800,marginBottom:7,border:`1px solid ${R.border}44`}}>{item.rarity}</div>
      {action&&<button onClick={action} disabled={disabled} style={{width:"100%",background:disabled?T.snow:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:disabled?`1.5px solid ${T.aquaLight}`:"none",borderRadius:11,padding:"7px",color:disabled?T.textLight:T.white,fontSize:11,fontWeight:800}}>{actionLabel}</button>}
    </div>
  );
}

function ShopBuyView({S,onBuy}){
  const [cat,setCat]=useState("All");
  // Read list_category from Store table
  const cats=["All",...new Set(STORE_ITEMS.filter(i=>!i.gacha_only).map(i=>i.list_category))];
  const items=STORE_ITEMS.filter(i=>!i.gacha_only&&(cat==="All"||i.list_category===cat));
  return(<>
    <div style={{background:`linear-gradient(135deg,${T.goldLight},#FFE880)`,borderRadius:18,padding:"12px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:22}}>🍯</span>
      <div><div style={{fontWeight:900,fontSize:14,color:"#A06000"}}>Honeypot Shop</div><div style={{fontWeight:700,fontSize:12,color:"#C08000"}}>Buy furniture with your Honeypot</div></div>
      <div style={{marginLeft:"auto",fontWeight:900,fontSize:16,color:"#A06000"}}>{S.currency} 🍯</div>
    </div>
    {/* Category filter from list_category field */}
    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:10}}>
      {cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{background:cat===c?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.white,border:cat===c?"none":`2px solid ${T.aquaLight}`,borderRadius:13,padding:"5px 13px",color:cat===c?T.white:T.textMid,fontSize:11,fontWeight:700,whiteSpace:"nowrap",flexShrink:0,transition:"all .18s"}}>{c}</button>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
      {items.map(item=>{
        const owned=S.owned.includes(item.id);
        const canBuy=S.currency>=item.price&&!owned;
        return(
          <div key={item.id} className={owned?`rarity-${item.rarity}`:""} style={{background:owned?RARITY[item.rarity].bg:T.white,border:`2.5px solid ${owned?RARITY[item.rarity].border:T.aquaLight}`,borderRadius:18,padding:"13px 10px",textAlign:"center"}}>
            <div style={{fontSize:30,marginBottom:5}}>{item.emoji}</div>
            <div style={{fontWeight:800,fontSize:11,color:T.textDark,marginBottom:2}}>{item.name}</div>
            <div style={{background:"rgba(255,255,255,.7)",borderRadius:7,display:"inline-block",padding:"1px 7px",color:RARITY[item.rarity].col,fontSize:9,fontWeight:800,marginBottom:3,border:`1px solid ${RARITY[item.rarity].border}44`}}>{item.rarity}</div>
            {/* item_qty and price from Store table */}
            <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:7}}>
              <span style={{fontSize:9,color:T.textLight,fontWeight:700}}>Stock: {item.item_qty>50?"∞":item.item_qty}</span>
            </div>
            <button onClick={()=>!owned&&onBuy(item)} disabled={owned||S.currency<item.price} style={{width:"100%",background:owned?"#E0E0E0":canBuy?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.snow,border:owned||canBuy?"none":`2px solid ${T.aquaLight}`,borderRadius:12,padding:"7px",color:owned?"#9E9E9E":canBuy?T.white:T.textLight,fontSize:11,fontWeight:800}}>
              {owned?"✅ Owned":`${item.price} 🍯`}
            </button>
          </div>
        );
      })}
    </div>
  </>);
}

function GachaView({S,onGacha}){
  const gachaItems=STORE_ITEMS.filter(i=>i.gacha_only);
  return(<>
    <div style={{background:"linear-gradient(135deg,#FFF5EC,#FFE8D0)",border:"2px solid #FFD0A0",borderRadius:18,padding:"13px 16px",marginBottom:13}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
        <span style={{fontSize:26}}>🥯</span>
        <div><div style={{fontWeight:900,fontSize:14,color:"#904000"}}>Bagel Tokens</div><div style={{fontWeight:700,fontSize:12,color:"#C06000"}}>Earn 1 🥯 for every 5 entries logged</div></div>
        <div style={{marginLeft:"auto",fontWeight:900,fontSize:18,color:"#904000"}}>{S.bagels} 🥯</div>
      </div>
      <div style={{background:"rgba(255,255,255,.5)",borderRadius:11,padding:"7px 11px",fontSize:11,fontWeight:700,color:"#B07040"}}>🔒 Exclusive items — pull only, not available in Shop</div>
    </div>
    <div style={{background:`linear-gradient(135deg,${T.purplePale},${T.pinkPale},${T.aquaPale})`,border:`2px solid ${T.pinkLight}`,borderRadius:22,padding:"18px",marginBottom:14,textAlign:"center",boxShadow:`0 6px 28px ${T.pinkLight}`}}>
      <div style={{fontSize:50,marginBottom:6,animation:"drift 3s ease-in-out infinite"}}>🎲</div>
      <div style={{fontWeight:900,fontSize:17,color:T.textDark,marginBottom:3}}>Rare Decoration Gacha</div>
      <div style={{color:T.textMid,fontWeight:700,fontSize:12,marginBottom:10}}>{GACHA_BAGEL_PRICE} 🥯 per pull</div>
      <div style={{display:"flex",gap:7,justifyContent:"center",marginBottom:14}}>
        {[["Rare","55%",T.aquaDark,T.aquaPale],["Epic","30%",RARITY.Epic.col,"#FFFDE7"],["Legendary","10%",RARITY.Legendary.col,"#F3E5F5"],["Unique","5%",RARITY.Unique.col,"#FFF3E0"]].map(([r,p,col,bg])=>(
          <div key={r} style={{background:bg,borderRadius:11,padding:"4px 10px",border:`1.5px solid ${col}55`}}><div style={{fontWeight:800,fontSize:9,color:col}}>{r}</div><div style={{fontWeight:900,fontSize:12,color:col}}>{p}</div></div>
        ))}
      </div>
      <button onClick={onGacha} disabled={S.bagels<GACHA_BAGEL_PRICE} style={{width:"100%",background:S.bagels>=GACHA_BAGEL_PRICE?`linear-gradient(135deg,${T.pink},${T.purple})`:T.snow,border:S.bagels>=GACHA_BAGEL_PRICE?"none":`2px solid ${T.aquaLight}`,borderRadius:17,padding:"13px",color:S.bagels>=GACHA_BAGEL_PRICE?T.white:T.textLight,fontSize:15,fontWeight:900,boxShadow:S.bagels>=GACHA_BAGEL_PRICE?`0 5px 20px ${T.pinkLight}`:"none"}}>
        🎲 Pull ({GACHA_BAGEL_PRICE} 🥯)
      </button>
      {S.bagels<GACHA_BAGEL_PRICE&&<div style={{color:T.textLight,fontSize:12,fontWeight:700,marginTop:8}}>Log 5 entries to earn a Bagel token!</div>}
    </div>
    <div style={{fontWeight:800,color:T.textMid,fontSize:12,marginBottom:8}}>✨ Exclusive Catalog ({gachaItems.filter(i=>S.owned.includes(i.id)).length}/{gachaItems.length})</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
      {gachaItems.map(item=>{const owned=S.owned.includes(item.id);const R=RARITY[item.rarity];return(
        <div key={item.id} className={owned?`rarity-${item.rarity}`:""} style={{background:owned?R.bg:T.snow,border:`2px solid ${owned?R.border:"#E0E0E0"}`,borderRadius:13,padding:"9px 5px",textAlign:"center",opacity:owned?1:.5}}>
          <div style={{fontSize:23}}>{owned?item.emoji:"❓"}</div>
          <div style={{fontWeight:800,fontSize:8,color:owned?T.textDark:T.textLight,marginTop:2,lineHeight:1.3}}>{owned?item.name:"???"}</div>
          <div style={{fontWeight:700,fontSize:8,color:R.col}}>{item.rarity}</div>
        </div>
      );})}
    </div>
  </>);
}

/* ── COLLECTION / ACHIEVEMENTS ───────────────────────────── */
function CollectionTab({S}){
  const [sub,setSub]=useState("achievements");
  const [collectionClicked,setCollectionClicked]=useState(false);
  const done=S.achievements.filter(a=>typeof a==="object");
  const undone=ACHIEVEMENTS.filter(a=>!S.achievements.some(x=>x.id===a.id));
  return(
    <div style={{padding:"13px 14px",animation:"fadeSlide .3s ease"}}>
      <div style={{display:"flex",gap:8,marginBottom:13}}>
        {[["achievements","🏅 Achievements"],["collection","🗂 Collection"]].map(([id,label])=>(
          <button key={id} onClick={()=>{if(id==="collection"){setCollectionClicked(true);setTimeout(()=>setCollectionClicked(false),2000);}else setSub(id);}} style={{flex:1,background:sub===id&&id!=="collection"?`linear-gradient(135deg,${T.aqua},${T.pink})`:id==="collection"?T.snow:T.white,border:sub===id&&id!=="collection"?"none":`2px solid ${T.aquaLight}`,borderRadius:16,padding:"8px",color:sub===id&&id!=="collection"?T.white:id==="collection"?T.textLight:T.textMid,fontSize:13,fontWeight:800,opacity:id==="collection"?0.55:1,transition:"all .18s"}}>{label}{id==="collection"&&" 🔒"}</button>
        ))}
      </div>
      {collectionClicked&&<div style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:16,padding:"14px",textAlign:"center",marginBottom:12,animation:"popIn .3s ease"}}><div style={{fontSize:28,marginBottom:6}}>🗂</div><div style={{fontWeight:800,color:T.textDark,fontSize:14}}>Collection — Coming Soon!</div><div style={{color:T.textMid,fontSize:12,fontWeight:600,marginTop:4}}>Track all your collected items in a future update ✦</div></div>}

      {sub==="achievements"&&<>
        <div style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:18,padding:"11px 14px",marginBottom:11}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontWeight:800,color:T.textDark,fontSize:13}}>Progress</span><span style={{fontWeight:700,color:T.textMid,fontSize:13}}>{done.length}/{ACHIEVEMENTS.length}</span></div>
          <div style={{background:T.aquaPale,borderRadius:8,height:9,overflow:"hidden"}}><div style={{width:`${(done.length/ACHIEVEMENTS.length)*100}%`,background:`linear-gradient(90deg,${T.aqua},${T.pink})`,height:"100%",transition:"width .5s"}}/></div>
        </div>
        {done.length>0&&<>
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:12,marginBottom:7}}>✅ Unlocked ({done.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:11}}>
            {done.map(achObj=>{const a=ACHIEVEMENTS.find(x=>x.id===achObj.id);if(!a)return null;return(
              <div key={achObj.id} style={{background:`linear-gradient(135deg,${T.aquaPale},${T.pinkPale})`,border:`2px solid ${T.aquaLight}`,borderRadius:17,padding:"13px 11px",position:"relative"}}>
                {/* Date top right */}
                <div style={{position:"absolute",top:7,right:9,fontSize:9,fontWeight:800,color:T.textLight}}>{fmtDate(achObj.unlockedAt)}</div>
                <div style={{fontSize:26,marginBottom:5}}>{a.icon}</div>
                <div style={{fontWeight:800,fontSize:13,color:T.textDark,marginBottom:2,paddingRight:50}}>{a.name}</div>
                <div style={{fontSize:10,color:T.textMid,fontWeight:600,lineHeight:1.4}}>{a.desc}</div>
                <div style={{marginTop:5,fontSize:10,fontWeight:800,color:T.aquaDark}}>✅ Unlocked</div>
              </div>
            );})}
          </div>
        </>}
        {undone.length>0&&<>
          <div style={{fontWeight:800,color:T.textLight,fontSize:12,marginBottom:7}}>🔒 Locked ({undone.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {undone.map(a=>(
              <div key={a.id} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:17,padding:"13px 11px",opacity:.52}}>
                <div style={{fontSize:26,marginBottom:5,filter:"grayscale(1)"}}>{a.icon}</div>
                <div style={{fontWeight:800,fontSize:13,color:T.textDark,marginBottom:2}}>{a.name}</div>
                <div style={{fontSize:10,color:T.textMid,fontWeight:600,lineHeight:1.4}}>{a.desc}</div>
              </div>
            ))}
          </div>
        </>}
      </>}
    </div>
  );
}

/* ── PROFILE MODAL ───────────────────────────────────────── */
function ProfileModal({S,setS,onClose,showToast}){
  const [form,setForm]=useState({...S.profile});
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleFavTag=id=>setF("favTags",form.favTags.includes(id)?form.favTags.filter(t=>t!==id):form.favTags.length<5?[...form.favTags,id]:form.favTags);
  const save=()=>{setS(p=>({...p,profile:form}));showToast("Profile saved!","gold");onClose();};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(180,230,245,.5)",backdropFilter:"blur(18px)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
      <div style={{background:T.white,borderRadius:"26px 26px 0 0",width:"100%",maxWidth:393,margin:"0 auto",padding:"20px 18px 36px",border:`2px solid ${T.aquaLight}`,borderBottom:"none",maxHeight:"88vh",overflowY:"auto",boxShadow:`0 -14px 44px rgba(61,216,232,.13)`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontWeight:900,fontSize:17,color:T.textDark}}>⚙️ Profile & Settings</div>
          <button onClick={onClose} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:30,height:30,color:T.textMid,fontSize:16,fontWeight:800}}>×</button>
        </div>
        {/* Avatar */}
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${T.aquaLight},${T.pinkLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 10px",border:`3px solid ${T.white}`,boxShadow:`0 4px 16px ${T.aquaLight}`}}>{form.avatarEmoji}</div>
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:7}}>Choose avatar</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center",maxHeight:88,overflowY:"auto"}}>
            {NPC_AVATARS.map(e=><button key={e} onClick={()=>setF("avatarEmoji",e)} style={{fontSize:22,background:form.avatarEmoji===e?T.aquaPale:T.snow,border:`2px solid ${form.avatarEmoji===e?T.aqua:T.aquaLight}`,borderRadius:10,padding:"4px 6px"}}>{e}</button>)}
          </div>
        </div>
        {/* Nickname */}
        <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:5}}>Nickname</div>
        <input value={form.nickname} onChange={e=>setF("nickname",e.target.value)} maxLength={20} placeholder="Your nickname" style={{marginBottom:12}}/>
        {/* Bio */}
        <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:5}}>Bio <span style={{color:T.textLight,fontWeight:600}}>({form.bio.length}/100)</span></div>
        <textarea value={form.bio} onChange={e=>setF("bio",e.target.value.slice(0,100))} rows={2} placeholder="Tell us about your food journey..." style={{marginBottom:12,resize:"none"}}/>
        {/* Fav tags */}
        <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:5}}>Favourite Cuisine Tags <span style={{color:T.textLight,fontWeight:600}}>({form.favTags.length}/5)</span></div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
          {CUISINE_TAGS.filter(t=>!t.dineoutonly).map(tag=>{const sel=form.favTags.includes(tag.id);return(
            <button key={tag.id} onClick={()=>toggleFavTag(tag.id)} style={{background:sel?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.snow,border:`2px solid ${sel?T.aqua:T.aquaLight}`,borderRadius:14,padding:"5px 11px",color:sel?T.white:T.textMid,fontSize:11,fontWeight:700,transition:"all .18s",opacity:!sel&&form.favTags.length>=5?.4:1}}>{tag.label}</button>
          );})}
        </div>
        {/* System settings placeholder */}
        <div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:16,padding:"12px 14px",marginBottom:16}}>
          <div style={{fontWeight:800,color:T.textDark,fontSize:13,marginBottom:8}}>⚙️ System Settings</div>
          {[["🌙 Dark Mode","Coming soon"],["🔔 Notifications","Coming soon"],["🌐 Language","English"],["🔒 Privacy","Public (default)"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.aquaLight}`}}>
              <span style={{fontWeight:700,color:T.textDark,fontSize:13}}>{k}</span>
              <span style={{fontWeight:600,color:T.textLight,fontSize:12}}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={save} style={{width:"100%",background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:18,padding:"13px",color:T.white,fontSize:15,fontWeight:900,boxShadow:`0 5px 20px ${T.aquaLight}`}}>✅ Save Profile</button>
      </div>
    </div>
  );
}

/* ── ADD MODAL ───────────────────────────────────────────── */
const GACHA_BAGEL_PRICE=1;

function AddModal({S,onClose,onSubmit}){
  const [type,setType]=useState("cook");
  const [step,setStep]=useState(0);
  const [photos,setPhotos]=useState([]);
  const [form,setForm]=useState({title:"",notes:"",address:"",rating:0,mealTime:"Lunch",tags:[],emoji:"🍳",ingredients:[],servings:{},privacy:"public"});
  const [addrResults,setAddrResults]=useState([]);
  const [showTagSearch,setShowTagSearch]=useState(false);
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));

  // Tag logic: filter by dineoutonly, sort by usage, show top 10
  const availableTags=CUISINE_TAGS.filter(t=>type==="cook"?!t.dineoutonly:true);
  const sortedTags=[...availableTags].sort((a,b)=>(S.tagUsage[b.id]||0)-(S.tagUsage[a.id]||0));
  const suggestedTags=sortedTags.slice(0,10);

  const toggleTag=id=>setF("tags",form.tags.includes(id)?form.tags.filter(t=>t!==id):[...form.tags,id]);

  const handleAddrInput=val=>{
    setF("address",val);
    if(val.length<2){setAddrResults([]);return;}
    const filtered=MOCK_ADDR.filter(a=>a.toLowerCase().includes(val.toLowerCase())).slice(0,5);
    setAddrResults(filtered);
  };

  const handlePhoto=(e)=>{
    const files=Array.from(e.target.files);
    files.forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>setPhotos(prev=>[...prev,{id:Date.now()+Math.random(),preview:ev.target.result,name:file.name}].slice(0,9));
      reader.readAsDataURL(file);
    });
  };
  const removePhoto=id=>setPhotos(prev=>prev.filter(p=>p.id!==id));

  const toggleIngredient=id=>setF("ingredients",form.ingredients.includes(id)?form.ingredients.filter(i=>i!==id):[...form.ingredients,id]);

  const notesOk=form.notes.trim().length>=30;
  const step2Ok=form.title.trim()&&notesOk;
  const earnAmt=type==="cook"?80:50;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(180,230,245,.5)",backdropFilter:"blur(16px)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
      <div style={{background:T.white,borderRadius:"26px 26px 0 0",width:"100%",maxWidth:393,margin:"0 auto",padding:"18px 17px 34px",border:`2px solid ${T.aquaLight}`,borderBottom:"none",maxHeight:"93vh",overflowY:"auto",boxShadow:`0 -14px 44px rgba(61,216,232,.13)`}}>
        {/* Step bar */}
        <div style={{display:"flex",gap:6,marginBottom:15}}>
          {["Type","Photos","Details","Confirm"].map((s,i)=><div key={s} style={{flex:1,height:5,borderRadius:5,background:i<=step?`linear-gradient(90deg,${T.aqua},${T.pink})`:T.aquaPale}}/>)}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontWeight:900,fontSize:16,color:T.textDark}}>{["Choose Type","Add Photos","Fill Details","Preview"][step]}</div>
          <button onClick={onClose} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:15,fontWeight:800}}>×</button>
        </div>

        {/* STEP 0: Type */}
        {step===0&&<>
          <div style={{display:"flex",gap:10,marginBottom:17}}>
            {[["cook","🍳","Home Cooked","+80 🍯"],["dine","🍽️","Dining Out","+50 🍯"]].map(([id,ic,label,reward])=>(
              <div key={id} onClick={()=>setType(id)} style={{flex:1,background:type===id?`linear-gradient(160deg,${T.aquaPale},${T.pinkPale})`:T.snow,border:`2.5px solid ${type===id?T.aqua:T.aquaLight}`,borderRadius:20,padding:"17px 10px",textAlign:"center",cursor:"pointer",transition:"all .18s",boxShadow:type===id?`0 4px 14px ${T.aquaLight}`:"none"}}>
                <div style={{fontSize:38,marginBottom:7}}>{ic}</div>
                <div style={{fontWeight:900,fontSize:14,color:T.textDark,marginBottom:4}}>{label}</div>
                <div style={{background:`linear-gradient(135deg,${T.goldLight},#FFE060)`,borderRadius:11,display:"inline-block",padding:"3px 10px",fontWeight:800,fontSize:11,color:"#A06000"}}>{reward}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setStep(1)} style={{width:"100%",background:`linear-gradient(135deg,${T.pink},${T.purple})`,border:"none",borderRadius:17,padding:13,color:T.white,fontSize:15,fontWeight:900,boxShadow:`0 5px 20px ${T.pinkLight}`}}>Next →</button>
        </>}

        {/* STEP 1: Photos (小紅書 style) */}
        {step===1&&<>
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:12,marginBottom:8}}>Add up to 9 photos 📸</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:14}}>
            {photos.map(p=>(
              <div key={p.id} style={{aspectRatio:"1",borderRadius:12,overflow:"hidden",position:"relative",border:`2px solid ${T.aquaLight}`}}>
                <img src={p.preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
                <button onClick={()=>removePhoto(p.id)} style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,.45)",border:"none",borderRadius:"50%",width:20,height:20,color:"#fff",fontSize:11,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              </div>
            ))}
            {photos.length<9&&(
              <label style={{aspectRatio:"1",borderRadius:12,border:`2px dashed ${T.aquaLight}`,background:T.snow,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexDirection:"column",gap:4}}>
                <span style={{fontSize:24,color:T.aquaDark}}>+</span>
                <span style={{fontSize:10,color:T.textLight,fontWeight:700}}>Photo</span>
                <input type="file" accept="image/*" multiple onChange={handlePhoto} style={{display:"none"}}/>
              </label>
            )}
          </div>
          <div style={{color:T.textLight,fontSize:11,fontWeight:600,textAlign:"center",marginBottom:14}}>Photos are optional but bring your entry to life!</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep(0)} style={{flex:1,background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:11,color:T.textMid,fontSize:13,fontWeight:800}}>← Back</button>
            <button onClick={()=>setStep(2)} style={{flex:2,background:`linear-gradient(135deg,${T.pink},${T.purple})`,border:"none",borderRadius:14,padding:11,color:T.white,fontSize:14,fontWeight:900,boxShadow:`0 4px 14px ${T.pinkLight}`}}>Next →</button>
          </div>
        </>}

        {/* STEP 2: Details */}
        {step===2&&<>
          {/* Emoji */}
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:5}}>Emoji</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>{FOOD_EMOJIS.map(e=><button key={e} onClick={()=>setF("emoji",e)} style={{fontSize:21,background:form.emoji===e?T.aquaPale:T.snow,border:`2px solid ${form.emoji===e?T.aqua:T.aquaLight}`,borderRadius:10,padding:"4px 6px"}}>{e}</button>)}</div>

          {/* Title (was "restaurant name") */}
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:4}}>Title *</div>
          <input value={form.title} onChange={e=>setF("title",e.target.value)} placeholder={type==="cook"?"e.g. Garlic Butter Pasta":"e.g. Dinner at Din Tai Fung"} style={{marginBottom:11}}/>

          {/* Tags: 10 shown + + button */}
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:5}}>Tags <span style={{color:T.textLight,fontWeight:600}}>(tap to select)</span></div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:11,alignItems:"center"}}>
            {suggestedTags.map(tag=>(
              <button key={tag.id} onClick={()=>toggleTag(tag.id)} style={{background:form.tags.includes(tag.id)?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.snow,border:`2px solid ${form.tags.includes(tag.id)?T.aqua:T.aquaLight}`,borderRadius:14,padding:"5px 10px",color:form.tags.includes(tag.id)?T.white:T.textMid,fontSize:11,fontWeight:700,transition:"all .18s"}}>{tag.label}</button>
            ))}
            {/* + button to search more tags */}
            <button onClick={()=>setShowTagSearch(true)} style={{background:T.aquaPale,border:`2px solid ${T.aqua}`,borderRadius:14,padding:"5px 10px",color:T.aquaDark,fontSize:12,fontWeight:900}}>+</button>
          </div>
          {form.tags.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{form.tags.map(id=>{const t=CUISINE_TAGS.find(x=>x.id===id);return t?<span key={id} style={{background:`${T.aqua}22`,border:`1px solid ${T.aquaLight}`,borderRadius:8,padding:"2px 7px",color:T.aquaDark,fontSize:11,fontWeight:700}}>✓ {t.label}</span>:null;})}</div>}

          {/* Cook-specific: ingredients (left) + servings (right) */}
          {type==="cook"&&<>
            <div style={{display:"flex",gap:10,marginBottom:11}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:5}}>Ingredients <span style={{color:T.textLight,fontWeight:600}}>(optional)</span></div>
                <div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:"8px 9px",maxHeight:120,overflowY:"auto"}}>
                  {INGREDIENTS.map(ing=>(
                    <div key={ing.id} onClick={()=>toggleIngredient(ing.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 3px",cursor:"pointer",borderRadius:8,background:form.ingredients.includes(ing.id)?T.aquaPale:"transparent"}}>
                      <span style={{fontSize:16}}>{ing.emoji}</span>
                      <span style={{fontSize:11,fontWeight:700,color:form.ingredients.includes(ing.id)?T.aquaDark:T.textDark,flex:1}}>{ing.name}</span>
                      {form.ingredients.includes(ing.id)&&<span style={{fontSize:10,color:T.aquaDark}}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:5}}>Servings <span style={{color:T.textLight,fontWeight:600}}>(optional)</span></div>
                <div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:"8px 9px",maxHeight:120,overflowY:"auto"}}>
                  {form.ingredients.length===0?<div style={{color:T.textLight,fontSize:11,fontWeight:600,textAlign:"center",paddingTop:8}}>Select ingredients first</div>:
                  form.ingredients.map(id=>{const ing=INGREDIENTS.find(i=>i.id===id);if(!ing)return null;return(
                    <div key={id} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 0"}}>
                      <span style={{fontSize:13}}>{ing.emoji}</span>
                      <input type="number" min="0" value={form.servings[id]||""} onChange={e=>setF("servings",{...form.servings,[id]:e.target.value})} placeholder={`${ing.unit}`} style={{padding:"3px 6px",fontSize:11,height:28,minWidth:0}}/>
                      <span style={{fontSize:10,color:T.textMid,fontWeight:600,whiteSpace:"nowrap"}}>{ing.unit}</span>
                    </div>
                  );})}
                </div>
              </div>
            </div>
          </>}

          {/* Meal time */}
          <div style={{display:"flex",gap:10,marginBottom:11}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:4}}>Meal Time</div>
              <select value={form.mealTime} onChange={e=>setF("mealTime",e.target.value)}>{MEAL_TIMES.map(m=><option key={m}>{m}</option>)}</select>
            </div>
            {type==="dine"&&<div style={{flex:1}}>
              <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:4}}>Rating</div>
              <div style={{display:"flex",gap:1,paddingTop:8}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setF("rating",n)} style={{background:"none",border:"none",fontSize:20,color:n<=form.rating?T.gold:T.aquaLight,padding:0}}>★</button>)}</div>
            </div>}
          </div>

          {/* Address (Google Maps mock) */}
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:4}}>Location <span style={{color:T.textLight,fontWeight:600}}>(optional)</span></div>
          <div style={{position:"relative",marginBottom:addrResults.length?0:11}}>
            <input value={form.address} onChange={e=>handleAddrInput(e.target.value)} placeholder="Search address..." style={{paddingLeft:36}}/>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14}}>📍</span>
            <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:9,color:T.textLight,fontWeight:700}}>Google Maps</div>
          </div>
          {addrResults.length>0&&<div style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:14,marginBottom:11,overflow:"hidden",boxShadow:`0 4px 14px rgba(61,216,232,.12)`}}>
            {addrResults.map(a=><div key={a} onClick={()=>{setF("address",a);setAddrResults([]);}} style={{padding:"9px 14px",cursor:"pointer",fontSize:13,color:T.textDark,fontWeight:600,borderBottom:`1px solid ${T.aquaLight}`}}>📍 {a}</div>)}
          </div>}

          {/* Notes (required, 30 char min) */}
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:11,marginBottom:4}}>
            Notes * <span style={{fontWeight:600,color:form.notes.length>=30?T.aquaDark:T.textLight}}>({form.notes.length}/30 min)</span>
          </div>
          <textarea value={form.notes} onChange={e=>setF("notes",e.target.value)} rows={3} placeholder="Share your experience, taste, recipe tips... (min. 30 characters)" style={{marginBottom:4,resize:"none",borderColor:form.notes.length>0&&!notesOk?"#FF6B8A":undefined}}/>
          {form.notes.length>0&&!notesOk&&<div style={{color:"#FF6B8A",fontSize:11,fontWeight:700,marginBottom:8}}>{30-form.notes.length} more characters needed</div>}

          {/* Privacy (coming soon, disabled) */}
          <div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:"10px 13px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:.7}}>
            <div><div style={{fontWeight:800,color:T.textDark,fontSize:12}}>🔒 Privacy</div><div style={{fontSize:11,color:T.textMid,fontWeight:600}}>Social features coming in future update</div></div>
            <div style={{background:T.aquaPale,borderRadius:10,padding:"3px 10px",fontWeight:800,fontSize:11,color:T.aquaDark}}>Public</div>
          </div>

          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep(1)} style={{flex:1,background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:11,color:T.textMid,fontSize:13,fontWeight:800}}>← Back</button>
            <button onClick={()=>{if(!step2Ok)return;setStep(3);}} style={{flex:2,background:step2Ok?`linear-gradient(135deg,${T.pink},${T.purple})`:T.snow,border:"none",borderRadius:14,padding:11,color:step2Ok?T.white:T.textLight,fontSize:13,fontWeight:900,boxShadow:step2Ok?`0 4px 14px ${T.pinkLight}`:"none"}}>
              Preview →{!form.title.trim()?" (title required)":!notesOk?" (notes too short)":""}
            </button>
          </div>
        </>}

        {/* STEP 3: Confirm */}
        {step===3&&<div style={{textAlign:"center"}}>
          <div style={{background:`linear-gradient(135deg,${T.aquaPale},${T.pinkPale})`,border:`2px solid ${T.aquaLight}`,borderRadius:20,padding:"17px 14px",marginBottom:12}}>
            {photos.length>0&&<div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:10}}>{photos.slice(0,3).map(p=><div key={p.id} style={{width:52,height:52,borderRadius:10,overflow:"hidden",border:`2px solid ${T.aquaLight}`}}><img src={p.preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>)}</div>}
            <div style={{fontSize:52,marginBottom:5}}>{form.emoji}</div>
            <div style={{fontWeight:900,fontSize:17,color:T.textDark,marginBottom:3}}>{form.title}</div>
            {form.address&&<div style={{color:T.textMid,fontWeight:700,fontSize:12,marginBottom:3}}>📍 {form.address}</div>}
            <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap",marginTop:5}}>
              <span style={{fontWeight:700,color:T.textMid,fontSize:12}}>{mealIcon[form.mealTime]} {form.mealTime}</span>
              {form.rating>0&&<span style={{color:T.gold,fontSize:13}}>{"★".repeat(form.rating)}</span>}
            </div>
            {form.tags.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center",marginTop:8}}>{form.tags.map(id=>{const t=CUISINE_TAGS.find(x=>x.id===id);return t?<span key={id} style={{background:T.white,border:`1px solid ${T.aquaLight}`,borderRadius:7,padding:"2px 6px",color:T.textMid,fontSize:10,fontWeight:700}}>#{t.label}</span>:null;})}</div>}
            {form.ingredients.length>0&&<div style={{fontSize:11,color:T.textMid,fontWeight:600,marginTop:6}}>🧑‍🍳 {form.ingredients.map(id=>INGREDIENTS.find(i=>i.id===id)?.emoji).join(" ")}</div>}
          </div>
          <div style={{background:`linear-gradient(135deg,${T.goldLight},#FFE880)`,borderRadius:15,padding:"12px",marginBottom:13,boxShadow:"0 4px 14px rgba(255,184,48,.16)"}}>
            <div style={{fontWeight:900,fontSize:24,color:"#A06000"}}>+{earnAmt} 🍯</div>
            <div style={{fontWeight:700,color:"#C08000",fontSize:12}}>Honeypot earned for this entry</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep(2)} style={{flex:1,background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:11,color:T.textMid,fontSize:13,fontWeight:800}}>Edit</button>
            <button onClick={()=>onSubmit({...form,type,photos})} style={{flex:2,background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:14,padding:11,color:T.white,fontSize:14,fontWeight:900,boxShadow:`0 5px 20px ${T.aquaLight}`}}>✅ Save Entry!</button>
          </div>
        </div>}

        {/* Tag Search Overlay */}
        {showTagSearch&&<TagSearchModal type={type} selected={form.tags} onToggle={toggleTag} onClose={()=>setShowTagSearch(false)}/>}
      </div>
    </div>
  );
}

function TagSearchModal({type,selected,onToggle,onClose}){
  const [q,setQ]=useState("");
  const pool=CUISINE_TAGS.filter(t=>type==="cook"?!t.dineoutonly:true);
  const filtered=q?pool.filter(t=>t.label.toLowerCase().includes(q.toLowerCase())):pool;
  return(
    <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,.97)",backdropFilter:"blur(10px)",borderRadius:"26px 26px 0 0",zIndex:10,padding:"18px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontWeight:900,fontSize:15,color:T.textDark}}>Search Tags</div>
        <button onClick={onClose} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:14,fontWeight:800}}>×</button>
      </div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search or type a tag..." style={{marginBottom:12}}/>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",maxHeight:280,overflowY:"auto"}}>
        {filtered.map(tag=>(
          <button key={tag.id} onClick={()=>onToggle(tag.id)} style={{background:selected.includes(tag.id)?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.snow,border:`2px solid ${selected.includes(tag.id)?T.aqua:T.aquaLight}`,borderRadius:14,padding:"6px 12px",color:selected.includes(tag.id)?T.white:T.textMid,fontSize:12,fontWeight:700,transition:"all .18s"}}>
            {selected.includes(tag.id)?"✓ ":""}{tag.label}{tag.dineoutonly?" 🍽️":""}
          </button>
        ))}
      </div>
      <button onClick={onClose} style={{width:"100%",background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:16,padding:"12px",marginTop:14,color:T.white,fontSize:14,fontWeight:900}}>Done ✓</button>
    </div>
  );
}

/* ── GACHA MODAL ─────────────────────────────────────────── */
function GachaModal({S,onClose,onGacha,result,anim,setResult}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(180,230,245,.52)",backdropFilter:"blur(18px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:T.white,borderRadius:26,padding:"24px 20px",width:"100%",maxWidth:350,border:`2px solid ${T.aquaLight}`,boxShadow:`0 24px 60px rgba(61,216,232,.2)`,textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:900,fontSize:16,color:T.textDark}}>🎲 Rare Gacha</div>
          <button onClick={onClose} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:14,fontWeight:800}}>×</button>
        </div>
        {!result&&!anim&&<>
          <div style={{fontSize:64,marginBottom:10,animation:"drift 3s ease-in-out infinite"}}>🎁</div>
          <div style={{fontWeight:700,color:T.textDark,marginBottom:4}}>Bagels: <span style={{color:"#904000",fontWeight:900}}>{S.bagels} 🥯</span></div>
          <div style={{fontWeight:600,color:T.textMid,fontSize:13,marginBottom:18}}>{GACHA_BAGEL_PRICE} 🥯 per pull · Exclusive items only</div>
          <button onClick={onGacha} disabled={S.bagels<GACHA_BAGEL_PRICE} style={{width:"100%",background:S.bagels>=GACHA_BAGEL_PRICE?`linear-gradient(135deg,${T.pink},${T.purple})`:T.snow,border:"none",borderRadius:16,padding:13,color:S.bagels>=GACHA_BAGEL_PRICE?T.white:T.textLight,fontSize:15,fontWeight:900}}>🎲 Pull Now!</button>
        </>}
        {anim&&<div style={{padding:"36px 0"}}><div style={{fontSize:58,animation:"spin .7s linear infinite",display:"inline-block"}}>🎰</div><div style={{fontWeight:800,color:T.aquaDark,fontSize:14,marginTop:13}}>Pulling...</div></div>}
        {result&&!anim&&<>
          <div className={`rarity-${result.rarity}`} style={{background:RARITY[result.rarity].bg,border:`3px solid ${RARITY[result.rarity].border}`,borderRadius:20,padding:"20px 16px",marginBottom:13,animation:"popIn .4s ease"}}>
            <div style={{fontSize:72,marginBottom:5}}>{result.emoji}</div>
            <div style={{background:"rgba(255,255,255,.75)",borderRadius:9,display:"inline-block",padding:"2px 11px",color:RARITY[result.rarity].col,fontWeight:800,fontSize:11,marginBottom:6}}>✦ {result.rarity} ✦</div>
            <div style={{fontWeight:900,fontSize:17,color:T.textDark}}>{result.name}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setResult(null);onGacha();}} disabled={S.bagels<GACHA_BAGEL_PRICE} style={{flex:1,background:S.bagels>=GACHA_BAGEL_PRICE?T.aquaPale:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:11,color:S.bagels>=GACHA_BAGEL_PRICE?T.aquaDark:T.textLight,fontSize:13,fontWeight:800}}>Pull Again</button>
            <button onClick={onClose} style={{flex:1,background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:14,padding:11,color:T.white,fontSize:13,fontWeight:900}}>Collect! ✦</button>
          </div>
        </>}
      </div>
    </div>
  );
}

/* ── RECORD MODAL ────────────────────────────────────────── */
function RecordModal({record,onClose}){
  const d=new Date(record.date);
  const dateStr=`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,"0")}`;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(180,230,245,.5)",backdropFilter:"blur(16px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
      <div style={{background:T.white,borderRadius:24,padding:"20px 18px",width:"100%",maxWidth:355,border:`2px solid ${T.aquaLight}`,boxShadow:`0 22px 58px rgba(61,216,232,.16)`,maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontWeight:900,fontSize:14,color:T.textDark}}>Entry Details</div>
          <button onClick={onClose} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:14,fontWeight:800}}>×</button>
        </div>
        {/* Photos */}
        {record.photos?.length>0&&<div style={{display:"flex",gap:5,marginBottom:12,overflowX:"auto"}}>{record.photos.map((p,i)=><div key={i} style={{width:72,height:72,borderRadius:12,overflow:"hidden",flexShrink:0,border:`2px solid ${T.aquaLight}`}}><img src={p.preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>)}</div>}
        <div style={{textAlign:"center",marginBottom:12}}>
          <div style={{fontSize:52,marginBottom:4}}>{record.emoji||"🍽️"}</div>
          <div style={{fontWeight:900,fontSize:17,color:T.textDark,marginBottom:2}}>{record.title}</div>
          {record.address&&<div style={{color:T.textMid,fontWeight:700,fontSize:12}}>📍 {record.address}</div>}
          {record.rating>0&&<div style={{color:T.gold,fontSize:16,marginTop:2}}>{"★".repeat(record.rating)}{"☆".repeat(5-record.rating)}</div>}
        </div>
        <div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:"9px 12px",marginBottom:9}}>
          {[["Type",record.type==="cook"?"🍳 Home Cooked":"🍽️ Dining"],["Meal",`${mealIcon[record.mealTime]||""} ${record.mealTime||"—"}`],["Date",dateStr],["Earned",`+${record.earned} 🍯`]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.aquaLight}`}}>
              <span style={{color:T.textLight,fontSize:12,fontWeight:700}}>{k}</span>
              <span style={{color:T.textDark,fontSize:12,fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
        {record.notes&&<div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:"9px 12px",marginBottom:9}}>
          <div style={{color:T.aquaDark,fontWeight:800,fontSize:11,marginBottom:4}}>Notes</div>
          <div style={{color:T.textMid,fontSize:13,fontWeight:600,lineHeight:1.55}}>{record.notes}</div>
        </div>}
        {record.ingredients?.length>0&&<div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:"9px 12px",marginBottom:9}}>
          <div style={{color:T.aquaDark,fontWeight:800,fontSize:11,marginBottom:5}}>Ingredients used</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{record.ingredients.map(id=>{const ing=INGREDIENTS.find(i=>i.id===id);return ing?<span key={id} style={{background:T.aquaPale,borderRadius:8,padding:"2px 8px",fontSize:12,fontWeight:700,color:T.aquaDark}}>{ing.emoji} {ing.name}{record.servings?.[id]?` · ${record.servings[id]}${ing.unit}`:""}</span>:null;})}</div>
        </div>}
        {record.tags?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{record.tags.map(id=>{const t=CUISINE_TAGS.find(x=>x.id===id);return t?<span key={id} style={{background:T.aquaPale,border:`1px solid ${T.aquaLight}`,borderRadius:8,padding:"2px 7px",color:T.aquaDark,fontSize:11,fontWeight:700}}>#{t.label}</span>:null;})}</div>}
      </div>
    </div>
  );
}
