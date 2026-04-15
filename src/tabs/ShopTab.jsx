import { useState, useRef, useEffect } from "react";
import { T, CURRENCY, STORE_ITEMS, RARITY, NPC_LINES, NPC_AVATARS } from "../constants";

export default function ShopTab({S,onToggle,shopLv,shopLvLabel,setS,showToast}){
  const [view,setView]=useState("furniture");
  const placed=STORE_ITEMS.filter(i=>S.placed.includes(i.id));
  const [npcDialogue,setNpcDialogue]=useState(null);
  const dialogueRef=useRef(null);

  useEffect(()=>()=>clearTimeout(dialogueRef.current),[]);

  const handleNpcClick=(npc)=>{
    const text=NPC_LINES[Math.floor(Math.random()*NPC_LINES.length)];
    setNpcDialogue({npcId:npc.id,text});
    clearTimeout(dialogueRef.current);
    dialogueRef.current=setTimeout(()=>setNpcDialogue(null),2200);
  };

  return(
    <div style={{padding:"13px 14px 0",animation:"fadeSlide .3s ease"}}>
      <div style={{background:`linear-gradient(160deg,${T.aquaPale},${T.white},${T.pinkPale})`,border:`2px solid ${T.aquaLight}`,borderRadius:22,overflow:"hidden",marginBottom:12,boxShadow:`0 6px 28px rgba(61,216,232,.1)`}}>
        <div style={{padding:"12px 15px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:900,fontSize:15,color:T.textDark}}>{S.shopName}</div><div style={{fontSize:11,fontWeight:700,color:T.aquaDark}}>⭐ Lv.{shopLv} · {shopLvLabel}</div></div>
          <div style={{background:`linear-gradient(135deg,${T.aquaLight},${T.pinkLight})`,borderRadius:13,padding:"4px 10px"}}><span style={{fontSize:11,fontWeight:800,color:T.textDark}}>Pop. {S.popularity}</span></div>
        </div>
        <div style={{background:"linear-gradient(180deg,rgba(232,251,253,.7),rgba(255,240,247,.5))",margin:"0 11px",borderRadius:16,height:150,position:"relative",border:`1.5px dashed ${T.aquaLight}`,overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 38px,${T.aquaLight}40 38px,${T.aquaLight}40 39px),repeating-linear-gradient(90deg,transparent,transparent 38px,${T.aquaLight}40 38px,${T.aquaLight}40 39px)`,borderRadius:16,pointerEvents:"none"}}/>
          {placed.length>0&&<div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 30%,${placed[0]?.item_col||T.aqua}14,transparent 60%)`,pointerEvents:"none"}}/>}
          <div style={{display:"flex",gap:7,padding:"8px 10px",flexWrap:"wrap",position:"relative"}}>
            {placed.slice(0,8).map(item=><div key={item.id} style={{width:32,height:32,background:`${item.item_col}18`,border:`1px dashed ${item.item_col}55`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{item.emoji}</div>)}
          </div>
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

function PeopleView({S,setS,showToast}){
  const [adding,setAdding]=useState(false);
  const [npcForm,setNpcForm]=useState({name:"",avatarEmoji:"👦"});
  const addNpc=()=>{
    if(!npcForm.name.trim())return;
    setS(prev=>({...prev,npcs:[...prev.npcs,{id:Date.now(),name:npcForm.name,avatarEmoji:npcForm.avatarEmoji,dialogue:NPC_LINES.slice(0,4)}]}));
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
      {[["📓","Logs",S.records.length,T.aquaDark],["🍳","Home",S.records.filter(r=>r.type==="cook").length,T.pink],["🍽️","Dining",S.records.filter(r=>r.type==="dine").length,T.purple],["🎒","Owned",S.owned.length,T.gold],[null,"Earned",S.totalEarned,T.honey],["⭐","Pop.",S.popularity,T.aquaDark]].map(([ic,label,val,col])=>(
        <div key={label} style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:15,padding:"11px 12px"}}>
          <div style={{fontSize:19,marginBottom:3}}>{ic?ic:<img src={CURRENCY.honeypot.icon} style={{width:19,height:19,objectFit:"contain"}}/>}</div><div style={{fontWeight:900,fontSize:18,color:col}}>{val}</div><div style={{color:T.textLight,fontSize:10,fontWeight:700}}>{label}</div>
        </div>
      ))}
    </div>
  </div>;
}
