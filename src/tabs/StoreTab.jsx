import { useState } from "react";
import { T, CURRENCY, STORE_ITEMS, RARITY, GACHA_TABLE, GACHA_BAGEL_PRICE } from "../constants";

export default function StoreTab({S,onGacha,onBuy}){
  const [view,setView]=useState("store");
  return(
    <div style={{animation:"fadeSlide .3s ease"}}>
      <div style={{display:"flex",gap:8,padding:"13px 14px 12px"}}>
        {[["store","Store"],["gacha","Gacha"]].map(([id,label])=>(
          <button key={id} onClick={()=>setView(id)} style={{flex:1,background:view===id?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.white,border:view===id?"none":`2px solid ${T.aquaLight}`,borderRadius:16,padding:"10px",color:view===id?T.white:T.textMid,fontSize:16,fontWeight:900,boxShadow:view===id?`0 4px 14px ${T.aquaLight}`:"none",transition:"all .18s",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:5}}>{label}</button>
        ))}
      </div>
      {view==="store"&&<div style={{padding:"0 14px 13px"}}><ShopBuyView S={S} onBuy={onBuy}/></div>}
      {view==="gacha"&&<div style={{padding:"0 14px 13px"}}><GachaView S={S} onGacha={onGacha}/></div>}
    </div>
  );
}

function ShopBuyView({S,onBuy}){
  const [cat,setCat]=useState("All");
  const cats=["All",...new Set(STORE_ITEMS.filter(i=>!i.gacha_only).map(i=>i.list_category))];

  const filtered=STORE_ITEMS.filter(i=>!i.gacha_only&&(cat==="All"||i.list_category===cat));
  // owned items sink to the end
  const items=[
    ...filtered.filter(i=>!S.owned.includes(i.id)),
    ...filtered.filter(i=> S.owned.includes(i.id)),
  ];
  return(<>
    <div style={{background:`linear-gradient(135deg,${T.goldLight},#FFE880)`,borderRadius:18,padding:"12px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
      <img src={CURRENCY.honeypot.icon} style={{width:32,height:32,objectFit:"contain"}}/>
      <div><div style={{fontWeight:900,fontSize:14,color:"#A06000"}}>Honeypot Store</div><div style={{fontWeight:700,fontSize:12,color:"#C08000"}}>Buy furniture with your Honeypot</div></div>
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4}}><span style={{fontWeight:900,fontSize:16,color:"#A06000"}}>{S.currency}</span><img src={CURRENCY.honeypot.icon} style={{width:22,height:22,objectFit:"contain"}}/></div>
    </div>
    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:10}}>
      {cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{background:cat===c?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.white,border:cat===c?"none":`2px solid ${T.aquaLight}`,borderRadius:13,padding:"5px 13px",color:cat===c?T.white:T.textMid,fontSize:11,fontWeight:700,whiteSpace:"nowrap",flexShrink:0,transition:"all .18s"}}>{c}</button>)}
    </div>
    {/* ── card width: edit gridTemplateColumns below ── */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
      {items.map(item=>{
        const owned=S.owned.includes(item.id);
        const canBuy=S.currency>=item.price&&!owned;
        return(
          <div key={item.id} className={owned?`rarity-${item.rarity}`:""} style={{background:RARITY[item.rarity].bg,border:`2.5px solid ${RARITY[item.rarity].border}`,borderRadius:18,padding:"24px 12px 24px",textAlign:"center",position:"relative",opacity:owned?.7:1}}>
            {/* item image — 48×48 reserved slot; swap emoji for <img> when assets are ready */}
            <div style={{width:48,height:48,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38}}>
              {item.emoji}
            </div>
            <div style={{fontWeight:800,fontSize:14,color:T.textDark,marginBottom:10,lineHeight:1.3}}>{item.name}</div>
            <button
              onClick={()=>canBuy&&onBuy(item)}
              disabled={owned||S.currency<item.price}
              style={{width:"100%",
                background:owned?"#E0E0E0":canBuy?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.snow,
                border:owned||canBuy?"none":`2px solid ${T.aquaLight}`,
                borderRadius:12,padding:"5px",
                color:owned?"#9e9e9e":canBuy?"#043e41":"#0599b3",
                fontSize:14,fontWeight:800}}>
              {owned?"✅ Owned":<>{item.price} <img src={CURRENCY.honeypot.icon} style={{width:24,height:24,objectFit:"contain",verticalAlign:"middle"}}/></>}
            </button>
          </div>
        );
      })}
    </div>
  </>);
}

