import { useEffect } from "react";

export default function Lightbox({ src, onClose }){
  useEffect(()=>{
    const handler=e=>{ if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  },[onClose]);

  return(
    <div
      onClick={onClose}
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20,cursor:"zoom-out"}}
    >
      <img
        src={src}
        alt=""
        onClick={e=>e.stopPropagation()}
        style={{maxWidth:"100%",maxHeight:"100%",borderRadius:16,boxShadow:"0 8px 48px rgba(0,0,0,.6)",objectFit:"contain",cursor:"default"}}
      />
      <button
        onClick={onClose}
        style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,.15)",border:"none",borderRadius:"50%",width:36,height:36,color:"#fff",fontSize:20,fontWeight:700,cursor:"pointer",lineHeight:1}}
      >×</button>
    </div>
  );
}
