import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { T, CURRENCY, CUISINE_TAGS, INGREDIENTS, MEAL_TIMES } from "../constants";

export default function AddModal({S,onClose,onSubmit,editRecord}){
  const [type,setType]=useState(editRecord?.type||"cook");
  const [step,setStep]=useState(editRecord?2:0);
  const [photos,setPhotos]=useState(editRecord?.photos||[]);
  const [form,setForm]=useState(editRecord?{
    title:editRecord.title||"",
    notes:editRecord.notes||"",
    address:editRecord.address||"",
    rating:editRecord.rating||0,
    mealTimes:editRecord.mealTime&&editRecord.mealTime!=="—"?editRecord.mealTime.split(" · "):[],
    tags:editRecord.tags||[],
    customTags:editRecord.customTags||[],
    emoji:editRecord.emoji||"🍳",
    ingredients:editRecord.ingredients||[],
    servings:editRecord.servings||{},
    privacy:editRecord.privacy||"public",
    _ingMeta:editRecord._ingMeta||{},
  }:{title:"",notes:"",address:"",rating:0,mealTimes:[],tags:[],customTags:[],emoji:"🍳",ingredients:[],servings:{},privacy:"public"});
  const [addrResults,setAddrResults]=useState([]);
  const [addrSearchDone,setAddrSearchDone]=useState(false);
  const [showTagSearch,setShowTagSearch]=useState(false);
  const [dbTags,setDbTags]=useState(CUISINE_TAGS);
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));

  // ── Tag fetch from Supabase ─────────────────────────────────────────────
  useEffect(()=>{
    if(!supabase)return;
    supabase.from("tag").select("tag_id,tag_en,dineout").then(({data,error})=>{
      console.log("[tag fetch] data:",data,"error:",error);
      if(error){return;}
      if(data?.length){
        setDbTags(data.map(t=>({id:String(t.tag_id),label:t.tag_en,dineoutonly:!!t.dineout})));
      }
    });
  },[]);

  // ── Ingredient live search ──────────────────────────────────────────────
  const [ingQuery,setIngQuery]=useState("");
  const [ingResults,setIngResults]=useState([]);
  const [ingLoading,setIngLoading]=useState(false);

  useEffect(()=>{
    if(!ingQuery.trim()||!supabase){setIngResults([]);return;}
    const timer=setTimeout(async()=>{
      setIngLoading(true);
      const{data,error}=await supabase
        .from("ingredient")
        .select("ingredient_id,ingredient_name_en,unit")
        .or("unit.is.null,unit.eq.false")
        .ilike("ingredient_name_en",`%${ingQuery.trim()}%`)
        .limit(10);
      if(error)console.error("[ingredient search]",error);
      else console.log("[ingredient search] results:",data);
      setIngResults(data||[]);
      setIngLoading(false);
    },300);
    return()=>clearTimeout(timer);
  },[ingQuery]);

  const toggleIngredient=ing=>{
    const id=String(ing.ingredient_id);
    if(form.ingredients.includes(id))return;
    setForm(f=>({...f,
      ingredients:[...f.ingredients,id],
      _ingMeta:{...f._ingMeta,[id]:{name:ing.ingredient_name_en,hasUnit:!!ing.unit}},
    }));
    setIngQuery("");setIngResults([]);
  };
  const addCustomIngredient=name=>{
    const id="custom_ing_"+name.trim().toLowerCase().replace(/\s+/g,"_");
    if(form.ingredients.includes(id))return;
    setForm(f=>({...f,
      ingredients:[...f.ingredients,id],
      _ingMeta:{...f._ingMeta,[id]:{name:name.trim(),hasUnit:false}},
    }));
    setIngQuery("");setIngResults([]);
  };
  const removeIngredient=id=>{
    const s={...form.servings};delete s[id];
    setForm(f=>({...f,ingredients:f.ingredients.filter(x=>x!==id),servings:s}));
  };

  const UNIT_OPTIONS=["piece","g","kg","ml","L","cup","tbsp","tsp","clove","slice"];
  const [unitOptions,setUnitOptions]=useState(UNIT_OPTIONS);

  // ── Fetch unit options from ingredient table where unit=true ────────────
  useEffect(()=>{
    if(!supabase)return;
    supabase.from("ingredient").select("ingredient_name_en").eq("unit",true).then(({data,error})=>{
      console.log("[unit fetch] data:",data,"error:",error);
      if(data?.length) setUnitOptions(data.map(r=>r.ingredient_name_en));
    });
  },[]);

  const handleQtyInput=(id,val)=>{
    // only digits and one decimal point, must start with digit
    const cleaned=val.replace(/[^\d.]/g,"").replace(/(\..*)\./g,"$1");
    setF("servings",{...form.servings,[id]:{...form.servings[id],qty:cleaned}});
  };
  const isQtyValid=qty=>!qty||/^\d+(\.\d*)?$/.test(qty);

  const suggestedTags=useMemo(()=>{
    const available=dbTags.filter(t=>type==="cook"?!t.dineoutonly:true);
    const hasUsage=Object.keys(S.tagUsage||{}).length>0;
    if(hasUsage)return [...available].sort((a,b)=>(S.tagUsage[b.id]||0)-(S.tagUsage[a.id]||0)).slice(0,15);
    return available.slice(0,15);
  },[dbTags,type,S.tagUsage]);
  const toggleTag=id=>setF("tags",form.tags.includes(id)?form.tags.filter(t=>t!==id):[...form.tags,id]);
  const addCustomTag=label=>{
    const id="custom_"+label.trim().toLowerCase().replace(/\s+/g,"_");
    if(form.tags.includes(id))return;
    setForm(f=>({...f,tags:[...f.tags,id],customTags:[...f.customTags,{id,label:label.trim()}]}));
  };
  const allTagsForLookup=[...dbTags,...form.customTags];
  const findTag=id=>allTagsForLookup.find(t=>t.id===id);

  const addrTimer=useRef(null);
  const handleAddrInput=val=>{
    setF("address",val);
    setAddrSearchDone(false);
    if(val.length<2){setAddrResults([]);return;}
    clearTimeout(addrTimer.current);
    addrTimer.current=setTimeout(async()=>{
      try{
        const res=await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&limit=5&lang=en`);
        const json=await res.json();
        const places=(json.features||[]).map(f=>{
          const p=f.properties;
          const street=p.street&&p.housenumber?`${p.housenumber} ${p.street}`:p.street;
          return [p.name,street,p.city||p.town||p.village,p.country].filter(Boolean).join(", ");
        }).filter(Boolean);
        setAddrResults(places);
      }catch{setAddrResults([]);}
      finally{setAddrSearchDone(true);}
    },400);
  };
  const confirmCustomAddr=()=>{
    setAddrResults([]);
    setAddrSearchDone(false);
  };
  const handlePhoto=(e)=>{
    Array.from(e.target.files).forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>setPhotos(prev=>[...prev,{id:Date.now()+Math.random(),preview:ev.target.result,name:file.name}].slice(0,9));
      reader.readAsDataURL(file);
    });
  };
  const removePhoto=id=>setPhotos(prev=>prev.filter(p=>p.id!==id));
  const notesOk=form.notes.trim().length>=30;
  const step2Ok=form.title.trim()&&notesOk;
  const earnAmt=type==="cook"?80:50;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(180,230,245,.5)",backdropFilter:"blur(16px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 10px"}}>
      <div style={{background:T.white,borderRadius:26,width:"100%",maxWidth:393,margin:"0 auto",padding:"18px 17px 28px",border:`2px solid ${T.aquaLight}`,maxHeight:"93vh",overflowY:"auto",boxShadow:`0 12px 48px rgba(61,216,232,.2)`}}>
        <div style={{display:"flex",gap:6,marginBottom:15}}>
          {["Type","Photos","Details","Confirm"].map((s,i)=><div key={s} style={{flex:1,height:5,borderRadius:5,background:i<=step?`linear-gradient(90deg,${T.aqua},${T.pink})`:T.aquaPale}}/>)}
        </div>
        <div style={{position:"relative",display:"flex",justifyContent:"center",alignItems:"center",marginBottom:14}}>
          <div style={{fontWeight:900,fontSize:20,color:T.textDark}}>{["Choose Type","Add Photos","Fill Details","Preview"][step]}</div>
          <button onClick={onClose} style={{position:"absolute",right:0,background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:15,fontWeight:800}}>×</button>
        </div>

        {step===0&&<>
          <div style={{display:"flex",gap:10,marginBottom:17}}>
            {[["cook","/images/icon/spatula_click.png","Home Cooked",80],["dine","/images/icon/plate.png","Dining Out",50]].map(([id,imgSrc,label,earnVal])=>(
              <div key={id} onClick={()=>setType(id)} style={{flex:1,background:type===id?`linear-gradient(160deg,${T.aquaPale},${T.pinkPale})`:T.snow,border:`2.5px solid ${type===id?T.aqua:T.aquaLight}`,borderRadius:20,padding:"17px 10px",textAlign:"center",cursor:"pointer",transition:"all .18s",boxShadow:type===id?`0 4px 14px ${T.aquaLight}`:"none"}}>
                <div style={{marginBottom:7,display:"flex",justifyContent:"center"}}><img src={imgSrc} style={{width:80,height:80,objectFit:"contain"}}/></div>
                <div style={{fontWeight:900,fontSize:14,color:T.textDark,marginBottom:4}}>{label}</div>
                <div style={{background:`linear-gradient(135deg,${T.goldLight},#FFE060)`,borderRadius:14,display:"inline-flex",alignItems:"center",gap:5,padding:"6px 18px",fontWeight:800,fontSize:15,color:"#A06000"}}>+{earnVal} <img src={CURRENCY.honeypot.icon} style={{width:18,height:18,objectFit:"contain"}}/></div>
              </div>
            ))}
          </div>
          <button onClick={()=>setStep(1)} style={{width:"100%",background:`linear-gradient(135deg,${T.pink},${T.purple})`,border:"none",borderRadius:17,padding:13,color:T.white,fontSize:15,fontWeight:900,boxShadow:`0 5px 20px ${T.pinkLight}`}}>Next</button>
        </>}

        {step===1&&<>
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:12,marginBottom:8}}>Add up to 9 photos 📸</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:14}}>
            {photos.map(p=>(
              <div key={p.id} style={{aspectRatio:"1",borderRadius:12,overflow:"hidden",position:"relative",border:`2px solid ${T.aquaLight}`}}>
                <img src={p.preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
                <button onClick={()=>removePhoto(p.id)} style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,.45)",border:"none",borderRadius:"50%",width:20,height:20,color:"#fff",fontSize:11,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              </div>
            ))}
            {photos.length<9&&(
              <label style={{aspectRatio:"1",borderRadius:12,border:`2px dashed ${T.aquaLight}`,background:T.snow,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexDirection:"column",gap:4}}>
                <span style={{fontSize:24,color:T.aquaDark}}>+</span>
                <span style={{fontSize:10,color:T.textLight,fontWeight:700}}>Photo</span>
                <input type="file" accept="image/*" multiple onChange={handlePhoto} style={{display:"none"}}/>
              </label>
            )}
          </div>
          <div style={{color:T.textLight,fontSize:11,fontWeight:600,textAlign:"center",marginBottom:14}}>Photos are optional but bring your entry to life!</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep(0)} style={{flex:1,background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:11,color:T.textMid,fontSize:13,fontWeight:800}}>Back</button>
            <button onClick={()=>setStep(2)} style={{flex:2,background:`linear-gradient(135deg,${T.pink},${T.purple})`,border:"none",borderRadius:14,padding:11,color:T.white,fontSize:14,fontWeight:900,boxShadow:`0 4px 14px ${T.pinkLight}`}}>Next</button>
          </div>
        </>}

        {/* Fill Details Page */}
        {step===2&&<>
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:14,marginBottom:4}}>Title</div>
          <input value={form.title} onChange={e=>setF("title",e.target.value)} placeholder={type==="cook"?"e.g. Garlic Butter Pasta":"e.g. Dinner at Din Tai Fung"} style={{marginBottom:11}}/>
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:14,marginBottom:5}}>Tags</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:11,alignItems:"center"}}>
            {suggestedTags.map(tag=>(
              <button key={tag.id} onClick={()=>toggleTag(tag.id)} style={{background:form.tags.includes(tag.id)?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.snow,border:`2px solid ${form.tags.includes(tag.id)?T.aqua:T.aquaLight}`,borderRadius:14,padding:"5px 10px",color:form.tags.includes(tag.id)?T.white:T.textMid,fontSize:11,fontWeight:700,transition:"all .18s"}}>{tag.label}</button>
            ))}
            <button onClick={()=>setShowTagSearch(true)} style={{background:T.aquaPale,border:`2px solid ${T.aqua}`,borderRadius:14,padding:"5px 10px",color:T.aquaDark,fontSize:12,fontWeight:900}}>+</button>
          </div>
          {form.tags.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{form.tags.map(id=>{const t=findTag(id);return t?<span key={id} style={{background:`${T.aqua}22`,border:`1px solid ${T.aquaLight}`,borderRadius:8,padding:"2px 7px",color:T.aquaDark,fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4}}>✓ {t.label}<button onClick={()=>toggleTag(id)} style={{background:"none",border:"none",color:T.aquaDark,fontSize:10,padding:0,cursor:"pointer",lineHeight:1}}>✕</button></span>:null;})}</div>}
          {type==="cook"&&<>
            {/* ── Ingredients search box ───────────────────────────── */}
            <div style={{marginBottom:8}}>
              <div style={{fontWeight:800,color:T.aquaDark,fontSize:14,marginBottom:5}}>Ingredients <span style={{color:T.textLight,fontWeight:600}}>(Optional)</span></div>
              <div style={{position:"relative"}}>
                <input value={ingQuery} onChange={e=>setIngQuery(e.target.value)}
                  placeholder="Search ingredient e.g. chicken, egg..."
                  style={{paddingRight:32}}/>
                {ingLoading&&<span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:14,color:T.textLight}}>⏳</span>}
              </div>
              {/* Search results dropdown */}
              {(ingResults.length>0||ingQuery.trim())&&(
                <div style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:12,marginTop:4,overflow:"hidden",boxShadow:`0 4px 14px rgba(61,216,232,.12)`}}>
                  {ingResults.map(ing=>{
                    const id=String(ing.ingredient_id);
                    const selected=form.ingredients.includes(id);
                    return(
                      <div key={id} onClick={()=>!selected&&toggleIngredient(ing)}
                        style={{padding:"8px 12px",cursor:selected?"default":"pointer",
                          background:selected?T.aquaPale:"transparent",
                          display:"flex",alignItems:"center",justifyContent:"space-between",
                          borderBottom:`1px solid ${T.aquaLight}`}}>
                        <span style={{fontSize:14,fontWeight:700,color:selected?T.aquaDark:T.textDark}}>{ing.ingredient_name_en}</span>
                        <span style={{fontSize:12,fontWeight:700,color:selected?T.aquaDark:T.textLight}}>
                          {selected?"✓ Added":ing.unit?"📏 measured":"+ Add"}
                        </span>
                      </div>
                    );
                  })}
                  {ingQuery.trim()&&!ingResults.some(i=>i.ingredient_name_en.toLowerCase()===ingQuery.trim().toLowerCase())&&(
                    <div onClick={()=>addCustomIngredient(ingQuery.trim())}
                      style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,background:T.pinkPale}}>
                      <span style={{fontSize:13,fontWeight:800,color:T.pinkDark}}>+ Create "{ingQuery.trim()}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Selected ingredients — two-column inline list ─────── */}
            {form.ingredients.length>0&&(
              <div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,overflow:"hidden",marginBottom:11}}>
                {/* header */}
                <div style={{display:"flex",background:T.aquaPale,padding:"4px 10px",borderBottom:`1px solid ${T.aquaLight}`}}>
                  <span style={{flex:1,fontSize:11,fontWeight:800,color:T.aquaDark}}>Ingredient</span>
                  <span style={{width:130,fontSize:11,fontWeight:800,color:T.aquaDark}}>Unit</span>
                  <span style={{width:20}}/>
                </div>
                {form.ingredients.map(id=>{
                  const meta=form._ingMeta?.[id];
                  const hasUnit=meta?.hasUnit;
                  return(
                    <div key={id} style={{display:"flex",alignItems:"center",padding:"6px 10px",borderBottom:`1px solid ${T.aquaLight}44`}}>
                      {/* left — ingredient name */}
                      <span style={{flex:1,fontSize:13,fontWeight:700,color:T.textDark,paddingRight:8}}>{meta?.name||id}</span>
                      {/* right — qty + unit for all selected ingredients */}
                      <div style={{width:130,display:"flex",alignItems:"center",gap:4}}>
                        <input
                          value={form.servings[id]?.qty||""}
                          onChange={e=>handleQtyInput(id,e.target.value)}
                          placeholder="0"
                          style={{width:44,padding:"2px 4px",fontSize:12,height:26,
                            borderColor:form.servings[id]?.qty&&!isQtyValid(form.servings[id]?.qty)?"#FF6B8A":undefined}}/>
                        <select value={form.servings[id]?.unit||unitOptions[0]||"piece"}
                          onChange={e=>setF("servings",{...form.servings,[id]:{...form.servings[id],unit:e.target.value}})}
                          style={{flex:1,fontSize:12,height:26,padding:"0 2px"}}>
                          {unitOptions.map(u=><option key={u}>{u}</option>)}
                        </select>
                      </div>
                      <button onClick={()=>removeIngredient(id)}
                        style={{background:"none",border:"none",color:T.textLight,fontSize:14,padding:0,cursor:"pointer",width:20}}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </>}
          <div style={{marginBottom:11}}>
            <div style={{fontWeight:800,color:T.aquaDark,fontSize:14,marginBottom:6}}>Meal Time <span style={{color:T.textLight,fontWeight:600}}>(Select all that apply)</span></div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {MEAL_TIMES.map(m=>{const sel=form.mealTimes.includes(m);return(
                <button key={m} onClick={()=>setF("mealTimes",sel?form.mealTimes.filter(x=>x!==m):[...form.mealTimes,m])} style={{background:sel?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.snow,border:`2px solid ${sel?T.aqua:T.aquaLight}`,borderRadius:14,padding:"6px 11px",color:sel?T.white:T.textMid,fontSize:12,fontWeight:700,transition:"all .18s"}}>
                  {m}
                </button>
              );})}
            </div>
          </div>
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:14,marginBottom:4}}>
            Location {type==="cook"?<span style={{color:T.pink,fontWeight:700}}>(Dining out only)</span>:<span style={{color:T.textLight,fontWeight:600}}>(optional)</span>}
          </div>
          <div style={{position:"relative",marginBottom:addrResults.length?0:11,opacity:type==="cook"?0.38:1,pointerEvents:type==="cook"?"none":"auto"}}>
            <input value={form.address} onChange={e=>handleAddrInput(e.target.value)} placeholder="Search address..." style={{paddingLeft:36,background:type==="cook"?T.snow:undefined,cursor:type==="cook"?"not-allowed":undefined}}/>
            <img src="/images/icon/pin.png" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",width:15,height:15,objectFit:"contain"}}/>
          </div>
          {(addrResults.length>0||(addrSearchDone&&form.address.length>=2&&addrResults.length===0))&&(
            <div style={{background:T.white,border:`2px solid ${T.aquaLight}`,borderRadius:14,marginBottom:11,overflow:"hidden",boxShadow:`0 4px 14px rgba(61,216,232,.12)`}}>
              {addrResults.map(a=><div key={a} onClick={()=>{setF("address",a);setAddrResults([]);setAddrSearchDone(false);}} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",cursor:"pointer",fontSize:13,color:T.textDark,fontWeight:600,borderBottom:`1px solid ${T.aquaLight}`}}><img src="/images/icon/pin.png" style={{width:13,height:13,objectFit:"contain",flexShrink:0}}/>{a}</div>)}
              {addrSearchDone&&addrResults.length===0&&(
                <div onClick={confirmCustomAddr} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",cursor:"pointer",fontSize:13,color:T.aquaDark,fontWeight:700,background:T.aquaPale}}>
                  <span style={{fontSize:15,fontWeight:900}}>+</span> Use "{form.address}"
                </div>
              )}
            </div>
          )}
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:14,marginBottom:4}}>
            Notes <span style={{fontWeight:600,color:form.notes.length>=30?T.aquaDark:T.textLight}}>({form.notes.length}/30 words required)</span>
          </div>
          <textarea value={form.notes} onChange={e=>setF("notes",e.target.value)} rows={3} placeholder="Share your experience, taste, recipe tips... (min. 30 characters)" style={{marginBottom:4,resize:"none",borderColor:form.notes.length>0&&!notesOk?"#FF6B8A":undefined}}/>
          {form.notes.length>0&&!notesOk&&<div style={{color:"#FF6B8A",fontSize:11,fontWeight:700,marginBottom:8}}>{30-form.notes.length} more characters needed</div>}
          <div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:"10px 13px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:.7}}>
            <div><div style={{fontWeight:800,color:T.textDark,fontSize:12}}>🔒 Privacy</div><div style={{fontSize:11,color:T.textMid,fontWeight:600}}>Social features coming in future update</div></div>
            <div style={{background:T.aquaPale,borderRadius:10,padding:"3px 10px",fontWeight:800,fontSize:11,color:T.aquaDark}}>Public</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep(1)} style={{flex:1,background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:11,color:T.textMid,fontSize:13,fontWeight:800}}>Back</button>
            <button onClick={()=>{if(!step2Ok)return;setStep(3);}} style={{flex:2,background:step2Ok?`linear-gradient(135deg,${T.pink},${T.purple})`:T.snow,border:"none",borderRadius:14,padding:11,color:step2Ok?T.white:T.textLight,fontSize:13,fontWeight:900,boxShadow:step2Ok?`0 4px 14px ${T.pinkLight}`:"none"}}>
              Preview{!form.title.trim()?" (title required)":!notesOk?" (notes too short)":""}
            </button>
          </div>
        </>}

        {step===3&&<>
          {/* Photos — 104px (2×) */}
          {photos.length>0&&(
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {photos.map(p=>(
                <div key={p.id} style={{width:104,height:104,borderRadius:14,overflow:"hidden",border:`2px solid ${T.aquaLight}`}}>
                  <img src={p.preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
                </div>
              ))}
            </div>
          )}
          <div style={{fontWeight:900,fontSize:18,color:T.textDark,marginBottom:12}}>{form.title}</div>

          {/* Tags */}
          {form.tags.length>0&&<>
            <div style={{fontWeight:800,color:T.aquaDark,fontSize:13,marginBottom:5}}>Tags</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
              {form.tags.map(id=>{const t=findTag(id);return t?<span key={id} style={{background:`${T.aqua}22`,border:`1px solid ${T.aquaLight}`,borderRadius:8,padding:"2px 7px",color:T.aquaDark,fontSize:11,fontWeight:700}}>#{t.label}</span>:null;})}
            </div>
          </>}

          {/* Meal time */}
          <div style={{fontWeight:800,color:T.aquaDark,fontSize:13,marginBottom:5}}>Meal Time</div>
          <div style={{marginBottom:12,color:T.textMid,fontSize:13,fontWeight:600}}>
            {form.mealTimes.join(" · ")||"—"}
          </div>

          {/* Address (dine) */}
          {form.address&&<div style={{display:"flex",alignItems:"center",gap:4,color:T.textMid,fontWeight:700,fontSize:13,marginBottom:12}}><img src="/images/icon/pin.png" style={{width:14,height:14,objectFit:"contain",flexShrink:0}}/>{form.address}</div>}


          {/* Ingredients */}
          {form.ingredients.length>0&&<>
            <div style={{fontWeight:800,color:T.aquaDark,fontSize:13,marginBottom:5}}>Ingredients</div>
            <div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,overflow:"hidden",marginBottom:12}}>
              <div style={{display:"flex",background:T.aquaPale,padding:"4px 10px",borderBottom:`1px solid ${T.aquaLight}`}}>
                <span style={{flex:1,fontSize:11,fontWeight:800,color:T.aquaDark}}>Ingredient</span>
                <span style={{width:130,fontSize:11,fontWeight:800,color:T.aquaDark}}>Unit</span>
              </div>
              {form.ingredients.map(id=>{
                const meta=form._ingMeta?.[id];
                const srv=form.servings?.[id];
                return(
                  <div key={id} style={{display:"flex",alignItems:"center",padding:"6px 10px",borderBottom:`1px solid ${T.aquaLight}44`}}>
                    <span style={{flex:1,fontSize:13,fontWeight:700,color:T.textDark}}>{meta?.name||id}</span>
                    <span style={{width:130,fontSize:13,fontWeight:600,color:T.textMid}}>{srv?.qty||"—"}{srv?.unit?` ${srv.unit}`:""}</span>
                  </div>
                );
              })}
            </div>
          </>}

          {/* Notes */}
          {form.notes&&<>
            <div style={{fontWeight:800,color:T.aquaDark,fontSize:13,marginBottom:5}}>Notes</div>
            <div style={{background:T.snow,border:`1px solid ${T.aquaLight}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:T.textDark,lineHeight:1.65,marginBottom:14,whiteSpace:"pre-wrap"}}>{form.notes}</div>
          </>}

          {/* Reward */}
          <div style={{background:`linear-gradient(135deg,${T.goldLight},#FFE880)`,borderRadius:12,padding:"8px 14px",marginBottom:13,boxShadow:"0 3px 10px rgba(255,184,48,.16)",textAlign:"center"}}>
            <div style={{fontWeight:900,fontSize:18,color:"#A06000",display:"inline-flex",alignItems:"center",gap:4}}>+{earnAmt}<img src={CURRENCY.honeypot.icon} style={{width:17,height:17,objectFit:"contain"}}/></div>
            <div style={{fontWeight:600,color:"#C08000",fontSize:11}}>Honeypot earned for this entry</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep(2)} style={{flex:1,background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:14,padding:11,color:T.textMid,fontSize:13,fontWeight:800}}>Edit</button>
            <button onClick={()=>onSubmit({...form,mealTime:form.mealTimes.join(" · ")||"—",type,photos,tagLabels:form.tags.map(id=>findTag(id)?.label).filter(Boolean),...(editRecord?{id:editRecord.id,earned:editRecord.earned,date:editRecord.date}:{})})} style={{flex:2,background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:14,padding:11,color:T.white,fontSize:14,fontWeight:900,boxShadow:`0 5px 20px ${T.aquaLight}`}}>{editRecord?"Update Entry":"Save Entry!"}</button>
          </div>
        </>}

        {showTagSearch&&<TagSearchModal type={type} selected={form.tags} onToggle={toggleTag} onClose={()=>setShowTagSearch(false)} allTags={dbTags} customTags={form.customTags} onAddCustom={addCustomTag}/>}
      </div>
    </div>
  );
}

function TagSearchModal({type,selected,onToggle,onClose,allTags,customTags,onAddCustom}){
  const [q,setQ]=useState("");
  const pool=[...allTags,...customTags].filter(t=>type==="cook"?!t.dineoutonly:true);
  const filtered=(q?pool.filter(t=>t.label.toLowerCase().includes(q.toLowerCase())):pool).slice(0,15);
  const exactMatch=pool.some(t=>t.label.toLowerCase()===q.trim().toLowerCase());
  const canCreate=q.trim().length>0&&!exactMatch;
  return(
    <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,.97)",backdropFilter:"blur(10px)",borderRadius:"26px 26px 0 0",zIndex:10,padding:"18px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontWeight:900,fontSize:15,color:T.textDark}}>Search Tags</div>
        <button onClick={onClose} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:14,fontWeight:800}}>×</button>
      </div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search or type a tag..." style={{marginBottom:12}}/>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",maxHeight:280,overflowY:"auto"}}>
        {canCreate&&(
          <button onClick={()=>{onAddCustom(q.trim());setQ("");}} style={{background:`linear-gradient(135deg,${T.pink},${T.purple})`,border:"none",borderRadius:14,padding:"6px 12px",color:T.white,fontSize:12,fontWeight:700}}>
            + Create "{q.trim()}"
          </button>
        )}
        {filtered.map(tag=>(
          <button key={tag.id} onClick={()=>onToggle(tag.id)} style={{background:selected.includes(tag.id)?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.snow,border:`2px solid ${selected.includes(tag.id)?T.aqua:T.aquaLight}`,borderRadius:14,padding:"6px 12px",color:selected.includes(tag.id)?T.white:T.textMid,fontSize:12,fontWeight:700,transition:"all .18s"}}>
            {selected.includes(tag.id)?"✓ ":""}{tag.label}{tag.dineoutonly?" 🍽️":""}
          </button>
        ))}
      </div>
      <button onClick={onClose} style={{width:"100%",background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:16,padding:"12px",marginTop:14,color:T.white,fontSize:14,fontWeight:900}}>Done ✓</button>
    </div>
  );
}
