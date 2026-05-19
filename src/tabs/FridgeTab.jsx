import { useState, useMemo, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { T, INGREDIENTS } from "../constants";

/* Auto-emoji: look up local INGREDIENTS table by name, fallback to 🥄 */
const LOCAL_EMO = Object.fromEntries(INGREDIENTS.map(i=>[i.name.toLowerCase(),i.emoji]));
const autoEmoji = name => LOCAL_EMO[name.trim().toLowerCase()] || "🥄";

/* ── Fridge filter/sort bar ──────────────────────────────────────────── */
function FridgeBar({ filter, setFilter, sort, setSort }) {
  const [sortOpen, setSortOpen] = useState(false);
  const FILTERS = [
    { id: "all",    label: "All" },
    { id: "soon",   label: "Expiring Soon" },
  ];
  const SORTS = [
    { id: "soonest", label: "Soonest Expiry First" },
    { id: "latest",  label: "Latest Expiry First" },
    { id: "az",      label: "A → Z" },
  ];
  return (
    <div style={{ padding: "10px 14px 8px", background: T.white, borderBottom: `1px solid ${T.aquaLight}`, position: "sticky", top: 0, zIndex: 30 }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            style={{ flex: 3, padding: "5px 0", borderRadius: 20, border: `1.5px solid ${filter === f.id ? T.aqua : T.aquaLight}`, background: filter === f.id ? T.aquaPale : T.snow, color: filter === f.id ? T.aquaDark : T.textLight, fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "all .15s" }}>
            {f.label}
          </button>
        ))}
        <div style={{ flex: 2, position: "relative" }}>
          <button onClick={() => setSortOpen(o => !o)}
            style={{ width: "100%", padding: "5px 0", borderRadius: 20, border: `1.5px solid ${sortOpen ? T.aquaDark : T.aquaLight}`, background: sortOpen ? T.aquaPale : T.snow, color: T.aquaDark, fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "all .15s" }}>
            Sort ▾
          </button>
          {sortOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: T.white, border: `1.5px solid ${T.aquaLight}`, borderRadius: 14, boxShadow: `0 6px 20px rgba(61,216,232,.15)`, overflow: "hidden", zIndex: 50, minWidth: 180 }}>
              {SORTS.map(s => (
                <div key={s.id} onClick={() => { setSort(s.id); setSortOpen(false); }}
                  style={{ padding: "9px 14px", fontSize: 12, fontWeight: 700, color: sort === s.id ? T.aquaDark : T.textMid, background: sort === s.id ? T.aquaPale : T.white, cursor: "pointer", borderBottom: `1px solid ${T.aquaLight}44` }}>
                  {s.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const todayISO=()=>new Date().toISOString().split("T")[0];
const BLANK_FORM=()=>({name:"",emoji:"🥄",qty:1,expiry:todayISO(),desc:""});

export default function FridgeTab({S,setS,showToast}){
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState(BLANK_FORM());
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));
  const closeForm=()=>{setAdding(false);setForm(BLANK_FORM());setIngQuery("");setIngResults([]);};
  const [filter,setFilter]=useState("all");
  const [sort,setSort]=useState("soonest");

  /* ── Ingredient search ─────────────────────────────────────────────── */
  const [ingQuery,setIngQuery]=useState("");
  const [ingResults,setIngResults]=useState([]);
  const [ingLoading,setIngLoading]=useState(false);

  useEffect(()=>{
    if(!ingQuery.trim()){setIngResults([]);return;}
    const timer=setTimeout(async()=>{
      setIngLoading(true);
      if(supabase){
        const{data,error}=await supabase
          .from("ingredient")
          .select("ingredient_id,ingredient_name_en")
          .or("unit.is.null,unit.eq.false")
          .ilike("ingredient_name_en",`%${ingQuery.trim()}%`)
          .limit(8);
        if(!error) setIngResults(data||[]);
        else setIngResults([]);
      } else {
        /* fallback: filter local INGREDIENTS */
        const q=ingQuery.trim().toLowerCase();
        setIngResults(INGREDIENTS.filter(i=>i.name.toLowerCase().includes(q)).map(i=>({ingredient_id:i.id,ingredient_name_en:i.name})));
      }
      setIngLoading(false);
    },280);
    return()=>clearTimeout(timer);
  },[ingQuery]);

  const pickIngredient=name=>{
    setForm(f=>({...f,name,emoji:autoEmoji(name)}));
    setIngQuery(name);
    setIngResults([]);
  };
  const createCustom=name=>{
    setForm(f=>({...f,name:name.trim(),emoji:autoEmoji(name)}));
    setIngQuery(name.trim());
    setIngResults([]);
  };

  /* ── CRUD ──────────────────────────────────────────────────────────── */
  const addIng=()=>{
    if(!form.name.trim())return;
    setS(prev=>({...prev,fridge:[...prev.fridge,{id:Date.now(),...form}]}));
    showToast(`${form.emoji} ${form.name} added!`);
    closeForm();
  };
  const removeIng=id=>setS(prev=>({...prev,fridge:prev.fridge.filter(i=>i.id!==id)}));
  const chgQty=(id,d)=>setS(prev=>({...prev,fridge:prev.fridge.map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+d)}:i).filter(i=>i.qty>0)}));
  /* daysLeft: positive = days remaining, negative = already expired, null = no expiry set */
  const daysLeft=expiry=>{
    if(!expiry)return null;
    return(new Date(expiry)-new Date())/(1000*60*60*24);
  };

  /* banner: only items expiring within the next 0–3 days (not yet expired) */
  const expiringSoon=useMemo(()=>
    S.fridge.filter(i=>{const d=daysLeft(i.expiry);return d!==null&&d>=0&&d<=3;})
  ,[S.fridge]);

  const displayItems=useMemo(()=>{
    let items=[...S.fridge];
    /* "Expiring Soon" filter: expired OR due within 3 days */
    if(filter==="soon") items=items.filter(i=>{const d=daysLeft(i.expiry);return d!==null&&d<=3;});
    if(sort==="soonest") items.sort((a,b)=>{const da=daysLeft(a.expiry),db=daysLeft(b.expiry);if(da===null&&db===null)return 0;if(da===null)return 1;if(db===null)return -1;return da-db;});
    else if(sort==="latest") items.sort((a,b)=>{const da=daysLeft(a.expiry),db=daysLeft(b.expiry);if(da===null&&db===null)return 0;if(da===null)return 1;if(db===null)return -1;return db-da;});
    else if(sort==="az") items.sort((a,b)=>a.name.localeCompare(b.name));
    return items;
  },[S.fridge,filter,sort]);

  /* exact match check for "create" option */
  const showCreate=ingQuery.trim()&&!ingResults.some(r=>r.ingredient_name_en.toLowerCase()===ingQuery.trim().toLowerCase())&&form.name!==ingQuery.trim();

  return(
    <>
    <FridgeBar filter={filter} setFilter={setFilter} sort={sort} setSort={setSort}/>
    <div style={{padding:"13px 14px",animation:"fadeSlide .3s ease"}}>
      {!adding&&expiringSoon.length>0&&<div style={{background:"linear-gradient(135deg,#FFF8E0,#FFF0C0)",border:"2px solid #FFD060",borderRadius:16,padding:"10px 14px",marginBottom:12,display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:18}}>⚠️</span><div><div style={{fontWeight:800,color:"#A06000",fontSize:13}}>Expiring soon!</div><div style={{color:"#C08000",fontSize:12,fontWeight:600}}>{expiringSoon.map(i=>i.name).join(" · ")}</div></div></div>}

      {/* ── Add form ── */}
      {adding&&<div style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:20,padding:"14px",marginBottom:12}}>

        {/* Header row with X */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontWeight:900,color:T.aquaDark,fontSize:14}}>Add to Fridge</div>
          <button onClick={closeForm} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:15,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        {/* Name / ingredient search */}
        <div style={{fontWeight:800,color:T.aquaDark,fontSize:12,marginBottom:5}}>Name *</div>
        <div style={{position:"relative",marginBottom:(ingResults.length>0||showCreate)?0:10}}>
          <input
            value={ingQuery}
            onChange={e=>{setIngQuery(e.target.value);setF("name","");}}
            placeholder="Search ingredient e.g. chicken, egg..."
            style={{paddingRight:32}}
          />
          {ingLoading&&<span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:13,color:T.textLight}}>⏳</span>}
        </div>

        {/* Dropdown */}
        {(ingResults.length>0||showCreate)&&(
          <div style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:12,marginBottom:10,overflow:"hidden",boxShadow:`0 4px 14px rgba(61,216,232,.12)`}}>
            {ingResults.map(ing=>(
              <div key={ing.ingredient_id}
                onClick={()=>pickIngredient(ing.ingredient_name_en)}
                style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.aquaLight}`,background:"transparent"}}>
                <span style={{fontSize:14,fontWeight:700,color:T.textDark}}>{ing.ingredient_name_en}</span>
                <span style={{fontSize:11,fontWeight:700,color:T.textLight}}>+ Add</span>
              </div>
            ))}
            {showCreate&&(
              <div onClick={()=>createCustom(ingQuery.trim())}
                style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,background:T.pinkPale}}>
                <span style={{fontSize:13,fontWeight:800,color:T.pinkDark}}>+ Create "{ingQuery.trim()}"</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div style={{fontWeight:800,color:T.aquaDark,fontSize:12,marginBottom:5}}>
          Description <span style={{color:T.textLight,fontWeight:600}}>(Optional | up to 30 characters)</span>
        </div>
        <input
          value={form.desc}
          onChange={e=>setF("desc",e.target.value.slice(0,30))}
          placeholder="e.g. From farmers market"
          maxLength={30}
          style={{marginBottom:10}}
        />

        {/* Qty + Best Before */}
        <div style={{display:"flex",gap:10,marginBottom:10}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,color:T.aquaDark,fontSize:12,marginBottom:5}}>Qty</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={()=>setF("qty",Math.max(1,form.qty-1))} style={{background:T.aquaPale,border:`2px solid ${T.aquaLight}`,borderRadius:10,width:32,height:32,color:T.aquaDark,fontSize:18,fontWeight:900}}>−</button>
              <span style={{fontWeight:900,fontSize:16,color:T.textDark,minWidth:24,textAlign:"center"}}>{form.qty}</span>
              <button onClick={()=>setF("qty",form.qty+1)} style={{background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:10,width:32,height:32,color:T.white,fontSize:18,fontWeight:900}}>+</button>
            </div>
          </div>
          <div style={{flex:1.4}}>
            <div style={{fontWeight:800,color:T.aquaDark,fontSize:12,marginBottom:5}}>Best Before</div>
            <input type="date" value={form.expiry} onChange={e=>setF("expiry",e.target.value)}/>
          </div>
        </div>

        <button onClick={addIng} style={{width:"100%",background:form.name.trim()?`linear-gradient(135deg,${T.pink},${T.purple})`:T.snow,border:"none",borderRadius:16,padding:"11px",color:form.name.trim()?T.white:T.textLight,fontSize:14,fontWeight:900}}>Add to Fridge</button>
      </div>}

      {/* ── Empty state / Items list (hidden while adding) ── */}
      {S.fridge.length===0&&!adding?<div style={{textAlign:"center",padding:"36px 0 28px"}}>
        <img src="/images/icon/fridge_empty.png" style={{width:100,height:100,objectFit:"contain",marginBottom:10,animation:"drift 3s ease-in-out infinite"}}/>
        <div style={{fontWeight:800,color:T.textDark,fontSize:20,marginBottom:6}}>Your fridge is empty</div>
        <div style={{color:T.textMid,fontSize:14,fontWeight:600,marginBottom:20}}>Track stock &amp; get expiry reminders!</div>
        <button onClick={()=>setAdding(true)} style={{background:`linear-gradient(135deg,${T.pink},${T.purple})`,border:"none",borderRadius:25,padding:"5px 40px",color:T.white,fontSize:14,fontWeight:900,boxShadow:`0 6px 22px ${T.pinkLight}`,display:"inline-flex",alignItems:"center",gap:10}}>
          <img src="/images/icon/fridge_empty.png" style={{width:32,height:32,objectFit:"contain"}}/> + Add Item
        </button>
      </div>:(

      /* ── Items list (hidden while adding) ── */
      <div style={{display:adding?"none":"flex",flexDirection:"column",gap:8}}>
        {displayItems.map(item=>{
          const d=daysLeft(item.expiry);
          const isExpired=d!==null&&d<0;
          const isSoon=d!==null&&d>=0&&d<=3;
          const borderColor=isExpired?"#FF6B6B":isSoon?"#FFD060":T.aquaLight;
          const daysInt=d!==null?Math.ceil(d):null;
          return(
            <div key={item.id} style={{background:T.white,border:`2px solid ${borderColor}`,borderRadius:16,padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,color:T.textDark,marginBottom:2}}>{item.name}</div>
                {item.desc&&<div style={{fontSize:11,color:T.textMid,fontWeight:600,marginBottom:3}}>{item.desc}</div>}
                {item.expiry&&(
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontSize:11,fontWeight:700,color:isExpired?"#D32F2F":isSoon?"#C08000":T.textLight}}>
                      {isExpired?"Expired!":`Exp until ${item.expiry}`}
                    </span>
                    {!isExpired&&(
                      <span style={{fontSize:11,color:T.textDark}}>
                        <span style={{fontWeight:900,fontSize:12}}>{daysInt}</span> Day(s) Left
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={()=>chgQty(item.id,-1)} style={{background:T.aquaPale,border:`1.5px solid ${T.aquaLight}`,borderRadius:8,width:26,height:26,color:T.aquaDark,fontSize:15,fontWeight:900}}>−</button>
                <span style={{fontWeight:900,fontSize:14,color:T.textDark,minWidth:20,textAlign:"center"}}>{item.qty}</span>
                <button onClick={()=>chgQty(item.id,+1)} style={{background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:8,width:26,height:26,color:T.white,fontSize:15,fontWeight:900}}>+</button>
              </div>
              <button onClick={()=>removeIng(item.id)} style={{background:"none",border:"none",fontSize:17,color:T.textLight}}>✕</button>
            </div>
          );
        })}
      </div>
      )}

      {/* ── FAB (when items exist) ── */}
      {S.fridge.length>0&&!adding&&<button onClick={()=>setAdding(true)} style={{position:"absolute",bottom:90,right:16,width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",boxShadow:`0 6px 22px ${T.aquaLight}`,zIndex:50,fontSize:24,color:T.white,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>}
    </div>
    </>
  );
}