function GachaView({S,onGacha}){
  const [poolIdx,setPoolIdx]=useState(0);
  const [showRates,setShowRates]=useState(false);

  const pool=GACHA_TABLE[poolIdx];
  const gachaItems=pool.item_ids.map(id=>STORE_ITEMS.find(i=>i.id===id)).filter(Boolean);
  const ownedCount=gachaItems.filter(i=>S.owned.includes(i.id)).length;
  const can1=S.bagels>=GACHA_BAGEL_PRICE;
  const can10=S.bagels>=GACHA_BAGEL_PRICE*10;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12,paddingBottom:6}}>

      {/* ── Large Banner Card ── */}
      <div style={{
        background:"linear-gradient(160deg,#FFFBE8 0%,#FFF3C0 60%,#FFE8A0 100%)",
        borderRadius:24,padding:"18px 16px 16px",position:"relative",
        boxShadow:"0 8px 32px rgba(255,184,48,.22)",overflow:"hidden"
      }}>
        {/* Discount badge */}
        <div style={{
          position:"absolute",top:0,right:0,
          background:"linear-gradient(135deg,#FF4D8D,#FF2060)",
          borderRadius:"0 24px 0 20px",
          padding:"7px 16px",
          color:"#fff",fontWeight:900,fontSize:13,letterSpacing:.3,
          boxShadow:"0 4px 14px rgba(255,77,141,.45)"
        }}>80% off</div>

        {/* Pool artwork area */}
        <div style={{textAlign:"center",padding:"14px 0 10px"}}>
          <div style={{fontSize:90,lineHeight:1,animation:"drift 3s ease-in-out infinite",display:"inline-block",filter:"drop-shadow(0 8px 16px rgba(255,184,48,.35))"}}>{pool.pool_emoji}</div>
        </div>

        {/* Pool name */}
        <div style={{textAlign:"center",fontWeight:900,fontSize:17,color:T.textDark,marginBottom:10,letterSpacing:.2}}>{pool.pool_name}</div>

        {/* Pagination dots */}
        <div style={{display:"flex",justifyContent:"center",gap:7,marginBottom:12}}>
          {GACHA_TABLE.map((_,i)=>(
            <button key={i} onClick={()=>setPoolIdx(i)} style={{
              width:i===poolIdx?22:8,height:8,borderRadius:4,border:"none",padding:0,
              background:i===poolIdx?T.pink:"rgba(255,107,173,.25)",
              transition:"all .25s ease",cursor:"pointer"
            }}/>
          ))}
        </div>

        {/* Bottom row: bagel balance + rates */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{background:"rgba(255,255,255,.7)",borderRadius:20,padding:"5px 12px",display:"flex",alignItems:"center",gap:5,border:"1.5px solid rgba(255,184,48,.35)"}}>
            <img src={CURRENCY.bagel.icon} style={{width:22,height:22,objectFit:"contain"}}/>
            <span style={{fontWeight:900,fontSize:13,color:"#904000"}}>{S.bagels}</span>
            <span style={{fontSize:10,color:"#C08000",fontWeight:700}}>tokens</span>
          </div>
          <button onClick={()=>setShowRates(true)} style={{
            background:"rgba(255,255,255,.7)",border:"1.5px solid rgba(255,107,173,.3)",
            borderRadius:20,padding:"5px 13px",color:T.textMid,fontSize:11,fontWeight:700,cursor:"pointer"
          }}>Rates ？</button>
        </div>
      </div>

      {/* ── Draw Buttons ── */}
      <div style={{display:"flex",gap:11}}>
        <button onClick={()=>onGacha(pool.pool_id,1)} disabled={!can1} style={{
          flex:1,borderRadius:30,border:"none",padding:"14px 10px",cursor:can1?"pointer":"default",
          background:can1?`linear-gradient(135deg,${T.pink},#FF3070)`:"#F0E0E8",
          color:can1?T.white:"#C0A0B0",fontWeight:900,fontSize:15,lineHeight:1.4,
          boxShadow:can1?`0 6px 20px rgba(255,107,173,.45)`:"none",transition:"all .18s"
        }}>1 draw<br/><span style={{fontSize:11,fontWeight:700,opacity:.88,display:"inline-flex",alignItems:"center",gap:2}}>{GACHA_BAGEL_PRICE} <img src={CURRENCY.bagel.icon} style={{width:13,height:13,objectFit:"contain"}}/></span></button>
        <button onClick={()=>onGacha(pool.pool_id,10)} disabled={!can10} style={{
          flex:1,borderRadius:30,border:"none",padding:"14px 10px",cursor:can10?"pointer":"default",
          background:can10?`linear-gradient(135deg,${T.pink},#FF3070)`:"#F0E0E8",
          color:can10?T.white:"#C0A0B0",fontWeight:900,fontSize:15,lineHeight:1.4,
          boxShadow:can10?`0 6px 20px rgba(255,107,173,.45)`:"none",transition:"all .18s"
        }}>10 draws<br/><span style={{fontSize:11,fontWeight:700,opacity:.88,display:"inline-flex",alignItems:"center",gap:2}}>{GACHA_BAGEL_PRICE*10} <img src={CURRENCY.bagel.icon} style={{width:13,height:13,objectFit:"contain"}}/></span></button>
      </div>

      {/* ── Collections ── */}
      <div style={{
        background:T.white,borderRadius:22,padding:"15px 14px",
        boxShadow:"0 2px 16px rgba(0,0,0,.06)"
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
          <div style={{fontWeight:900,color:T.textDark,fontSize:14}}>Collections</div>
          <div style={{background:T.aquaPale,borderRadius:20,padding:"3px 11px",fontSize:11,fontWeight:800,color:T.aquaDark}}>{ownedCount}/{gachaItems.length}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {gachaItems.slice(0,8).map(item=>{
            const isOwned=S.owned.includes(item.id);
            const R=RARITY[item.rarity];
            return(
              <div key={item.id} className={isOwned?`rarity-${item.rarity}`:""} style={{
                background:isOwned?R.bg:"#F7F7F7",border:`2px solid ${isOwned?R.border:"#E4E4E4"}`,
                borderRadius:14,padding:"9px 4px",textAlign:"center",
                opacity:isOwned?1:.55,transition:"opacity .2s"
              }}>
                <div style={{fontSize:22}}>{isOwned?item.emoji:"❓"}</div>
                <div style={{fontWeight:800,fontSize:8,color:isOwned?T.textDark:T.textLight,marginTop:3,lineHeight:1.25,wordBreak:"break-word"}}>{isOwned?item.name:"???"}</div>
                <div style={{fontWeight:700,fontSize:7,color:R.col,marginTop:1}}>{item.rarity}</div>
              </div>
            );
          })}
        </div>
        {gachaItems.length>8&&<div style={{textAlign:"center",marginTop:9,fontSize:11,fontWeight:700,color:T.textLight}}>+{gachaItems.length-8} more items</div>}
      </div>

      {/* ── Rates Modal ── */}
      {showRates&&(
        <div onClick={()=>setShowRates(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.white,borderRadius:22,padding:"20px 18px",width:"100%",maxWidth:300,boxShadow:`0 16px 50px rgba(0,0,0,.18)`,animation:"popIn .25s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontWeight:900,fontSize:15,color:T.textDark}}>Drop Rates</div>
              <button onClick={()=>setShowRates(false)} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:14,fontWeight:800}}>×</button>
            </div>
            {[["Common","—",T.textLight,"#F5F5F5"],["Rare","55%",RARITY.Rare.col,RARITY.Rare.bg],["Epic","30%",RARITY.Epic.col,RARITY.Epic.bg],["Legendary","10%",RARITY.Legendary.col,RARITY.Legendary.bg],["Unique","5%",RARITY.Unique.col,RARITY.Unique.bg]].map(([r,p,col,bg])=>(
              <div key={r} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:bg,border:`1.5px solid ${col}44`,borderRadius:11,padding:"8px 12px",marginBottom:7}}>
                <span style={{fontWeight:800,fontSize:13,color:col}}>{r}</span>
                <span style={{fontWeight:900,fontSize:14,color:col}}>{p}</span>
              </div>
            ))}
            <div style={{color:T.textLight,fontSize:10,fontWeight:600,textAlign:"center",marginTop:8}}>Tap anywhere to close</div>
          </div>
        </div>
      )}
    </div>
  );
}
