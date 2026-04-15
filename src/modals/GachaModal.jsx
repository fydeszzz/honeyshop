import { T, CURRENCY, RARITY, GACHA_BAGEL_PRICE } from "../constants";

export default function GachaModal({S,onClose,onGacha,result,anim,setResult,pullCount=1}){
  const cost=GACHA_BAGEL_PRICE*pullCount;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(180,230,245,.52)",backdropFilter:"blur(18px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:T.white,borderRadius:26,padding:"24px 20px",width:"100%",maxWidth:350,border:`2px solid ${T.aquaLight}`,boxShadow:`0 24px 60px rgba(61,216,232,.2)`,textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:900,fontSize:16,color:T.textDark}}>🎲 {pullCount>1?`${pullCount}x Draw`:"Gacha Pull"}</div>
          <button onClick={onClose} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:14,fontWeight:800}}>×</button>
        </div>
        {!result&&!anim&&<>
          <div style={{fontSize:64,marginBottom:10,animation:"drift 3s ease-in-out infinite"}}>🎁</div>
          <div style={{fontWeight:700,color:T.textDark,marginBottom:4,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>Bagels: <span style={{color:"#904000",fontWeight:900}}>{S.bagels}</span><img src={CURRENCY.bagel.icon} style={{width:20,height:20,objectFit:"contain"}}/></div>
          <div style={{fontWeight:600,color:T.textMid,fontSize:13,marginBottom:18,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>{cost} <img src={CURRENCY.bagel.icon} style={{width:14,height:14,objectFit:"contain"}}/> for {pullCount} pull{pullCount>1?"s":""} · Exclusive items only</div>
          <button onClick={onGacha} disabled={S.bagels<cost} style={{width:"100%",background:S.bagels>=cost?`linear-gradient(135deg,${T.pink},${T.purple})`:T.snow,border:"none",borderRadius:16,padding:13,color:S.bagels>=cost?T.white:T.textLight,fontSize:15,fontWeight:900}}>🎲 Pull Now!</button>
        </>}
        {anim&&<div style={{padding:"36px 0"}}><div style={{fontSize:58,animation:"spin .7s linear infinite",display:"inline-block"}}>🎰</div><div style={{fontWeight:800,color:T.aquaDark,fontSize:14,marginTop:13}}>{pullCount>1?`Drawing ${pullCount}x...`:"Pulling..."}</div></div>}
        {result&&!anim&&<>
          {result.pullCount>1&&<div style={{fontSize:11,fontWeight:800,color:T.textMid,marginBottom:8}}>Best of {result.pullCount} draws ✦</div>}
          <div className={`rarity-${result.rarity}`} style={{background:RARITY[result.rarity].bg,border:`3px solid ${RARITY[result.rarity].border}`,borderRadius:20,padding:"20px 16px",marginBottom:13,animation:"popIn .4s ease"}}>
            <div style={{fontSize:72,marginBottom:5}}>{result.emoji}</div>
            <div style={{background:"rgba(255,255,255,.75)",borderRadius:9,display:"inline-block",padding:"2px 11px",color:RARITY[result.rarity].col,fontWeight:800,fontSize:11,marginBottom:6}}>✦ {result.rarity} ✦</div>
            <div style={{fontWeight:900,fontSize:17,color:T.textDark}}>{result.name}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setResult(null);onGacha();}} disabled={S.bagels<cost} style={{flex:1,background:S.bagels>=cost?T.aquaPale:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:11,color:S.bagels>=cost?T.aquaDark:T.textLight,fontSize:13,fontWeight:800}}>Pull Again</button>
            <button onClick={onClose} style={{flex:1,background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:14,padding:11,color:T.white,fontSize:13,fontWeight:900}}>Collect! ✦</button>
          </div>
        </>}
      </div>
    </div>
  );
}
