import { T, INGREDIENTS, CUISINE_TAGS, mealIcon } from "../constants";

export default function RecordModal({record,onClose}){
  const d=new Date(record.date);
  const dateStr=`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,"0")}`;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(180,230,245,.5)",backdropFilter:"blur(16px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
      <div style={{background:T.white,borderRadius:24,padding:"20px 18px",width:"100%",maxWidth:355,border:`2px solid ${T.aquaLight}`,boxShadow:`0 22px 58px rgba(61,216,232,.16)`,maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontWeight:900,fontSize:14,color:T.textDark}}>Entry Details</div>
          <button onClick={onClose} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:14,fontWeight:800}}>×</button>
        </div>
        {record.photos?.length>0&&<div style={{display:"flex",gap:5,marginBottom:12,overflowX:"auto"}}>{record.photos.map((p,i)=><div key={i} style={{width:72,height:72,borderRadius:12,overflow:"hidden",flexShrink:0,border:`2px solid ${T.aquaLight}`}}><img src={p.preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>)}</div>}
        <div style={{textAlign:"center",marginBottom:12}}>
          <div style={{fontSize:52,marginBottom:4,height:60,display:"flex",alignItems:"center",justifyContent:"center"}}>{record.emoji?<span style={{fontSize:52}}>{record.emoji}</span>:<img src="/images/icon/plate.png" style={{width:60,height:60,objectFit:"contain"}}/>}</div>
          <div style={{fontWeight:900,fontSize:17,color:T.textDark,marginBottom:2}}>{record.title}</div>
          {record.address&&<div style={{color:T.textMid,fontWeight:700,fontSize:12}}>📍 {record.address}</div>}
          {record.rating>0&&<div style={{color:T.gold,fontSize:16,marginTop:2}}>{"★".repeat(record.rating)}{"☆".repeat(5-record.rating)}</div>}
        </div>
        <div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:"9px 12px",marginBottom:9}}>
          {[["Type",record.type==="cook"?"🍳 Home Cooked":"🍽️ Dining"],["Meal",`${mealIcon[record.mealTime?.split(" · ")[0]]||""} ${record.mealTime||""}`],["Date",dateStr],["Earned",null]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.aquaLight}`}}>
              <span style={{color:T.textLight,fontSize:12,fontWeight:700}}>{k}</span>
              <span style={{color:T.textDark,fontSize:12,fontWeight:700,display:"inline-flex",alignItems:"center",gap:3}}>{k==="Earned"?<>+{record.earned} <img src="/images/currency/honeypot.png" style={{width:13,height:13,objectFit:"contain"}}/></>:v}</span>
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
