import { T } from "../constants";

export default function RecordModal({record,onClose,onEdit}){
  const d=new Date(record.date);
  const dateStr=`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,"0")}`;
  const isCook=record.type==="cook";
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(180,230,245,.5)",backdropFilter:"blur(16px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
      <div style={{background:T.white,borderRadius:24,padding:"20px 18px",width:"100%",maxWidth:355,border:`2px solid ${T.aquaLight}`,boxShadow:`0 22px 58px rgba(61,216,232,.16)`,maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontWeight:900,fontSize:14,color:T.textDark}}>Entry Details</div>
          <button onClick={onClose} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:14,fontWeight:800}}>×</button>
        </div>
        {record.photos?.length>0&&<div style={{display:"flex",gap:5,marginBottom:12,overflowX:"auto"}}>{record.photos.map((p,i)=><div key={i} style={{width:72,height:72,borderRadius:12,overflow:"hidden",flexShrink:0,border:`2px solid ${T.aquaLight}`}}><img src={p.preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>)}</div>}
        <div style={{marginBottom:12}}>
          <div style={{fontWeight:900,fontSize:17,color:T.textDark,marginBottom:2}}>{record.title}</div>
          {record.address&&<div style={{color:T.textMid,fontWeight:700,fontSize:12}}>📍 {record.address}</div>}
          {record.rating>0&&<div style={{color:T.gold,fontSize:16,marginTop:2}}>{"★".repeat(record.rating)}{"☆".repeat(5-record.rating)}</div>}
        </div>
        <div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:"9px 12px",marginBottom:9}}>
          {[["Type",isCook?"Home Cooked":"Dining Out"],["Meal",record.mealTime||"—"],["Date",dateStr]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.aquaLight}`}}>
              <span style={{color:T.textLight,fontSize:12,fontWeight:700}}>{k}</span>
              <span style={{color:T.textDark,fontSize:12,fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
        {record.ingredients?.length>0&&<div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:"9px 12px",marginBottom:9}}>
          <div style={{color:T.aquaDark,fontWeight:800,fontSize:11,marginBottom:5}}>Ingredients</div>
          <div style={{background:T.white,border:`1px solid ${T.aquaLight}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{display:"flex",background:T.aquaPale,padding:"3px 8px",borderBottom:`1px solid ${T.aquaLight}`}}>
              <span style={{flex:1,fontSize:10,fontWeight:800,color:T.aquaDark}}>Ingredient</span>
              <span style={{width:110,fontSize:10,fontWeight:800,color:T.aquaDark}}>Unit</span>
            </div>
            {record.ingredients.map(id=>{
              const meta=record._ingMeta?.[id];
              const srv=record.servings?.[id];
              return(
                <div key={id} style={{display:"flex",alignItems:"center",padding:"5px 8px",borderBottom:`1px solid ${T.aquaLight}44`}}>
                  <span style={{flex:1,fontSize:12,fontWeight:700,color:T.textDark}}>{meta?.name||id}</span>
                  <span style={{width:110,fontSize:12,fontWeight:600,color:T.textMid}}>{srv?.qty||"—"}{srv?.unit?` ${srv.unit}`:""}</span>
                </div>
              );
            })}
          </div>
        </div>}
        {record.notes&&<div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:"9px 12px",marginBottom:9}}>
          <div style={{color:T.aquaDark,fontWeight:800,fontSize:11,marginBottom:4}}>Notes</div>
          <div style={{color:T.textMid,fontSize:13,fontWeight:600,lineHeight:1.55}}>{record.notes}</div>
        </div>}
        {(record.tagLabels||record.tags)?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:9}}>{(record.tagLabels||record.tags).map(t=><span key={t} style={{background:T.aquaPale,border:`1px solid ${T.aquaLight}`,borderRadius:8,padding:"2px 7px",color:T.aquaDark,fontSize:11,fontWeight:700}}>#{t}</span>)}</div>}
        <div style={{display:"flex",gap:8,marginTop:4}}>
          <button onClick={()=>onEdit(record)} style={{flex:1,background:"#E8F8F0",border:"1.5px solid #4CAF82",borderRadius:12,padding:"10px 0",color:"#2E7D52",fontSize:13,fontWeight:800,cursor:"pointer"}}>Edit</button>
          <button onClick={onClose} style={{flex:1,background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:12,padding:"10px 0",color:T.textMid,fontSize:13,fontWeight:800,cursor:"pointer"}}>Close</button>
        </div>
      </div>
    </div>
  );
}
