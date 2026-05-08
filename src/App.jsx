import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "./lib/supabase";
import { T, CURRENCY, ACHIEVEMENTS, GACHA_TABLE, GACHA_BAGEL_PRICE, STORE_ITEMS } from "./constants";
import { load, save } from "./state";
import AchievementToast from "./components/AchievementToast";
import DevPanel        from "./components/DevPanel";
import JournalTab    from "./tabs/JournalTab";
import FridgeTab     from "./tabs/FridgeTab";
import ShopTab       from "./tabs/ShopTab";
import StoreTab      from "./tabs/StoreTab";
import CollectionTab from "./tabs/CollectionTab";
import ProfileModal  from "./modals/ProfileModal";
import AddModal      from "./modals/AddModal";
import GachaModal    from "./modals/GachaModal";
import RecordModal   from "./modals/RecordModal";

let _avatarsFetched=false;
export default function App(){
  const [S,setS_raw]=useState(load);
  const [tab,setTab]=useState("journal");
  const [modal,setModal]=useState(null);
  const [toast,setToast]=useState(null);
  const [selRec,setSelRec]=useState(null);
  const [gachaRes,setGachaRes]=useState(null);
  const [gachaAnim,setGachaAnim]=useState(false);
  const [showProfile,setShowProfile]=useState(false);
  const [myshopFlash,setMyshopFlash]=useState(false);
  const [achToast,setAchToast]=useState(null);
  const [avatars,setAvatars]=useState([]);
  const [avatarBgcolors,setAvatarBgcolors]=useState([]);
  const [achievements,setAchievements]=useState([]);
  const achievementsRef=useRef([]);

  useEffect(()=>{
    if(!document.querySelector('link[href*="Nunito"]')){
      const _fl=document.createElement("link");_fl.rel="stylesheet";
      _fl.href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap";
      document.head.appendChild(_fl);
    }
  },[]);

  const showToast=useCallback((msg,type="green")=>{setToast({msg,type});setTimeout(()=>setToast(null),2600);},[]);

  const showAchievement=useCallback((ach)=>{
    setAchToast(ach);
    setTimeout(()=>setAchToast(null),3000);
  },[]);

  useEffect(()=>{
    if(!supabase||_avatarsFetched)return;
    _avatarsFetched=true;
    Promise.all([
      supabase.from("avatar").select("*"),
      supabase.from("avatar_bgcolor").select("*"),
    ]).then(([avRes,bgRes])=>{
      if(avRes.data){
        const active=avRes.data.filter(a=>a.avatar_active).map(a=>({
          ...a,
          avatar_url:a.avatar_url?.startsWith("/")?a.avatar_url:`/${a.avatar_url}`,
        }));
        if(active.length)setAvatars(active);
      }
      if(bgRes.data&&bgRes.data.length){
        setAvatarBgcolors(bgRes.data.map(c=>({...c,avatar_bg_hex:c.avatar_bg_hex?.startsWith("#")?c.avatar_bg_hex:`#${c.avatar_bg_hex}`})));
      }
    }).catch(()=>showToast("Avatar load failed, using defaults","red"));
  },[showToast]);

  useEffect(()=>{
    if(!supabase)return;
    let itemsById={};
    supabase.from("item").select("*").then(({data,error})=>{
      if(error){console.warn("[ach] item fetch error",error);return;}
      console.log("[ach] item rows:",data?.length,"sample:",data?.[0]);
      if(data?.length)itemsById=Object.fromEntries(data.map(it=>[it.item_id,it]));
    });
    supabase.from("achievement").select("*").order("achievement_id").then(({data,error})=>{
      if(error){console.error("[ach] fetch error",error);return;}
      console.log("[ach] achievement rows:",data?.length,"sample:",data?.[0]);
      if(!data?.length){console.warn("[ach] no rows — check RLS/permissions on core.achievement");return;}
      const condByName=Object.fromEntries(ACHIEVEMENTS.map(a=>[a.name.toLowerCase().trim(),a]));
      const merged=data.map(row=>{
        const local=condByName[row.achievement_en?.toLowerCase().trim()];
        let reward;
        if(row.reward_type==="currency"){
          const isBagel=row.reward_currency_id===2;
          reward={
            type:isBagel?"bagel":"honeypot",
            amount:row.reward_qty,
            icon:isBagel?"/images/currency/bagel.png":"/images/currency/honeypot.png",
          };
        }else{
          const item=itemsById[row.reward_item_id];
          reward={
            name:item?.item_name_en??item?.item_name??"",
            icon:item?.item_image_url??item?.item_image??`/images/icon/item_${row.reward_item_id}.png`,
            rarity:item?.rarity??"Common",
            qty:row.reward_qty,
          };
        }
        return{
          id:local?.id??`ach_${row.achievement_id}`,
          name:row.achievement_en,
          desc:row.achievement_description,
          reward,
          cond:local?.cond??null,
        };
      });
      console.log("[ach] merged count:",merged.length);
      setAchievements(merged);
      achievementsRef.current=merged;
    });
  },[]);

  useEffect(()=>{
    const handler=()=>showToast("Storage full — oldest data may not be saved ⚠️","red");
    window.addEventListener("hs:storage-full",handler);
    return()=>window.removeEventListener("hs:storage-full",handler);
  },[showToast]);

  const setS=useCallback(upd=>{
    setS_raw(prev=>{
      const next=typeof upd==="function"?upd(prev):upd;
      const achs=achievementsRef.current;
      const newAchs=achs.filter(a=>!next.achievements.some(x=>x.id===a.id)&&a.cond?.(next)).map(a=>({id:a.id,unlockedAt:new Date().toISOString()}));
      let final=newAchs.length?{...next,achievements:[...next.achievements,...newAchs]}:next;
      if(newAchs.length){
        for(const e of newAchs){
          const a=achs.find(x=>x.id===e.id);
          if(a?.reward?.type==="honeypot")final={...final,currency:final.currency+(a.reward.amount||0)};
          else if(a?.reward?.type==="bagel")final={...final,bagels:final.bagels+(a.reward.amount||0)};
        }
      }
      save(final);
      if(newAchs.length){const a=achs.find(x=>x.id===newAchs[0].id);setTimeout(()=>showAchievement(a),700);}
      return final;
    });
  },[showAchievement]);

  const handleMyshopClick=useCallback(()=>{
    setTab("myshop");
    if(!myshopFlash){
      setMyshopFlash(true);
      setTimeout(()=>setMyshopFlash(false),1000);
    }
  },[myshopFlash]);

  const deleteRecord=useCallback(id=>setS(prev=>({...prev,records:prev.records.filter(r=>r.id!==id)})),[setS]);

  const updateRecord=useCallback(rec=>{
    setS(prev=>({...prev,records:prev.records.map(r=>r.id===rec.id?{...rec}:r)}));
    showToast("Entry updated!");
    setModal(null);setSelRec(null);
  },[setS,showToast]);

  const addRecord=useCallback(rec=>{
    const earned=rec.type==="cook"?80:50;
    const today=new Date().toDateString();
    const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
    const yesterdayStr=yesterday.toDateString();
    const newCount=S.records.length+1;
    const bagelBonus=newCount%5===0?1:0;
    setS(prev=>{
      const pNewCount=prev.records.length+1;
      const bonus=pNewCount%5===0?1:0;
      const newTagUsage={...prev.tagUsage};
      rec.tags?.forEach(t=>{newTagUsage[t]=(newTagUsage[t]||0)+1;});
      const consec=prev.lastDate===yesterdayStr;
      const newStreak=prev.lastDate===today?prev.streak:consec?prev.streak+1:1;
      return{...prev,
        records:[{...rec,id:Date.now(),earned,date:new Date().toISOString()},...prev.records],
        currency:prev.currency+earned,totalEarned:prev.totalEarned+earned,
        bagels:prev.bagels+bonus,totalBagels:prev.totalBagels+bonus,
        popularity:prev.popularity+(rec.type==="cook"?15:8),
        streak:newStreak,lastDate:today,tagUsage:newTagUsage,
      };
    });
    showToast(bagelBonus?`+${earned} 🍯  +1 🥯 bonus!`:`+${earned} 🍯 saved!`);
    setModal(null);
  },[S.records.length,setS,showToast]);

  const buyItem=useCallback(item=>{
    if(S.currency<item.price){showToast("Not enough Honeypot! 🍯","red");return;}
    if(S.owned.includes(item.id)){showToast("Already owned!","red");return;}
    setS(prev=>({...prev,currency:prev.currency-item.price,owned:[...prev.owned,item.id]}));
    showToast(`🛍️ ${item.name} purchased!`,"gold");
  },[S.currency,S.owned,setS,showToast]);

  const doGacha=useCallback((poolId,count=1)=>{
    const cost=GACHA_BAGEL_PRICE*count;
    if(S.bagels<cost){showToast("Not enough Bagels 🥯","red");return;}
    setGachaAnim(true);setGachaRes(null);
    setTimeout(()=>{
      const poolDef=GACHA_TABLE.find(p=>p.pool_id===poolId)||GACHA_TABLE[0];
      const gPool=poolDef.item_ids.map(id=>STORE_ITEMS.find(i=>i.id===id)).filter(Boolean);
      const rarityOrder=["Common","Rare","Epic","Legendary","Unique"];
      let bestItem=null;
      const pulledIds=[];
      for(let n=0;n<count;n++){
        const r=Math.random();
        const bucket=r<0.05?gPool.filter(i=>i.rarity==="Unique"||i.rarity==="Legendary"):r<0.25?gPool.filter(i=>i.rarity==="Legendary"||i.rarity==="Epic"):r<0.6?gPool.filter(i=>i.rarity==="Epic"||i.rarity==="Rare"):gPool.filter(i=>i.rarity==="Rare"||i.rarity==="Common");
        const safe=bucket.length?bucket:gPool;
        const item=safe[Math.floor(Math.random()*safe.length)];
        if(!bestItem||rarityOrder.indexOf(item.rarity)>rarityOrder.indexOf(bestItem.rarity))bestItem=item;
        pulledIds.push(item.id);
      }
      setGachaRes(count>1?{...bestItem,pullCount:count}:bestItem);
      setS(prev=>{
        const newOwned=[...prev.owned];
        pulledIds.forEach(id=>{if(!newOwned.includes(id))newOwned.push(id);});
        return {...prev,bagels:prev.bagels-cost,owned:newOwned};
      });
      setGachaAnim(false);
    },1300);
  },[S.bagels,setS,showToast]);

  const togglePlace=useCallback(id=>setS(prev=>({...prev,placed:prev.placed.includes(id)?prev.placed.filter(x=>x!==id):[...prev.placed,id]})),[setS]);
  const shopLv=useMemo(()=>Math.floor(S.popularity/100)+1,[S.popularity]);
  const shopLvLabel=useMemo(()=>{
    const lvLabels=["Apprentice Cook","Rising Chef","Local Favorite","Neighborhood Gem","Popular Spot","Food Icon","Legendary Eatery"];
    return lvLabels[Math.min(shopLv-1,6)];
  },[shopLv]);

  return(
    <div style={{fontFamily:"'Nunito',sans-serif",background:`linear-gradient(160deg,${T.aquaPale} 0%,${T.white} 50%,${T.pinkPale} 100%)`,height:"min(100dvh, 852px)",maxWidth:393,margin:"0 auto",position:"relative",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{width:0;}
        .content-scroll::-webkit-scrollbar{width:6px;}
        .content-scroll::-webkit-scrollbar-track{background:rgba(61,216,232,.08);border-radius:6px;margin:6px 0;}
        .content-scroll::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#3DD8E8,#FF6BAD);border-radius:6px;min-height:40px;}
        .content-scroll::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#1BB8CC,#E0508F);}
        .content-scroll{scrollbar-width:thin;scrollbar-color:#3DD8E8 rgba(61,216,232,.08);}
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
        @keyframes epicShimmer{0%,100%{box-shadow:0 0 8px 2px rgba(0,92,216,.35),inset 0 0 6px rgba(0,92,216,.1)}50%{box-shadow:0 0 22px 5px rgba(0,92,216,.7),inset 0 0 14px rgba(0,92,216,.25)}}
        @keyframes legendTrail{0%,100%{box-shadow:0 0 8px 2px rgba(136,34,212,.3),4px 4px 0 rgba(136,34,212,.12),8px 8px 0 rgba(136,34,212,.06)}50%{box-shadow:0 0 26px 6px rgba(136,34,212,.65),4px 4px 0 rgba(136,34,212,.28),10px 10px 0 rgba(136,34,212,.14)}}
        @keyframes uniqueSparkle{0%,100%{box-shadow:0 0 6px 2px rgba(216,106,0,.4),-4px -4px 8px rgba(216,106,0,.2),4px 4px 8px rgba(216,106,0,.2)}33%{box-shadow:5px -5px 14px 3px rgba(216,106,0,.65),-5px 5px 10px rgba(216,106,0,.35),0 0 4px rgba(216,106,0,.2)}66%{box-shadow:-5px -5px 14px 3px rgba(216,106,0,.65),5px 5px 10px rgba(216,106,0,.35),0 0 4px rgba(216,106,0,.2)}}
        .rarity-Epic{animation:epicShimmer 2s ease-in-out infinite;}
        .rarity-Legendary{animation:legendTrail 2s ease-in-out infinite;}
        .rarity-Unique{animation:uniqueSparkle 1.4s ease-in-out infinite;}
        @keyframes shopFlashAnim{0%{opacity:.7}100%{opacity:0}}
        @keyframes achSlideIn{0%{opacity:0;transform:translateX(-50%) translateY(-110%)}60%{transform:translateX(-50%) translateY(6px)}80%{transform:translateX(-50%) translateY(-3px)}100%{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes achSlideOut{0%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(-110%)}}
        @keyframes achShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes bagelPulse{0%,100%{box-shadow:0 0 0 4px #FFE0A0,0 0 0 8px #E8935A55,0 6px 20px rgba(200,100,20,.5)}50%{box-shadow:0 0 0 6px #FFE0A0,0 0 0 11px #E8935A77,0 8px 28px rgba(200,100,20,.7)}}
      `}</style>

      {/* BACKGROUND SPARKLES */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        {[[8,12,1.1,0],[85,8,.7,.6],[70,38,.9,1.2],[15,55,.6,.3],[90,62,1,.9],[40,72,.5,1.5]].map(([l,t,sc,d],i)=>(
          <div key={i} style={{position:"absolute",left:`${l}%`,top:`${t}%`,fontSize:14*sc,animation:`sparkle 2.8s ${d}s ease-in-out infinite`,color:i%2===0?T.aqua:T.pink,opacity:.28}}>✦</div>
        ))}
      </div>

      {/* SHOP FLASH OVERLAY */}
      {myshopFlash&&(
        <div style={{position:"fixed",inset:0,zIndex:98,pointerEvents:"none",
          background:"radial-gradient(ellipse at 50% 100%, rgba(255,200,60,.55) 0%, rgba(255,150,30,.25) 40%, rgba(255,200,60,0) 70%)",
          animation:"shopFlashAnim 1s ease-out forwards"}}/>
      )}

      <AchievementToast achievement={achToast}/>
      {toast&&<div style={{position:"fixed",top:76,left:"50%",transform:"translateX(-50%)",background:toast.type==="red"?"#FF6B8A":`linear-gradient(135deg,${T.aqua},${T.aquaDark})`,color:"#fff",padding:"10px 22px",borderRadius:28,fontWeight:800,fontSize:13,zIndex:9999,animation:"floatUp 2.5s forwards",whiteSpace:"nowrap",boxShadow:`0 6px 24px rgba(61,216,232,.3)`}}>{toast.msg}</div>}

      {/* HEADER */}
      <div style={{flexShrink:0,zIndex:100,padding:"10px 13px 8px",background:"rgba(255,255,255,.85)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.aquaLight}`}}>
        {/* Row 1: Avatar + Name + Currencies */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
          <button onClick={()=>setShowProfile(true)} style={{width:60,height:60,borderRadius:"50%",background:S.profile.avatarBgHex||`linear-gradient(135deg,${T.aquaLight},${T.pinkLight})`,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${T.white}`,boxShadow:`0 2px 8px ${T.aquaLight}`,flexShrink:0,overflow:"hidden",padding:0}}>
            {S.profile.avatarUrl?<img src={S.profile.avatarUrl} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:17}}>👤</span>}
          </button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:900,fontSize:16,color:T.textDark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.1}}>{S.profile.nickname}</div>
            <div style={{fontSize:13,color:T.textMid,fontWeight:700}}>Lv.{shopLv} · {shopLvLabel}</div>
          </div>
          <div style={{background:`linear-gradient(135deg,${T.goldLight},#FFD060)`,borderRadius:18,padding:"4px 9px",display:"flex",alignItems:"center",gap:3,boxShadow:"0 2px 6px rgba(255,184,48,.28)",flexShrink:0}}>
            <img src={CURRENCY.honeypot.icon} style={{width:22,height:22,objectFit:"contain"}}/><span style={{fontWeight:900,fontSize:13,color:"#A06000"}}>{S.currency}</span>
          </div>
          <div style={{background:"linear-gradient(135deg,#FFE8D0,#FFCFA0)",borderRadius:18,padding:"4px 9px",display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
            <img src={CURRENCY.bagel.icon} style={{width:22,height:22,objectFit:"contain"}}/><span style={{fontWeight:900,fontSize:13,color:"#904000"}}>{S.bagels}</span>
          </div>
        </div>
        {/* Row 2: XP bar */}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
            <span style={{fontSize:12,color:T.textLight,fontWeight:800}}>XP</span>
            <span style={{fontSize:12,color:T.textLight,fontWeight:800}}>{S.popularity%100}/100</span>
          </div>
          <div style={{background:T.aquaPale,borderRadius:6,height:10,overflow:"hidden"}}>
            <div style={{width:`${S.popularity%100}%`,background:`linear-gradient(90deg,${T.aqua},${T.pink})`,height:"100%",transition:"width .5s"}}/>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content-scroll" style={{flex:1,overflowY:"scroll",WebkitOverflowScrolling:"touch",paddingBottom:80,position:"relative",zIndex:1}}>
        {tab==="journal"    && <JournalTab    S={S} onAdd={()=>setModal("add")} onSel={r=>{setSelRec(r);setModal("record");}} onDelete={deleteRecord}/>}
        {tab==="fridge"     && <FridgeTab     S={S} setS={setS} showToast={showToast}/>}
        {tab==="myshop"     && <ShopTab       S={S} onToggle={togglePlace} shopLv={shopLv} shopLvLabel={shopLvLabel} setS={setS} showToast={showToast}/>}
        {tab==="store"      && <StoreTab      S={S} onGacha={(poolId,count=1)=>{setGachaRes(null);setModal({type:"gacha",poolId,count});}} onBuy={buyItem}/>}
        {tab==="collection" && <CollectionTab S={S} achievements={achievements}/>}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,width:"100%",background:"rgba(255,255,255,.93)",backdropFilter:"blur(20px)",borderTop:`1px solid ${T.aquaLight}`,display:"flex",justifyContent:"space-around",alignItems:"center",padding:"9px 0 14px",zIndex:100}}>
        {[{id:"journal",icon:"/images/icon/journal.png",activeIcon:"/images/icon/journal_click.png"},
        {id:"fridge",icon:"/images/icon/fridge.png",activeIcon:"/images/icon/fridge_click.png"},
        {id:"myshop",icon:"/images/icon/myshop.png",activeIcon:"/images/icon/myshop_click.png"},
        {id:"store",icon:"/images/icon/store.png",activeIcon:"/images/icon/store_click.png"},
        {id:"collection",icon:"/images/icon/achievement.png",activeIcon:"/images/icon/achievement_click.png"}].map(n=>{
          if(n.id==="myshop"){
            return(
              <button key="myshop" onClick={handleMyshopClick}
                style={{
                  background:"radial-gradient(circle at 48% 38%, #FFD080 0%, #FF9A40 30%, #C06020 58%, #E8804A 78%, #FFD080 100%)",
                  border:"3px solid #A04818",
                  borderRadius:"50%",
                  width:58,height:58,
                  display:"flex",flexDirection:"column",
                  alignItems:"center",justifyContent:"center",
                  fontSize:26,
                  animation:"bagelPulse 2.4s ease-in-out infinite",
                  flexShrink:0,
                  position:"relative",
                  boxShadow:"inset 0 2px 4px rgba(255,220,120,.6), inset 0 -2px 4px rgba(140,60,10,.4)",
                }}>
                <img src={tab===n.id&&n.activeIcon?n.activeIcon:n.icon}
                alt={n.id}
                style={{width:56,height:56,objectFit:"contain",filter:"drop-shadow(0 1px 2px rgba(0,0,0,.3))"}}/>
                {tab==="myshop"&&<div style={{position:"absolute",bottom:-6,width:5,height:5,borderRadius:"50%",background:`linear-gradient(135deg,${T.gold},${T.honey})`}}/>}
              </button>
            );
          }
          return(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{background:tab===n.id?T.aquaPale:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:56,height:46,borderRadius:18,transition:"all .18s",boxShadow:tab===n.id?`0 2px 12px rgba(61,216,232,.32)`:"none"}}>
              <img src={tab===n.id&&n.activeIcon?n.activeIcon:n.icon} alt={n.id} style={{width:48,height:48,objectFit:"contain",filter:tab===n.id?"none":"grayscale(.4)",opacity:tab===n.id?1:.38}}/>
              {tab===n.id&&<div style={{width:5,height:5,borderRadius:"50%",background:`linear-gradient(135deg,${T.aqua},${T.pink})`,marginTop:2}}/>}
            </button>
          );
        })}
      </div>

      {modal==="add"         && <AddModal    S={S} onClose={()=>setModal(null)} onSubmit={addRecord}/>}
      {modal==="edit"        && selRec && <AddModal S={S} onClose={()=>{setModal(null);setSelRec(null);}} onSubmit={updateRecord} editRecord={selRec}/>}
      {modal?.type==="gacha" && <GachaModal  S={S} onClose={()=>setModal(null)} onGacha={()=>doGacha(modal.poolId,modal.count||1)} result={gachaRes} anim={gachaAnim} setResult={setGachaRes} pullCount={modal.count||1}/>}
      {modal==="record"      && selRec && <RecordModal record={selRec} onClose={()=>setModal(null)} onEdit={r=>{setSelRec(r);setModal("edit");}} nickname={S.profile.nickname}/>}
      {showProfile           && <ProfileModal S={S} setS={setS} onClose={()=>setShowProfile(false)} showToast={showToast} avatars={avatars} bgcolors={avatarBgcolors}/>}
      <DevPanel showAchievement={showAchievement} showToast={showToast} setS={setS} achievements={achievements}/>
    </div>
  );
}
