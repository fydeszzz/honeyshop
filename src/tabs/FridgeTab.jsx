import { useState, useMemo } from "react";
import { T } from "../constants";

const FRIDGE_EMOJIS=["🥩","🥚","🥦","🧅","🧄","🥕","🍅","🫚","🥛","🧀","🐟","🍗","🥬","🌽","🍋","🫙","🧈","🥜","🌾","🍄"];

export default function FridgeTab({S,setS,showToast}){
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState({name:"",emoji:"🥩",qty:1,expiry:""});
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));
  const addIng=()=>{if(!form.name.trim())return;setS(prev=>({...prev,fridge:[...prev.fridge,{id:Date.now(),...form}]}));showToast(`${form.emoji} ${form.name} added!`);setAdding(false);setForm({name:"",emoji:"🥩",qty:1,expiry:""});};
  const removeIng=id=>setS(prev=>({...prev,fridge:prev.fridge.filter(i=>i.id!==id)}));
  const chgQty=(id,d)=>setS(prev=>({...prev,fridge:prev.fridge.map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+d)}:i).filter(i=>i.qty>0)}));
  const today=new Date();
  const expiringSoon=useMemo(()=>{
    const now=new Date();
    return S.fridge.filter(i=>i.expiry&&(new Date(i.expiry)-now)/(1000*60*60*24)<=3);
  },[S.fridge]);
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
