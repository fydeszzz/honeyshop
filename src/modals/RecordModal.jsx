import { useRef, useState } from "react";
import { T } from "../constants";
import Lightbox from "../components/Lightbox";

export default function RecordModal({record,onClose,onEdit,nickname}){
  const cardRef=useRef(null);
  const [saving,setSaving]=useState(false);
  const [lightbox,setLightbox]=useState(null);
  const d=new Date(record.date);
  const dateStr=`${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  const isCook=record.type==="cook";
  const categoryLabel=isCook?"Recipe":"Review";
  const accentColor=isCook?"#E65100":"#2E7D32";
  const accentBorder=isCook?"#FFB74D":"#81C784";
  const accentBg=isCook?"#FFF3E0":"#E8F5E9";

  const handleSave=async()=>{
    if(!cardRef.current||saving)return;
    setSaving(true);
    try{
      const html2canvas=(await import("html2canvas")).default;
      const canvas=await html2canvas(cardRef.current,{
        backgroundColor:"#ffffff",
        scale:2,
        useCORS:true,
        allowTaint:true,
        logging:false,
      });
      const blob=await new Promise(res=>canvas.toBlob(res,"image/png"));
      const fileName=`${nickname?nickname+"_":""}${categoryLabel}_${record.title.replace(/\s+/g,"_")}.png`;
      if(navigator.canShare&&navigator.canShare({files:[new File([blob],fileName,{type:"image/png"})]})){
        await navigator.share({files:[new File([blob],fileName,{type:"image/png"})],title:fileName});
      } else {
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a");
        a.href=url;a.download=fileName;a.click();
        setTimeout(()=>URL.revokeObjectURL(url),1000);
      }
    } catch(e){
      console.error("Save failed",e);
    } finally {
      setSaving(false);
    }
  };

  return(<>
    <div style={{position:"fixed",inset:0,background:"rgba(180,230,245,.5)",backdropFilter:"blur(16px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
      <div ref={cardRef} style={{background:T.white,borderRadius:24,padding:"20px 18px",width:"100%",maxWidth:355,border:`2px solid ${accentBorder}`,boxShadow:`0 22px 58px rgba(61,216,232,.16)`,maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontWeight:900,fontSize:14,color:accentColor}}>{nickname?`${nickname}'s ${categoryLabel}`:categoryLabel}</div>
          <button onClick={onClose} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:14,fontWeight:800}}>×</button>
        </div>
        {record.photos?.length>0&&<div style={{display:"flex",gap:5,marginBottom:12,overflowX:"auto"}}>{record.photos.map((p,i)=><div key={i} onClick={()=>setLightbox(p.preview)} style={{width:72,height:72,borderRadius:12,overflow:"hidden",flexShrink:0,border:`2px solid ${accentBorder}`,cursor:"zoom-in"}}><img src={p.preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>)}</div>}
        <div style={{marginBottom:12}}>
          <div style={{fontWeight:900,fontSize:17,color:T.textDark,marginBottom:2}}>{record.title}</div>
          {record.address&&<div style={{display:"flex",alignItems:"center",gap:3,color:T.textMid,fontWeight:700,fontSize:12}}><img src="/images/icon/pin.png" style={{width:13,height:13,objectFit:"contain",flexShrink:0}}/>{record.address}</div>}
          {isCook&&record.rating>0&&<div style={{color:T.gold,fontSize:16,marginTop:2}}>{"★".repeat(record.rating)}{"☆".repeat(5-record.rating)}</div>}
        </div>
        <div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:"9px 12px",marginBottom:9}}>
          {[["Type",categoryLabel],["Meal",record.mealTime||"—"],["Date",dateStr]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.aquaLight}`}}>
              <span style={{color:T.textLight,fontSize:12,fontWeight:700}}>{k}</span>
              <span style={{color:k==="Type"?accentColor:T.textDark,fontSize:12,fontWeight:700}}>{v}</span>
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
        {(record.tagLabels||record.tags)?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:9}}>{(record.tagLabels||record.tags).map(t=><span key={t} style={{background:accentBg,border:`1px solid ${accentBorder}`,borderRadius:8,padding:"2px 7px",color:accentColor,fontSize:11,fontWeight:700}}>#{t}</span>)}</div>}
        <div style={{display:"flex",gap:8,marginTop:4}}>
          <button onClick={()=>onEdit(record)} style={{flex:1,background:"#E8F8F0",border:"1.5px solid #4CAF82",borderRadius:12,padding:"10px 0",color:"#2E7D52",fontSize:13,fontWeight:800,cursor:"pointer"}}>Edit</button>
          <button onClick={handleSave} disabled={saving} style={{flex:1,background:T.aquaPale,border:`1.5px solid ${T.aquaDark}`,borderRadius:12,padding:"10px 0",color:T.aquaDark,fontSize:13,fontWeight:800,cursor:saving?"default":"pointer",opacity:saving?.7:1}}>
            {saving?"Saving…":"Save"}
          </button>
        </div>
      </div>
    </div>
    {lightbox&&<Lightbox src={lightbox} onClose={()=>setLightbox(null)}/>}
  </>);
}
