import { useState } from "react";
import { T, RARITY } from "../constants";
import { fmtDate } from "../state";

export default function CollectionTab({S,achievements}){
  const [sub,setSub]=useState("achievements");
  const [collectionClicked,setCollectionClicked]=useState(false);
  const [activeReward,setActiveReward]=useState(null);
  const done=S.achievements.filter(a=>typeof a==="object");
  const undone=achievements.filter(a=>!S.achievements.some(x=>x.id===a.id));
  return(
    <div style={{padding:"13px 14px",animation:"fadeSlide .3s ease"}}>
      <div style={{display:"flex",gap:8,marginBottom:13}}>
        {[["achievements","Achievements"],["collection","Collection"]].map(([id,label])=>(
          <button key={id} onClick={()=>{if(id==="collection"){setCollectionClicked(true);setTimeout(()=>setCollectionClicked(false),2000);}else setSub(id);}} style={{flex:1,background:sub===id&&id!=="collection"?`linear-gradient(135deg,${T.aqua},${T.pink})`:id==="collection"?T.snow:T.white,border:sub===id&&id!=="collection"?"none":`2px solid ${T.aquaLight}`,borderRadius:16,padding:"8px",color:sub===id&&id!=="collection"?T.white:id==="collection"?T.textLight:T.textMid,fontSize:13,fontWeight:800,opacity:id==="collection"?0.55:1,transition:"all .18s"}}>{label}{id==="collection"&&" 🔒"}</button>
        ))}
      </div>
      {sub==="achievements"&&<>
        <div style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:18,padding:"11px 14px",marginBottom:11}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontWeight:800,color:T.textDark,fontSize:13}}>Progress</span><span style={{fontWeight:700,color:T.textMid,fontSize:13}}>{done.length}/{achievements.length}</span></div>
          <div style={{background:T.aquaPale,borderRadius:8,height:9,overflow:"hidden"}}><div style={{width:`${(done.length/achievements.length)*100}%`,background:`linear-gradient(90deg,${T.aqua},${T.pink})`,height:"100%",transition:"width .5s"}}/></div>
        </div>

        {done.length>0&&<>
          <div style={{fontWeight:800,color:"#B07000",fontSize:12,marginBottom:7}}>✅ Unlocked ({done.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:11}}>
            {done.map(achObj=>{
              const a=achievements.find(x=>x.id===achObj.id);if(!a)return null;
              const isCurrency=a.reward?.type==="honeypot"||a.reward?.type==="bagel";
              const R=RARITY[a.reward?.rarity||"Common"];
              return(
                <div key={achObj.id} style={{background:"linear-gradient(135deg,#fff9e6,#fff3cc)",border:"1.5px solid rgba(255,200,60,0.55)",borderRadius:17,padding:"14px 11px 12px",position:"relative",textAlign:"center",boxShadow:"0 2px 8px rgba(200,140,0,0.10)"}}>
                  <div style={{position:"absolute",top:7,right:9,fontSize:9,fontWeight:800,color:"#B07000",fontFamily:"'Nunito',sans-serif"}}>{fmtDate(achObj.unlockedAt)}</div>
                  <button onClick={()=>setActiveReward({...a.reward,rarity:a.reward?.rarity||"Common",achName:a.name,unlockedAt:achObj.unlockedAt})}
                    style={{width:52,height:52,borderRadius:"50%",border:`2.5px solid ${isCurrency?"#FFB830":R.border}`,
                      background:isCurrency?"#FFF8DC":R.bg,display:"flex",alignItems:"center",justifyContent:"center",
                      cursor:"pointer",boxShadow:`0 4px 16px ${isCurrency?"#FFB83055":R.border+"55"}`,
                      margin:"0 auto 10px",overflow:"hidden",padding:0}}>
                    <img src={a.reward?.icon} alt={a.reward?.name||a.reward?.type||""} style={{width:"78%",height:"78%",objectFit:"contain"}}/>
                  </button>
                  <div style={{fontWeight:900,fontSize:12,color:"#5A3000",marginBottom:3,lineHeight:1.3,fontFamily:"'Nunito',sans-serif"}}>{a.name}</div>
                  <div style={{fontSize:10,color:"#9A6020",fontWeight:600,lineHeight:1.4,marginBottom:6,fontFamily:"'Nunito',sans-serif"}}>{a.desc}</div>
                </div>
              );
            })}
          </div>
        </>}

        {undone.length>0&&<>
          <div style={{fontWeight:800,color:T.textLight,fontSize:12,marginBottom:7}}>🔒 Locked ({undone.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {undone.map(a=>{
              return(
                <div key={a.id} style={{background:"#F5F5F5",border:"1.5px solid #E0E0E0",borderRadius:17,padding:"14px 11px 12px",opacity:.55,textAlign:"center"}}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:"#E8E8E8",border:"2px solid #BDBDBD",
                    display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",
                    margin:"0 auto 10px",filter:"grayscale(1)"}}>
                    {a.reward?.icon&&<img src={a.reward.icon} alt="" style={{width:"78%",height:"78%",objectFit:"contain",opacity:.6}}/>}
                  </div>
                  <div style={{fontWeight:900,fontSize:12,color:"#5A3000",marginBottom:3,lineHeight:1.3,fontFamily:"'Nunito',sans-serif"}}>{a.name}</div>
                  <div style={{fontSize:10,color:"#9A6020",fontWeight:600,lineHeight:1.4,fontFamily:"'Nunito',sans-serif"}}>{a.desc}</div>
                </div>
              );
            })}
          </div>
        </>}
      </>}

      {/* Reward popup */}
      {activeReward&&(
        <div onClick={()=>setActiveReward(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.white,borderRadius:24,padding:"26px 22px",minWidth:220,textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,.2)",animation:"popIn .3s ease"}}>
            <div style={{fontSize:54,marginBottom:8,display:"flex",justifyContent:"center"}}><img src={activeReward.icon} alt={activeReward.name||activeReward.type||""} style={{width:64,height:64,objectFit:"contain"}}/></div>
            {(activeReward.type==="honeypot"||activeReward.type==="bagel")?(
              <div style={{fontWeight:900,fontSize:22,color:"#5A3000",marginBottom:10}}>×{activeReward.amount}</div>
            ):(
              <>
                <div style={{fontWeight:900,fontSize:16,color:T.textDark,marginBottom:4}}>{activeReward.name}</div>
                <div style={{display:"inline-block",background:RARITY[activeReward.rarity||"Common"].bg,border:`2px solid ${RARITY[activeReward.rarity||"Common"].border}`,borderRadius:10,padding:"3px 14px",color:RARITY[activeReward.rarity||"Common"].col,fontWeight:800,fontSize:12,marginBottom:10}}>
                  {activeReward.rarity||"Common"}
                </div>
              </>
            )}
            <div style={{color:"#B07000",fontSize:12,fontWeight:600,marginBottom:16}}>Activated: {fmtDate(activeReward.unlockedAt)}</div>
            <button onClick={()=>setActiveReward(null)} style={{background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:14,padding:"10px 28px",color:T.white,fontSize:13,fontWeight:900}}>Got it!</button>
          </div>
        </div>
      )}
    </div>
  );
}
