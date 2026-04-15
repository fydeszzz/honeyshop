import { T, CURRENCY, mealIcon } from "../constants";

export default function JournalTab({S,onAdd,onSel}){
  return(
    <div style={{animation:"fadeSlide .3s ease",paddingTop:10}}>
      {S.records.length===0?<EmptyJournal onAdd={onAdd}/>:(
        <div style={{padding:"0 14px"}}>{S.records.map(r=><RecordCard key={r.id} record={r} onClick={()=>onSel(r)}/>)}</div>
      )}
      <button onClick={onAdd} style={{position:"absolute",bottom:90,right:16,width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${T.aqua},${T.aquaDark})`,border:"none",boxShadow:`0 6px 22px ${T.aquaLight}`,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <img src="/images/icon/spatula.png" style={{width:30,height:30,objectFit:"contain",filter:"brightness(0) invert(1)"}}/>
      </button>
    </div>
  );
}

function EmptyJournal({onAdd}){
  return(
    <div style={{padding:"28px 22px",textAlign:"center",animation:"fadeSlide .4s ease"}}>
      <img src="/images/icon/plate.png" style={{width:88,height:88,objectFit:"contain",animation:"drift 3s ease-in-out infinite",display:"block",margin:"0 auto 10px"}}/>
      <div style={{fontWeight:900,fontSize:21,color:T.textDark,marginBottom:8}}>Your journal is empty!</div>
      <div style={{color:T.textMid,fontSize:14,fontWeight:600,lineHeight:1.65,marginBottom:18}}>Log your first dish or dining experience<br/>and start your food adventure ✦</div>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`linear-gradient(135deg,${T.goldLight},#FFE880)`,borderRadius:22,padding:"8px 20px",marginBottom:20,boxShadow:"0 4px 14px rgba(255,184,48,.22)"}}>
        <img src={CURRENCY.honeypot.icon} style={{width:20,height:20,objectFit:"contain"}}/><span style={{fontWeight:800,fontSize:13,color:"#A06000"}}>New entry earns +50 Honeypot</span>
      </div><br/>
      <button onClick={onAdd} style={{background:`linear-gradient(135deg,${T.pink},${T.purple})`,border:"none",borderRadius:25,padding:"5px 40px",color:T.white,fontSize:16,fontWeight:900,boxShadow:`0 6px 22px ${T.pinkLight}`,display:"inline-flex",alignItems:"center",gap:10}}>
        <img src="/images/icon/spatula_click.png" style={{width:48,height:48,objectFit:"contain"}}/>
        Add First Entry
      </button>
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
            <span style={{background:isCook?`${T.aqua}22`:`${T.pink}22`,border:`1px solid ${isCook?T.aquaLight:T.pinkLight}`,borderRadius:10,padding:"2px 8px",color:isCook?T.aquaDark:T.pinkDark,fontSize:11,fontWeight:700}}>{isCook?"🍳 Home":<span style={{display:"inline-flex",alignItems:"center",gap:3}}><img src="/images/icon/plate.png" style={{width:13,height:13,objectFit:"contain",verticalAlign:"middle"}}/>Dining</span>}</span>
            <span style={{color:T.textLight,fontSize:11,fontWeight:600}}>{mealIcon[record.mealTime?.split(" · ")[0]]||""} {record.mealTime}</span>
          </div>
          <div style={{fontWeight:800,fontSize:15,color:T.textDark,marginBottom:3}}>{record.title}</div>
          {record.address&&<div style={{color:T.textMid,fontSize:12,fontWeight:600,marginBottom:2}}>📍 {record.address}</div>}
          {record.rating>0&&<div style={{color:T.gold,fontSize:13}}>{"★".repeat(record.rating)}{"☆".repeat(5-record.rating)}</div>}
          {record.photos?.length>0&&<div style={{display:"flex",gap:4,marginTop:6}}>{record.photos.slice(0,3).map((p,i)=><div key={i} style={{width:44,height:44,borderRadius:10,background:`linear-gradient(135deg,${T.aquaPale},${T.pinkPale})`,border:`1px solid ${T.aquaLight}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,overflow:"hidden"}}>{p.preview?<img src={p.preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:"📷"}</div>)}{record.photos.length>3&&<div style={{width:44,height:44,borderRadius:10,background:T.aquaPale,border:`1px solid ${T.aquaLight}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:T.aquaDark}}>+{record.photos.length-3}</div>}</div>}
          {record.tags?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>{record.tags.slice(0,4).map(t=><span key={t} style={{background:T.snow,border:`1px solid ${T.aquaLight}`,borderRadius:8,padding:"2px 6px",color:T.textMid,fontSize:10,fontWeight:600}}>#{t}</span>)}</div>}
        </div>
        <div style={{textAlign:"center",marginLeft:10,minWidth:48,flexShrink:0}}>
          <div style={{fontSize:32,marginBottom:3,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center"}}>{record.emoji?<span>{record.emoji}</span>:<img src="/images/icon/plate.png" style={{width:36,height:36,objectFit:"contain"}}/>}</div>
          <div style={{background:`linear-gradient(135deg,${T.goldLight},#FFE060)`,borderRadius:10,padding:"2px 6px",fontWeight:800,fontSize:11,color:"#A06000",display:"flex",alignItems:"center",gap:2}}>+{record.earned}<img src={CURRENCY.honeypot.icon} style={{width:13,height:13,objectFit:"contain"}}/></div>
        </div>
      </div>
    </div>
  );
}
