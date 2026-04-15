import { useState, useEffect } from "react";
import { T, CUISINE_TAGS } from "../constants";
import { supabase } from "../lib/supabase";

export default function ProfileModal({S,setS,onClose,showToast,avatars=[],bgcolors=[]}){
  const [form,setForm]=useState({...S.profile});
  const [showPicker,setShowPicker]=useState(false);
  const [avTab,setAvTab]=useState("avatar");
  const [showTagSearch,setShowTagSearch]=useState(false);
  const [tagQ,setTagQ]=useState("");
  const [dbTags,setDbTags]=useState(CUISINE_TAGS);

  useEffect(()=>{
    if(!supabase)return;
    supabase.from("tag").select("tag_id,tag_en,dineout").then(({data})=>{
      if(data?.length) setDbTags(data.map(t=>({id:String(t.tag_id),label:t.tag_en,dineoutonly:!!t.dineout})));
    });
  },[]);

  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleFavTag=id=>setF("favTags",form.favTags.includes(id)?form.favTags.filter(t=>t!==id):form.favTags.length<5?[...form.favTags,id]:form.favTags);
  const savePro=()=>{setS(p=>({...p,profile:form}));showToast("Profile saved!","gold");onClose();};
  const availableTags=dbTags.filter(t=>!t.dineoutonly);
  const filteredTags=(tagQ?availableTags.filter(t=>t.label.toLowerCase().includes(tagQ.toLowerCase())):availableTags).slice(0,15);

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(180,230,245,.5)",backdropFilter:"blur(18px)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
      <div style={{background:T.white,borderRadius:"26px 26px 0 0",width:"100%",maxWidth:393,margin:"0 auto",padding:"20px 18px 36px",border:`2px solid ${T.aquaLight}`,borderBottom:"none",maxHeight:"88vh",overflowY:"auto",boxShadow:`0 -14px 44px rgba(61,216,232,.13)`,position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontWeight:900,fontSize:18,color:T.textDark,display:"flex",alignItems:"center",gap:6}}><img src="/images/icon/setting.png" alt="" style={{width:30,height:30}}/>Profile & Settings</div>
          <button onClick={onClose} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:30,height:30,color:T.textMid,fontSize:16,fontWeight:800}}>×</button>
        </div>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:form.avatarBgHex||`linear-gradient(135deg,${T.aquaLight},${T.pinkLight})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",border:`3px solid ${T.white}`,boxShadow:`0 4px 16px ${T.aquaLight}`,overflow:"hidden"}}>
            {form.avatarUrl?<img src={form.avatarUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:32}}>👤</span>}
          </div>
          <button onClick={()=>setShowPicker(true)} style={{background:`linear-gradient(135deg,${T.aquaLight},${T.pinkLight})`,border:"none",borderRadius:14,padding:"5px 14px",fontSize:12,fontWeight:800,color:T.aquaDark,cursor:"pointer"}}>Choose avatar</button>
        </div>

        {/* ── Avatar Picker Popup ── */}
        {showPicker&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowPicker(false)}>
            <div style={{background:T.white,borderRadius:22,width:320,padding:"18px 16px 20px",boxShadow:"0 12px 48px rgba(0,0,0,.2)"}} onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontWeight:900,fontSize:16,color:T.textDark}}>Choose Avatar</div>
                <button onClick={()=>setShowPicker(false)} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:8,width:28,height:28,color:T.textMid,fontSize:15,fontWeight:800}}>×</button>
              </div>
              <div style={{display:"flex",borderBottom:`2px solid ${T.aquaLight}`,marginBottom:12}}>
                {[["avatar","Avatar"],["bg","Background"]].map(([key,label])=>(
                  <button key={key} onClick={()=>setAvTab(key)} style={{flex:1,background:"none",border:"none",padding:"6px 0",fontWeight:800,fontSize:12,color:avTab===key?T.aquaDark:T.textLight,borderBottom:`3px solid ${avTab===key?T.aqua:"transparent"}`,marginBottom:-2,transition:"color .15s"}}>
                    {label}
                  </button>
                ))}
              </div>
              {avTab==="avatar"&&(
                <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"space-between",maxHeight:200,overflowY:"auto",padding:"4px 2px"}}>
                  {avatars.map(a=>{
                    const sel=form.avatarUrl===a.avatar_url;
                    return(
                      <button key={a.avatar_id} onClick={()=>setF("avatarUrl",a.avatar_url)}
                        style={{width:80,height:80,borderRadius:"50%",background:form.avatarBgHex||T.aquaLight,border:`3px solid ${sel?T.aquaDark:T.aquaLight}`,overflow:"hidden",padding:0,flexShrink:0,transition:"border-color .15s"}}>
                        <img src={a.avatar_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      </button>
                    );
                  })}
                </div>
              )}
              {avTab==="bg"&&(
                <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",padding:"6px 4px",maxHeight:200,overflowY:"auto"}}>
                  {bgcolors.map(c=>{
                    const sel=form.avatarBgHex===c.avatar_bg_hex;
                    return(
                      <button key={c.avatar_bg_id} onClick={()=>setF("avatarBgHex",c.avatar_bg_hex)}
                        style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"none",border:"none",padding:0,cursor:"pointer"}}>
                        <div style={{width:80,height:80,borderRadius:"50%",background:c.avatar_bg_hex,border:`3px solid ${sel?T.aquaDark:T.aquaLight}`,boxShadow:sel?`0 0 0 2px ${T.aqua}`:"0 1px 4px rgba(0,0,0,.13)",transition:"border-color .15s"}}/>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{fontWeight:800,color:T.aquaDark,fontSize:14,marginBottom:5}}>Nickname</div>
        <input value={form.nickname} onChange={e=>setF("nickname",e.target.value)} maxLength={20} placeholder="Your nickname" style={{marginBottom:12}}/>
        <div style={{fontWeight:800,color:T.aquaDark,fontSize:14,marginBottom:5}}>Bio <span style={{color:T.textLight,fontWeight:600}}>({form.bio.length}/100)</span></div>
        <textarea value={form.bio} onChange={e=>setF("bio",e.target.value.slice(0,100))} rows={2} placeholder="Tell us about your food journey..." style={{marginBottom:12,resize:"none"}}/>

        {/* ── Favourite Tags ── */}
        <div style={{fontWeight:800,color:T.aquaDark,fontSize:14,marginBottom:5}}>Favourite Tags <span style={{color:T.textLight,fontWeight:600}}>({form.favTags.length}/5)</span></div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:16,alignItems:"center"}}>
          {form.favTags.map(id=>{
            const t=dbTags.find(x=>x.id===id);
            return t?<span key={id} style={{background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:`2px solid ${T.aqua}`,borderRadius:14,padding:"5px 10px",color:T.white,fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4}}>
              {t.label}
              <button onClick={()=>toggleFavTag(id)} style={{background:"none",border:"none",color:"rgba(255,255,255,.85)",fontSize:11,padding:0,cursor:"pointer",lineHeight:1}}>✕</button>
            </span>:null;
          })}
          {form.favTags.length<5&&(
            <button onClick={()=>setShowTagSearch(true)} style={{background:T.aquaPale,border:`2px solid ${T.aqua}`,borderRadius:14,padding:"5px 12px",color:T.aquaDark,fontSize:14,fontWeight:900,cursor:"pointer"}}>+</button>
          )}
        </div>

        <div style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:16,padding:"12px 14px",marginBottom:16}}>
          <div style={{fontWeight:800,color:T.textDark,fontSize:14,marginBottom:8,display:"flex",alignItems:"center",gap:5}}><img src="/images/icon/setting.png" alt="" style={{width:15,height:15}}/>System Settings</div>
          {[["Dark Mode","Coming soon"],["Notifications","Coming soon"],["Language","English"],["Privacy","Public (default)"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.aquaLight}`}}>
              <span style={{fontWeight:700,color:T.textDark,fontSize:13}}>{k}</span>
              <span style={{fontWeight:600,color:T.textLight,fontSize:12}}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={savePro} style={{width:"100%",background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:18,padding:"13px",color:T.white,fontSize:15,fontWeight:900,boxShadow:`0 5px 20px ${T.aquaLight}`}}>Save Profile</button>

        {/* ── Tag Search Overlay ── */}
        {showTagSearch&&(
          <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,.97)",backdropFilter:"blur(10px)",borderRadius:"26px 26px 0 0",zIndex:10,padding:"18px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontWeight:900,fontSize:15,color:T.textDark}}>Search Tags</div>
              <button onClick={()=>{setShowTagSearch(false);setTagQ("");}} style={{background:T.snow,border:`2px solid ${T.aquaLight}`,borderRadius:9,width:28,height:28,color:T.textMid,fontSize:14,fontWeight:800}}>×</button>
            </div>
            <input value={tagQ} onChange={e=>setTagQ(e.target.value)} placeholder="Search tags..." style={{marginBottom:12}}/>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",maxHeight:280,overflowY:"auto"}}>
              {filteredTags.map(tag=>{
                const sel=form.favTags.includes(tag.id);
                const full=!sel&&form.favTags.length>=5;
                return(
                  <button key={tag.id} onClick={()=>!full&&toggleFavTag(tag.id)}
                    style={{background:sel?`linear-gradient(135deg,${T.aqua},${T.pink})`:T.snow,border:`2px solid ${sel?T.aqua:T.aquaLight}`,borderRadius:14,padding:"6px 12px",color:sel?T.white:T.textMid,fontSize:12,fontWeight:700,transition:"all .18s",opacity:full?.4:1,cursor:full?"default":"pointer"}}>
                    {sel?"✓ ":""}{tag.label}
                  </button>
                );
              })}
            </div>
            <button onClick={()=>{setShowTagSearch(false);setTagQ("");}} style={{width:"100%",background:`linear-gradient(135deg,${T.aqua},${T.pink})`,border:"none",borderRadius:16,padding:"12px",marginTop:14,color:T.white,fontSize:14,fontWeight:900,cursor:"pointer"}}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
