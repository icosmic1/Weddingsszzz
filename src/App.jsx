import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════
   GOOGLE FONTS
   ═══════════════════════════════════════════════════════════ */
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;700&family=Cinzel+Decorative:wght@400;700&family=Raleway:wght@300;400;500&family=Lora:ital,wght@0,400;0,600;1,400&family=Josefin+Sans:wght@300;400;500&family=Italiana&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300&family=Cormorant:ital,wght@0,300;0,400;0,600;1,300&family=Karla:wght@300;400;500&family=DM+Serif+Display:ital@0;1&family=Bodoni+Moda:ital,wght@0,400;0,700;1,400&family=Marcellus&family=Tenor+Sans&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap";
document.head.appendChild(fl);

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES + KEYFRAMES
   ═══════════════════════════════════════════════════════════ */
const sty = document.createElement("style");
sty.textContent = `
  @keyframes fadeUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
  @keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(5deg)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes heartbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.2)}28%{transform:scale(1)}42%{transform:scale(1.18)}70%{transform:scale(1)}}
  @keyframes sparkle{0%,100%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1)}}
  @keyframes drift{0%{transform:translateX(0) translateY(0) rotate(0deg)}25%{transform:translateX(30px) translateY(-40px) rotate(90deg)}50%{transform:translateX(-20px) translateY(-80px) rotate(180deg)}75%{transform:translateX(40px) translateY(-120px) rotate(270deg)}100%{transform:translateX(10px) translateY(-160vh) rotate(360deg)}}
  @keyframes twinkle{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}
  @keyframes envelopeOpen{0%{transform:rotateX(0deg)}100%{transform:rotateX(180deg)}}
  @keyframes slideReveal{0%{clip-path:inset(0 0 100% 0)}100%{clip-path:inset(0 0 0 0)}}
  @keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
  @keyframes gentleGlow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.15)}}
  @keyframes musicPulse{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}
  @keyframes waveMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{overflow-x:hidden}
  input,textarea,select,button{font-family:inherit}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(128,128,128,0.25);border-radius:3px}
`;
document.head.appendChild(sty);

/* ═══════════════════════════════════════════════════════════
   9 TEMPLATES
   ═══════════════════════════════════════════════════════════ */
const TEMPLATES = [
  {
    id:"enchanted-forest",name:"Enchanted Forest",tagline:"Where nature whispers love",
    preview:"🌿",
    bg:"linear-gradient(170deg,#05120a 0%,#0a2818 35%,#071f10 65%,#030d06 100%)",
    accent:"#c9a96e",accent2:"#6db88f",text:"#e8e4d8",
    fontD:"'Playfair Display',serif",fontB:"'Cormorant Garamond',serif",
    card:"rgba(5,18,10,0.88)",border:"1.5px solid rgba(201,169,110,0.3)",
    orn:"❧",particles:"leaves",
    musicNote:"🍃",
  },
  {
    id:"celestial-night",name:"Celestial Night",tagline:"Written in the stars",
    preview:"✦",
    bg:"linear-gradient(180deg,#05051e 0%,#0d0b35 30%,#15104a 60%,#080628 100%)",
    accent:"#f0deb4",accent2:"#8b7cc8",text:"#e4ddf0",
    fontD:"'Cinzel',serif",fontB:"'Raleway',sans-serif",
    card:"rgba(13,11,53,0.85)",border:"1px solid rgba(240,222,180,0.2)",
    orn:"☽",particles:"stars",
    musicNote:"⭐",
  },
  {
    id:"rose-blush",name:"Rosé Blush",tagline:"Blushing elegance",
    preview:"🌸",
    bg:"linear-gradient(155deg,#fef5f3 0%,#fce8e6 30%,#f9ddd8 60%,#fef5f3 100%)",
    accent:"#c06070",accent2:"#d4a27a",text:"#3a2528",
    fontD:"'Bodoni Moda',serif",fontB:"'Lora',serif",
    card:"rgba(255,255,255,0.72)",border:"1px solid rgba(192,96,112,0.2)",
    orn:"❀",particles:"petals",
    musicNote:"🌹",
  },
  {
    id:"art-deco-gold",name:"Art Deco Gold",tagline:"Roaring twenties glamour",
    preview:"◆",
    bg:"linear-gradient(180deg,#0c0c0c 0%,#171717 50%,#0c0c0c 100%)",
    accent:"#d4af37",accent2:"#a0a0a0",text:"#f0ebe0",
    fontD:"'Cinzel Decorative',serif",fontB:"'Josefin Sans',sans-serif",
    card:"rgba(18,18,18,0.92)",border:"2px solid rgba(212,175,55,0.45)",
    orn:"✧",particles:"gold",
    musicNote:"🎷",
  },
  {
    id:"tuscan-sun",name:"Tuscan Sun",tagline:"Golden hills, eternal vows",
    preview:"🫒",
    bg:"linear-gradient(160deg,#f6f0df 0%,#faf4e6 30%,#f0e8d0 60%,#f6f0df 100%)",
    accent:"#5a7a4a",accent2:"#c08040",text:"#2a2418",
    fontD:"'Italiana',serif",fontB:"'Source Serif 4',serif",
    card:"rgba(255,250,238,0.78)",border:"1px solid rgba(90,122,74,0.22)",
    orn:"☘",particles:"none",
    musicNote:"🌻",
  },
  {
    id:"midnight-bloom",name:"Midnight Bloom",tagline:"Dark florals, deep love",
    preview:"🥀",
    bg:"linear-gradient(165deg,#0e050a 0%,#1a0e18 35%,#120815 65%,#08030a 100%)",
    accent:"#e8a0b8",accent2:"#7858a0",text:"#f0e8ef",
    fontD:"'DM Serif Display',serif",fontB:"'Raleway',sans-serif",
    card:"rgba(14,5,10,0.88)",border:"1.5px solid rgba(232,160,184,0.25)",
    orn:"❁",particles:"petals",
    musicNote:"🌙",
  },
  {
    id:"royal-indian",name:"Royal Indian",tagline:"Regal traditions, modern love",
    preview:"🪷",
    bg:"linear-gradient(170deg,#1a0508 0%,#2d0a12 35%,#1f0610 65%,#120308 100%)",
    accent:"#e8c850",accent2:"#e85040",text:"#f8f0e0",
    fontD:"'Playfair Display',serif",fontB:"'Cormorant Garamond',serif",
    card:"rgba(26,5,8,0.9)",border:"2px solid rgba(232,200,80,0.35)",
    orn:"✿",particles:"gold",
    musicNote:"🪔",
  },
  {
    id:"zen-minimal",name:"Zen Minimal",tagline:"Silence speaks volumes",
    preview:"◯",
    bg:"linear-gradient(180deg,#fafaf7 0%,#f5f5ef 50%,#fafaf7 100%)",
    accent:"#2c2c28",accent2:"#8a8878",text:"#2c2c28",
    fontD:"'Cormorant',serif",fontB:"'Karla',sans-serif",
    card:"rgba(255,255,255,0.55)",border:"1px solid rgba(44,44,40,0.08)",
    orn:"·",particles:"none",
    musicNote:"🎋",
  },
  {
    id:"ocean-breeze",name:"Ocean Breeze",tagline:"Waves of forever",
    preview:"🐚",
    bg:"linear-gradient(175deg,#f0f5f8 0%,#dce8f0 30%,#c8d8e8 60%,#f0f5f8 100%)",
    accent:"#2a5a7a",accent2:"#c0905a",text:"#1a2830",
    fontD:"'Libre Baskerville',serif",fontB:"'Tenor Sans',sans-serif",
    card:"rgba(255,255,255,0.7)",border:"1px solid rgba(42,90,122,0.18)",
    orn:"∿",particles:"none",
    musicNote:"🌊",
  },
];

const COUPLE_DEF = {
  p1:"Priya",p2:"Arjun",date:"2026-12-12",time:"18:00",
  venue:"The Grand Palace Gardens",addr:"42 Heritage Lane, Jaipur, Rajasthan",
  story:"We met at a coffee shop on a rainy afternoon. What started as a conversation about books turned into a lifetime of love. Two souls, one journey — and it begins here.",
  parentsBride:"Mr. & Mrs. Sharma",parentsGroom:"Mr. & Mrs. Patel",
  dressCode:"Elegant Traditional",
};
const EVENTS_DEF = [
  {name:"Mehendi",date:"2026-12-10",time:"16:00",venue:"Sharma Residence",icon:"🌿",desc:"Celebrate with henna art & music"},
  {name:"Sangeet Night",date:"2026-12-11",time:"19:00",venue:"The Grand Palace Gardens",icon:"🎶",desc:"Dance the night away"},
  {name:"Wedding Ceremony",date:"2026-12-12",time:"18:00",venue:"The Grand Palace Gardens",icon:"💍",desc:"The sacred union"},
  {name:"Reception",date:"2026-12-12",time:"20:30",venue:"The Grand Palace Gardens",icon:"🥂",desc:"Toast to forever"},
];

/* ═══════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════ */
function useCountdown(d){
  const[t,sT]=useState({});
  useEffect(()=>{
    const c=()=>{const df=new Date(d)-new Date();if(df<=0)return{d:0,h:0,m:0,s:0};return{d:Math.floor(df/864e5),h:Math.floor(df/36e5%24),m:Math.floor(df/6e4%60),s:Math.floor(df/1e3%60)};};
    sT(c());const id=setInterval(()=>sT(c()),1000);return()=>clearInterval(id);
  },[d]);
  return t;
}
function useInView(th=0.12){
  const r=useRef(null);const[v,sV]=useState(false);
  useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([en])=>{if(en.isIntersecting){sV(true);o.disconnect();}},{threshold:th});o.observe(e);return()=>o.disconnect();},[th]);
  return[r,v];
}
function useParallax(){
  const[y,sY]=useState(0);
  useEffect(()=>{const h=()=>sY(window.scrollY);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);
  return y;
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED SECTION
   ═══════════════════════════════════════════════════════════ */
function Anim({children,delay=0,style={}}){
  const[r,v]=useInView();
  return <div ref={r} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(45px)",transition:`opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,...style}}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════════
   PARTICLE BACKGROUNDS
   ═══════════════════════════════════════════════════════════ */
function ParticleBg({type,accent}){
  const canvasRef=useRef(null);
  const particles=useRef([]);
  const raf=useRef(null);

  useEffect(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    let W,H;
    const resize=()=>{W=c.width=window.innerWidth;H=c.height=document.documentElement.scrollHeight;};
    resize();window.addEventListener("resize",resize);

    const N=type==="stars"?80:type==="petals"?35:type==="leaves"?28:type==="gold"?45:0;
    particles.current=[];
    for(let i=0;i<N;i++){
      particles.current.push({
        x:Math.random()*W,y:Math.random()*H,
        size:type==="stars"?Math.random()*2.5+0.5:type==="gold"?Math.random()*3+1:Math.random()*8+4,
        speedY:type==="stars"?0:Math.random()*0.3+0.1,
        speedX:type==="stars"?0:(Math.random()-0.5)*0.4,
        opacity:Math.random()*0.5+0.2,
        phase:Math.random()*Math.PI*2,
        rot:Math.random()*360,
        rotSpeed:(Math.random()-0.5)*0.8,
      });
    }

    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      const t=Date.now()*0.001;
      particles.current.forEach(p=>{
        ctx.save();
        ctx.globalAlpha=p.opacity;
        if(type==="stars"){
          const tw=Math.sin(t*1.5+p.phase)*0.5+0.5;
          ctx.globalAlpha=p.opacity*tw;
          ctx.fillStyle=accent;
          ctx.beginPath();ctx.arc(p.x,p.y,p.size*tw,0,Math.PI*2);ctx.fill();
          if(p.size>1.5){ctx.globalAlpha=p.opacity*tw*0.3;ctx.beginPath();ctx.arc(p.x,p.y,p.size*3,0,Math.PI*2);ctx.fill();}
        }else if(type==="petals"){
          p.y+=p.speedY;p.x+=Math.sin(t+p.phase)*0.3+p.speedX;p.rot+=p.rotSpeed;
          if(p.y>H+20){p.y=-20;p.x=Math.random()*W;}
          ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);
          ctx.fillStyle=accent;
          ctx.beginPath();ctx.ellipse(0,0,p.size*0.4,p.size,0,0,Math.PI*2);ctx.fill();
          ctx.globalAlpha=p.opacity*0.5;
          ctx.beginPath();ctx.ellipse(p.size*0.2,0,p.size*0.35,p.size*0.8,0.3,0,Math.PI*2);ctx.fill();
        }else if(type==="leaves"){
          p.y+=p.speedY;p.x+=Math.sin(t*0.5+p.phase)*0.5+p.speedX;p.rot+=p.rotSpeed;
          if(p.y>H+20){p.y=-20;p.x=Math.random()*W;}
          ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);
          ctx.fillStyle=accent;
          ctx.beginPath();
          ctx.moveTo(0,-p.size);ctx.bezierCurveTo(p.size*0.6,-p.size*0.3,p.size*0.6,p.size*0.3,0,p.size);
          ctx.bezierCurveTo(-p.size*0.6,p.size*0.3,-p.size*0.6,-p.size*0.3,0,-p.size);
          ctx.fill();
          ctx.strokeStyle=accent;ctx.globalAlpha=p.opacity*0.6;ctx.lineWidth=0.5;
          ctx.beginPath();ctx.moveTo(0,-p.size);ctx.lineTo(0,p.size);ctx.stroke();
        }else if(type==="gold"){
          p.y+=p.speedY*0.5;p.x+=Math.sin(t*0.7+p.phase)*0.2;p.rot+=p.rotSpeed*0.5;
          if(p.y>H+10){p.y=-10;p.x=Math.random()*W;}
          const tw=Math.sin(t*2+p.phase)*0.4+0.6;
          ctx.globalAlpha=p.opacity*tw;
          ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);
          ctx.fillStyle=accent;
          ctx.beginPath();
          const s=p.size;
          ctx.moveTo(0,-s);ctx.lineTo(s*0.3,0);ctx.lineTo(0,s);ctx.lineTo(-s*0.3,0);ctx.closePath();ctx.fill();
        }
        ctx.restore();
      });
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>{window.removeEventListener("resize",resize);cancelAnimationFrame(raf.current);};
  },[type,accent]);

  if(type==="none")return null;
  return <canvas ref={canvasRef} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1}}/>;
}

/* ═══════════════════════════════════════════════════════════
   MUSIC PLAYER
   ═══════════════════════════════════════════════════════════ */
function MusicPlayer({accent,text,isDark}){
  const[playing,setPlaying]=useState(false);
  const audioRef=useRef(null);

  useEffect(()=>{
    // Create an audio context with a gentle melody using OscillatorNode
    const ac=new (window.AudioContext||window.webkitAudioContext)();
    audioRef.current=ac;
    return()=>{if(ac.state!=="closed")ac.close();};
  },[]);

  const toggle=useCallback(()=>{
    if(!audioRef.current)return;
    const ac=audioRef.current;
    if(!playing){
      if(ac.state==="suspended")ac.resume();
      // Play a gentle ambient wedding melody loop
      const notes=[523.25,659.25,783.99,659.25,523.25,392.00,440.00,523.25];
      const now=ac.currentTime;
      notes.forEach((freq,i)=>{
        const osc=ac.createOscillator();const gain=ac.createGain();
        osc.type="sine";osc.frequency.value=freq;
        gain.gain.setValueAtTime(0,now+i*0.6);
        gain.gain.linearRampToValueAtTime(0.06,now+i*0.6+0.1);
        gain.gain.linearRampToValueAtTime(0.04,now+i*0.6+0.4);
        gain.gain.linearRampToValueAtTime(0,now+i*0.6+0.58);
        osc.connect(gain);gain.connect(ac.destination);
        osc.start(now+i*0.6);osc.stop(now+i*0.6+0.6);
        // Harmonic
        const osc2=ac.createOscillator();const gain2=ac.createGain();
        osc2.type="sine";osc2.frequency.value=freq*1.5;
        gain2.gain.setValueAtTime(0,now+i*0.6);
        gain2.gain.linearRampToValueAtTime(0.015,now+i*0.6+0.1);
        gain2.gain.linearRampToValueAtTime(0,now+i*0.6+0.55);
        osc2.connect(gain2);gain2.connect(ac.destination);
        osc2.start(now+i*0.6);osc2.stop(now+i*0.6+0.6);
      });
    }
    setPlaying(!playing);
  },[playing]);

  return(
    <button onClick={toggle} style={{
      position:"fixed",bottom:24,right:24,zIndex:1000,
      width:52,height:52,borderRadius:"50%",
      background:isDark?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.8)",
      backdropFilter:"blur(12px)",
      border:`1.5px solid ${accent}50`,
      cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:3,
      boxShadow:`0 4px 24px rgba(0,0,0,0.3)`,
      transition:"transform 0.3s",
    }}
    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12)"}
    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
    title={playing?"Pause Music":"Play Music"}>
      {playing ? (
        <div style={{display:"flex",gap:2,alignItems:"center",height:20}}>
          {[0,0.15,0.3,0.1].map((d,i)=>(
            <div key={i} style={{width:3,height:16,background:accent,borderRadius:2,animation:`musicPulse 0.6s ease ${d}s infinite alternate`}}/>
          ))}
        </div>
      ):(
        <svg width="20" height="20" viewBox="0 0 24 24" fill={accent}><polygon points="6,3 20,12 6,21"/></svg>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONFETTI BURST
   ═══════════════════════════════════════════════════════════ */
function ConfettiBurst({active,colors}){
  if(!active)return null;
  const pieces=Array.from({length:50},(_,i)=>({
    id:i,x:Math.random()*100,color:colors[Math.floor(Math.random()*colors.length)],
    delay:Math.random()*0.5,size:Math.random()*8+4,dur:Math.random()*2+2,
    rot:Math.random()*360,
  }));
  return(
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:"absolute",top:-10,left:`${p.x}%`,
          width:p.size,height:p.size*0.6,
          background:p.color,borderRadius:2,
          animation:`confettiFall ${p.dur}s ease ${p.delay}s forwards`,
          transform:`rotate(${p.rot}deg)`,
        }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DIVIDER
   ═══════════════════════════════════════════════════════════ */
function Div({t}){
  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:18,margin:"36px 0",opacity:0.45}}>
    <div style={{width:70,height:1,background:`linear-gradient(90deg,transparent,${t.accent})`}}/>
    <span style={{color:t.accent,fontSize:20,fontFamily:t.fontD,animation:"float 4s ease infinite"}}>{t.orn}</span>
    <div style={{width:70,height:1,background:`linear-gradient(90deg,${t.accent},transparent)`}}/>
  </div>;
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */
const fmtDate=d=>{try{return new Date(d+"T00:00:00").toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});}catch{return d;}};
const fmtTime=t=>{try{const[h,m]=t.split(":");const hr=+h;return`${hr>12?hr-12:hr||12}:${m} ${hr>=12?"PM":"AM"}`;}catch{return t;}};
const isDarkBg=bg=>bg.includes("#0")||bg.includes("#1");

/* ═══════════════════════════════════════════════════════════
   TEMPLATE SELECTOR (PHASE 1)
   ═══════════════════════════════════════════════════════════ */
function TemplateSelector({onSelect}){
  const[hov,setHov]=useState(null);
  const[filter,setFilter]=useState("all");
  const cats={all:"All",dark:["enchanted-forest","celestial-night","art-deco-gold","midnight-bloom","royal-indian"],light:["rose-blush","tuscan-sun","zen-minimal","ocean-breeze"]};
  const filtered=filter==="all"?TEMPLATES:TEMPLATES.filter(t=>cats[filter].includes(t.id));

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(165deg,#08080f 0%,#10101f 40%,#0a0a18 100%)",padding:"50px 20px",fontFamily:"'Cormorant Garamond',serif",position:"relative",overflow:"hidden"}}>
      {/* Ambient background */}
      <div style={{position:"absolute",top:"10%",left:"15%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,169,110,0.04) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"20%",right:"10%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,124,200,0.04) 0%,transparent 70%)",pointerEvents:"none"}}/>

      <div style={{maxWidth:1200,margin:"0 auto",position:"relative",zIndex:2}}>
        <div style={{textAlign:"center",marginBottom:50,animation:"fadeUp 1s ease"}}>
          <p style={{color:"rgba(240,222,180,0.45)",fontSize:12,letterSpacing:8,textTransform:"uppercase",marginBottom:16,fontFamily:"'Raleway',sans-serif",fontWeight:300}}>✦ Digital Wedding Invitations ✦</p>
          <h1 style={{color:"#f0deb4",fontSize:"clamp(36px,6vw,64px)",fontWeight:400,lineHeight:1.15,fontFamily:"'Playfair Display',serif"}}>Choose Your<br/><em style={{fontStyle:"italic",color:"#c9a96e"}}>Love Story</em></h1>
          <p style={{color:"rgba(240,222,180,0.4)",fontSize:15,marginTop:16,maxWidth:480,margin:"16px auto 0",fontFamily:"'Raleway',sans-serif",fontWeight:300,lineHeight:1.7}}>
            9 handcrafted templates with animated backgrounds, music, countdown & more
          </p>
        </div>

        {/* Filter */}
        <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:40,animation:"fadeUp 1s ease 0.2s both"}}>
          {[["all","All Templates"],["dark","Dark & Moody"],["light","Light & Airy"]].map(([k,l])=>(
            <button key={k} onClick={()=>setFilter(k)} style={{
              padding:"10px 24px",borderRadius:24,cursor:"pointer",fontSize:13,
              fontFamily:"'Raleway',sans-serif",letterSpacing:1.5,textTransform:"uppercase",
              background:filter===k?"rgba(201,169,110,0.15)":"transparent",
              border:filter===k?"1px solid rgba(201,169,110,0.4)":"1px solid rgba(255,255,255,0.08)",
              color:filter===k?"#f0deb4":"rgba(255,255,255,0.35)",transition:"all 0.3s",
            }}>{l}</button>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:20}}>
          {filtered.map((t,i)=>{
            const dk=isDarkBg(t.bg);
            return(
            <div key={t.id}
              onMouseEnter={()=>setHov(t.id)} onMouseLeave={()=>setHov(null)}
              onClick={()=>onSelect(t)}
              style={{
                background:t.bg,borderRadius:20,padding:0,cursor:"pointer",
                transition:"all 0.6s cubic-bezier(0.23,1,0.32,1)",
                transform:hov===t.id?"translateY(-10px) scale(1.025)":"translateY(0) scale(1)",
                boxShadow:hov===t.id?`0 24px 60px rgba(0,0,0,0.5),0 0 40px ${t.accent}10`:"0 4px 24px rgba(0,0,0,0.25)",
                animation:`fadeUp 0.8s ease ${i*0.08}s both`,
                position:"relative",overflow:"hidden",border:t.border,minHeight:280,
              }}>
              {/* Mini particle preview */}
              {t.particles!=="none" && hov===t.id && (
                <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
                  {Array.from({length:8}).map((_,j)=>(
                    <div key={j} style={{
                      position:"absolute",
                      left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,
                      width:Math.random()*6+3,height:Math.random()*6+3,
                      background:t.accent,borderRadius:"50%",opacity:Math.random()*0.3+0.1,
                      animation:`sparkle ${Math.random()*2+1}s ease ${Math.random()}s infinite`,
                    }}/>
                  ))}
                </div>
              )}
              <div style={{padding:"36px 32px",position:"relative",zIndex:2}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                  <span style={{fontSize:40,animation:hov===t.id?"float 2s ease infinite":"none",transition:"0.3s"}}>{t.preview}</span>
                  <span style={{fontSize:11,color:t.accent,opacity:0.5,fontFamily:t.fontB,letterSpacing:2,textTransform:"uppercase"}}>{t.particles!=="none"?`${t.particles} bg`:"clean"}</span>
                </div>
                <h2 style={{fontFamily:t.fontD,color:t.accent,fontSize:24,fontWeight:400,marginBottom:6}}>{t.name}</h2>
                <p style={{fontFamily:t.fontB,color:t.text,opacity:0.55,fontSize:14,fontWeight:300,lineHeight:1.6}}>{t.tagline}</p>

                <div style={{marginTop:24,display:"flex",alignItems:"center",gap:6}}>
                  {[t.accent,t.accent2,t.text].map((c,j)=>(
                    <div key={j} style={{width:18,height:18,borderRadius:"50%",background:c,border:`1.5px solid ${dk?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)"}`,opacity:j===2?0.4:1}}/>
                  ))}
                  <span style={{marginLeft:"auto",color:t.accent,fontSize:12,fontFamily:t.fontB,opacity:hov===t.id?1:0.4,transition:"all 0.4s",letterSpacing:3,textTransform:"uppercase"}}>
                    Open →
                  </span>
                </div>
              </div>
              {/* Bottom accent bar */}
              <div style={{height:3,background:`linear-gradient(90deg,transparent,${t.accent},transparent)`,opacity:hov===t.id?0.6:0.15,transition:"opacity 0.4s"}}/>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EDITOR (PHASE 2)
   ═══════════════════════════════════════════════════════════ */
function Editor({t,couple:c,setCouple:sC,events:ev,setEvents:sE,onPreview,onBack}){
  const dk=isDarkBg(t.bg);
  const inp={width:"100%",padding:"13px 16px",background:dk?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.04)",border:t.border,borderRadius:10,color:t.text,fontSize:15,fontFamily:t.fontB,outline:"none"};
  const lab={display:"block",color:t.accent,fontSize:11,letterSpacing:2.5,textTransform:"uppercase",marginBottom:8,fontFamily:t.fontB,fontWeight:400};
  const sec={background:t.card,border:t.border,borderRadius:18,padding:32,marginBottom:24,backdropFilter:"blur(8px)"};

  return(
    <div style={{minHeight:"100vh",background:t.bg,padding:"40px 20px",fontFamily:t.fontB,position:"relative"}}>
      <ParticleBg type={t.particles} accent={t.accent}/>
      <div style={{maxWidth:720,margin:"0 auto",position:"relative",zIndex:2}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:t.accent,cursor:"pointer",fontSize:13,marginBottom:28,fontFamily:t.fontB,letterSpacing:2,opacity:0.6}}>← TEMPLATES</button>
        <Anim><h1 style={{fontFamily:t.fontD,color:t.accent,fontSize:"clamp(28px,4vw,40px)",fontWeight:400,marginBottom:4}}>Customize</h1><p style={{color:t.text,opacity:0.5,marginBottom:36,fontSize:14}}>{t.name} template</p></Anim>

        <Anim delay={0.1}><div style={sec}>
          <h3 style={{fontFamily:t.fontD,color:t.accent,fontSize:20,marginBottom:24}}>💍 The Couple</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div><label style={lab}>Partner 1</label><input style={inp} value={c.p1} onChange={e=>sC({...c,p1:e.target.value})}/></div>
            <div><label style={lab}>Partner 2</label><input style={inp} value={c.p2} onChange={e=>sC({...c,p2:e.target.value})}/></div>
            <div><label style={lab}>Wedding Date</label><input type="date" style={inp} value={c.date} onChange={e=>sC({...c,date:e.target.value})}/></div>
            <div><label style={lab}>Time</label><input type="time" style={inp} value={c.time} onChange={e=>sC({...c,time:e.target.value})}/></div>
            <div><label style={lab}>Bride's Family</label><input style={inp} value={c.parentsBride} onChange={e=>sC({...c,parentsBride:e.target.value})}/></div>
            <div><label style={lab}>Groom's Family</label><input style={inp} value={c.parentsGroom} onChange={e=>sC({...c,parentsGroom:e.target.value})}/></div>
          </div>
          <div style={{marginTop:14}}><label style={lab}>Venue Name</label><input style={inp} value={c.venue} onChange={e=>sC({...c,venue:e.target.value})}/></div>
          <div style={{marginTop:14}}><label style={lab}>Venue Address</label><input style={inp} value={c.addr} onChange={e=>sC({...c,addr:e.target.value})}/></div>
          <div style={{marginTop:14}}><label style={lab}>Dress Code</label><input style={inp} value={c.dressCode} onChange={e=>sC({...c,dressCode:e.target.value})}/></div>
          <div style={{marginTop:14}}><label style={lab}>Your Love Story</label><textarea rows={3} style={{...inp,resize:"vertical"}} value={c.story} onChange={e=>sC({...c,story:e.target.value})}/></div>
        </div></Anim>

        <Anim delay={0.2}><div style={sec}>
          <h3 style={{fontFamily:t.fontD,color:t.accent,fontSize:20,marginBottom:24}}>📅 Events</h3>
          {ev.map((e,i)=>(
            <div key={i} style={{background:dk?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)",borderRadius:12,padding:16,marginBottom:12,border:`1px solid ${t.accent}10`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{color:t.accent,fontSize:13,fontFamily:t.fontD}}>{e.icon} Event {i+1}</span>
                <button onClick={()=>sE(ev.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"#c05050",cursor:"pointer",fontSize:18}}>×</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={{...lab,fontSize:10}}>Name</label><input style={{...inp,padding:"10px 12px",fontSize:13}} value={e.name} onChange={x=>{const u=[...ev];u[i].name=x.target.value;sE(u);}}/></div>
                <div><label style={{...lab,fontSize:10}}>Date</label><input type="date" style={{...inp,padding:"10px 12px",fontSize:13}} value={e.date} onChange={x=>{const u=[...ev];u[i].date=x.target.value;sE(u);}}/></div>
                <div><label style={{...lab,fontSize:10}}>Time</label><input type="time" style={{...inp,padding:"10px 12px",fontSize:13}} value={e.time} onChange={x=>{const u=[...ev];u[i].time=x.target.value;sE(u);}}/></div>
                <div><label style={{...lab,fontSize:10}}>Venue</label><input style={{...inp,padding:"10px 12px",fontSize:13}} value={e.venue} onChange={x=>{const u=[...ev];u[i].venue=x.target.value;sE(u);}}/></div>
              </div>
              <div style={{marginTop:10}}><label style={{...lab,fontSize:10}}>Description</label><input style={{...inp,padding:"10px 12px",fontSize:13}} value={e.desc} onChange={x=>{const u=[...ev];u[i].desc=x.target.value;sE(u);}}/></div>
            </div>
          ))}
          <button onClick={()=>sE([...ev,{name:"",date:c.date,time:"",venue:"",icon:"✦",desc:""}])} style={{background:"none",border:`1px dashed ${t.accent}40`,color:t.accent,padding:"12px 24px",borderRadius:10,cursor:"pointer",fontSize:13,fontFamily:t.fontB,marginTop:4,width:"100%",letterSpacing:1}}>+ Add Event</button>
        </div></Anim>

        <Anim delay={0.3}>
          <button onClick={onPreview} style={{
            width:"100%",padding:"20px",background:`linear-gradient(135deg,${t.accent},${t.accent2})`,
            color:dk?"#0a0a0a":"#fff",border:"none",borderRadius:14,fontSize:16,
            fontFamily:t.fontD,letterSpacing:4,textTransform:"uppercase",cursor:"pointer",
            transition:"all 0.3s",boxShadow:`0 8px 32px ${t.accent}30`,
          }}
          onMouseEnter={e=>{e.target.style.transform="translateY(-3px)";e.target.style.boxShadow=`0 14px 40px ${t.accent}40`;}}
          onMouseLeave={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow=`0 8px 32px ${t.accent}30`;}}
          >✨ Preview Invitation</button>
        </Anim>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FULL INVITATION PREVIEW (PHASE 3)
   ═══════════════════════════════════════════════════════════ */
function Preview({t,couple:c,events:ev,onBack}){
  const cd=useCountdown(c.date+"T"+c.time);
  const scrollY=useParallax();
  const[opened,setOpened]=useState(false);
  const[confetti,setConfetti]=useState(false);
  const dk=isDarkBg(t.bg);
  const btnC=dk?"#0a0a0a":"#fff";

  const secPad={padding:"90px 20px",maxWidth:720,margin:"0 auto",position:"relative",zIndex:2};
  const hdg={fontFamily:t.fontD,color:t.accent,fontSize:"clamp(26px,4vw,40px)",fontWeight:400,textAlign:"center",marginBottom:10};
  const sub={fontFamily:t.fontB,color:t.text,opacity:0.6,textAlign:"center",fontSize:15,lineHeight:1.8};

  // ─── ENVELOPE OPENING ───
  if(!opened){
    return(
      <div style={{minHeight:"100vh",background:t.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:t.fontB,padding:20,position:"relative",overflow:"hidden"}}>
        <ParticleBg type={t.particles} accent={t.accent}/>
        <div style={{position:"relative",zIndex:2,textAlign:"center"}}>
          <Anim>
            <p style={{color:t.text,opacity:0.4,fontSize:12,letterSpacing:6,textTransform:"uppercase",marginBottom:32}}>This invitation is exclusively for you</p>
            {/* Envelope */}
            <div onClick={()=>{setOpened(true);setConfetti(true);setTimeout(()=>setConfetti(false),3000);}}
              style={{
                width:200,height:150,margin:"0 auto",cursor:"pointer",position:"relative",
                perspective:800,
              }}
              onMouseEnter={e=>e.currentTarget.querySelector('.env-body').style.transform="scale(1.06)"}
              onMouseLeave={e=>e.currentTarget.querySelector('.env-body').style.transform="scale(1)"}
            >
              <div className="env-body" style={{
                width:"100%",height:"100%",
                background:`linear-gradient(135deg,${t.card},${dk?"rgba(30,30,30,0.95)":"rgba(255,255,255,0.9)"})`,
                border:t.border,borderRadius:14,
                display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",
                animation:"pulse 3s ease infinite",transition:"transform 0.4s",
                boxShadow:`0 12px 40px rgba(0,0,0,0.3),inset 0 1px 0 ${t.accent}15`,
              }}>
                <span style={{fontSize:52,marginBottom:8}}>💌</span>
                <div style={{
                  background:`linear-gradient(135deg,${t.accent},${t.accent2})`,color:btnC,
                  padding:"6px 20px",borderRadius:20,fontSize:11,letterSpacing:2.5,
                  fontFamily:t.fontB,textTransform:"uppercase",
                  animation:"gentleGlow 2s ease infinite",
                }}>Tap to Open</div>
              </div>
            </div>
            <p style={{color:t.accent,opacity:0.6,fontSize:16,marginTop:32,fontFamily:t.fontD}}>
              {c.p1} & {c.p2}
            </p>
            <p style={{color:t.text,opacity:0.3,fontSize:12,marginTop:8}}>{fmtDate(c.date)}</p>
            <button onClick={onBack} style={{background:"none",border:"none",color:t.accent,cursor:"pointer",fontSize:12,marginTop:32,fontFamily:t.fontB,letterSpacing:2,opacity:0.4}}>← CHANGE TEMPLATE</button>
          </Anim>
        </div>
        <ConfettiBurst active={confetti} colors={[t.accent,t.accent2,t.text,"#fff"]}/>
      </div>
    );
  }

  return(
    <div style={{background:t.bg,minHeight:"100vh",fontFamily:t.fontB,color:t.text,position:"relative",overflow:"hidden"}}>
      <ParticleBg type={t.particles} accent={t.accent}/>
      <MusicPlayer accent={t.accent} text={t.text} isDark={dk}/>
      <ConfettiBurst active={confetti} colors={[t.accent,t.accent2,"#fff"]}/>

      {/* ─── HERO ─── */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:24,position:"relative",zIndex:2}}>
        {/* Parallax decorative ring */}
        <div style={{
          position:"absolute",width:"clamp(300px,60vw,500px)",height:"clamp(300px,60vw,500px)",
          border:`1px solid ${t.accent}10`,borderRadius:"50%",
          transform:`translateY(${scrollY*0.08}px) rotate(${scrollY*0.02}deg)`,
          pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute",width:"clamp(340px,65vw,560px)",height:"clamp(340px,65vw,560px)",
          border:`1px solid ${t.accent2}08`,borderRadius:"50%",
          transform:`translateY(${scrollY*0.12}px) rotate(${-scrollY*0.015}deg)`,
          pointerEvents:"none",
        }}/>

        <div style={{animation:"fadeIn 1.8s ease",position:"relative",zIndex:2}}>
          <p style={{fontSize:12,letterSpacing:7,textTransform:"uppercase",opacity:0.4,marginBottom:20}}>Together with their families</p>
          <p style={{fontSize:14,opacity:0.45,marginBottom:6,fontStyle:"italic"}}>{c.parentsBride}</p>
          <p style={{fontSize:12,opacity:0.3,marginBottom:6}}>&</p>
          <p style={{fontSize:14,opacity:0.45,marginBottom:28,fontStyle:"italic"}}>{c.parentsGroom}</p>
          <p style={{fontSize:12,letterSpacing:4,opacity:0.35,marginBottom:36}}>invite you to celebrate the marriage of</p>
        </div>

        <div style={{animation:"fadeUp 1.2s ease 0.4s both",position:"relative",zIndex:2}}>
          <h1 style={{fontFamily:t.fontD,fontSize:"clamp(46px,9vw,88px)",fontWeight:400,color:t.accent,lineHeight:1.05,marginBottom:4,textShadow:`0 0 80px ${t.accent}15`}}>
            {c.p1}
          </h1>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,margin:"4px 0"}}>
            <div style={{width:50,height:1,background:`linear-gradient(90deg,transparent,${t.accent}60)`}}/>
            <span style={{fontFamily:t.fontD,fontSize:"clamp(22px,4vw,36px)",color:t.accent2,fontStyle:"italic",animation:"float 4s ease infinite"}}>&</span>
            <div style={{width:50,height:1,background:`linear-gradient(90deg,${t.accent}60,transparent)`}}/>
          </div>
          <h1 style={{fontFamily:t.fontD,fontSize:"clamp(46px,9vw,88px)",fontWeight:400,color:t.accent,lineHeight:1.05,textShadow:`0 0 80px ${t.accent}15`}}>
            {c.p2}
          </h1>
        </div>

        <div style={{animation:"fadeUp 1.2s ease 0.8s both",marginTop:44,position:"relative",zIndex:2}}>
          <p style={{fontFamily:t.fontD,fontSize:"clamp(18px,2.5vw,26px)",color:t.text,opacity:0.75}}>{fmtDate(c.date)}</p>
          <p style={{fontSize:14,opacity:0.45,marginTop:10}}>{fmtTime(c.time)} · {c.venue}</p>
          {c.dressCode && <p style={{fontSize:12,opacity:0.35,marginTop:8,letterSpacing:2}}>Dress Code: {c.dressCode}</p>}
        </div>

        <div style={{position:"absolute",bottom:40,animation:"float 3s ease infinite",zIndex:2}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:0.3}}>
            <span style={{fontSize:11,letterSpacing:3,textTransform:"uppercase"}}>Scroll</span>
            <span style={{fontSize:22}}>↓</span>
          </div>
        </div>
      </section>

      {/* ─── COUNTDOWN ─── */}
      <section style={secPad}>
        <Anim>
          <h2 style={hdg}>Counting Down</h2>
          <p style={sub}>to our forever together</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginTop:40,maxWidth:520,margin:"40px auto 0"}}>
            {[["Days",cd.d],["Hours",cd.h],["Min",cd.m],["Sec",cd.s]].map(([l,v],i)=>(
              <Anim key={l} delay={i*0.1}>
                <div style={{
                  background:t.card,border:t.border,borderRadius:14,padding:"28px 10px",textAlign:"center",
                  backdropFilter:"blur(8px)",position:"relative",overflow:"hidden",
                }}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${t.accent}40,transparent)`}}/>
                  <div style={{fontFamily:t.fontD,fontSize:"clamp(30px,5vw,48px)",color:t.accent,fontWeight:400,lineHeight:1}}>{v??0}</div>
                  <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",opacity:0.4,marginTop:10}}>{l}</div>
                </div>
              </Anim>
            ))}
          </div>
        </Anim>
      </section>

      {/* ─── OUR STORY ─── */}
      {c.story&&(
        <section style={secPad}>
          <Anim>
            <h2 style={hdg}>Our Love Story</h2>
            <Div t={t}/>
            <div style={{background:t.card,border:t.border,borderRadius:18,padding:"40px 32px",backdropFilter:"blur(8px)",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:16,left:24,fontSize:60,fontFamily:t.fontD,color:t.accent,opacity:0.1,lineHeight:1}}>"</div>
              <p style={{...sub,maxWidth:520,margin:"0 auto",lineHeight:2.1,fontSize:17,fontStyle:"italic",position:"relative",zIndex:2}}>
                {c.story}
              </p>
              <div style={{position:"absolute",bottom:16,right:24,fontSize:60,fontFamily:t.fontD,color:t.accent,opacity:0.1,lineHeight:1,transform:"rotate(180deg)"}}>"</div>
            </div>
          </Anim>
        </section>
      )}

      {/* ─── EVENTS (one full page per event) ─── */}
      {ev.length>0&&ev.map((e,i)=>(
        <section key={i} style={{
          minHeight:"100vh",display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center",
          padding:"80px 20px",position:"relative",zIndex:2,
          borderTop:`1px solid ${t.accent}08`,
        }}>
          {/* Decorative background rings */}
          <div style={{position:"absolute",width:"clamp(320px,55vw,480px)",height:"clamp(320px,55vw,480px)",border:`1px solid ${t.accent}08`,borderRadius:"50%",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",width:"clamp(440px,72vw,640px)",height:"clamp(440px,72vw,640px)",border:`1px solid ${t.accent}04`,borderRadius:"50%",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>

          <Anim style={{width:"100%",maxWidth:560,textAlign:"center"}}>
            {/* Large ghost number */}
            <p style={{fontFamily:t.fontD,fontSize:"clamp(80px,14vw,120px)",fontWeight:400,color:t.accent,opacity:0.05,lineHeight:1,marginBottom:-30,userSelect:"none",pointerEvents:"none"}}>0{i+1}</p>
            {/* Icon */}
            <div style={{fontSize:"clamp(60px,9vw,84px)",marginBottom:28,lineHeight:1,animation:"float 4s ease infinite",display:"block"}}>{e.icon}</div>
            {/* Card */}
            <div style={{background:t.card,border:t.border,borderRadius:28,padding:"48px clamp(24px,6vw,44px)",backdropFilter:"blur(16px)",position:"relative",overflow:"hidden",boxShadow:`0 24px 60px rgba(0,0,0,0.18)`}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${t.accent}70,${t.accent2}70,transparent)`}}/>
              {/* Event name */}
              <h2 style={{fontFamily:t.fontD,color:t.accent,fontSize:"clamp(28px,4.5vw,46px)",fontWeight:400,letterSpacing:2,marginBottom:0,lineHeight:1.15}}>{e.name}</h2>
              <Div t={t}/>
              {/* Date & time pill */}
              <div style={{display:"inline-flex",alignItems:"center",gap:10,background:`linear-gradient(135deg,${t.accent}14,${t.accent2}14)`,border:t.border,borderRadius:30,padding:"11px 28px",marginBottom:26,flexWrap:"wrap",justifyContent:"center"}}>
                <span style={{color:t.accent,fontSize:14,fontFamily:t.fontB,letterSpacing:0.5}}>📅 {fmtDate(e.date)}</span>
                {e.time&&<><span style={{color:t.accent,opacity:0.3}}>·</span><span style={{color:t.accent,fontSize:14,fontFamily:t.fontB}}>🕐 {fmtTime(e.time)}</span></>}
              </div>
              {/* Venue */}
              {e.venue&&<p style={{...sub,fontSize:15,marginBottom:e.desc?10:0}}>📍 {e.venue}</p>}
              {/* Description */}
              {e.desc&&<p style={{...sub,fontStyle:"italic",marginTop:4}}>{e.desc}</p>}
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${t.accent}25,transparent)`}}/>
            </div>
            {/* Scroll cue between events */}
            {i<ev.length-1&&(
              <div style={{marginTop:36,display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:0.18}}>
                <div style={{width:1,height:36,background:t.accent}}/>
                <span style={{fontSize:9,letterSpacing:4,color:t.accent,textTransform:"uppercase"}}>Next</span>
              </div>
            )}
          </Anim>
        </section>
      ))}

      {/* ─── VENUE ─── */}
      <section style={secPad}>
        <Anim>
          <h2 style={hdg}>The Venue</h2>
          <Div t={t}/>
          <div style={{background:t.card,border:t.border,borderRadius:20,overflow:"hidden",backdropFilter:"blur(8px)"}}>
            {/* Decorative map area */}
            <div style={{
              height:220,
              background:`linear-gradient(135deg,${t.accent}08,${t.accent2}08)`,
              display:"flex",alignItems:"center",justifyContent:"center",
              position:"relative",overflow:"hidden",
            }}>
              {/* Animated decorative circles */}
              <div style={{position:"absolute",width:200,height:200,border:`1px dashed ${t.accent}15`,borderRadius:"50%",animation:"spin 30s linear infinite"}}/>
              <div style={{position:"absolute",width:280,height:280,border:`1px dashed ${t.accent}10`,borderRadius:"50%",animation:"spin 45s linear infinite reverse"}}/>
              <div style={{textAlign:"center",position:"relative",zIndex:2}}>
                <span style={{fontSize:52,display:"block",marginBottom:14,animation:"float 3s ease infinite"}}>📍</span>
                <p style={{fontFamily:t.fontD,color:t.accent,fontSize:22}}>{c.venue}</p>
                <p style={{color:t.text,opacity:0.45,fontSize:14,marginTop:8,maxWidth:300}}>{c.addr}</p>
              </div>
            </div>
            <div style={{padding:24,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(c.addr)}`} target="_blank" rel="noopener noreferrer"
                style={{
                  display:"inline-flex",alignItems:"center",gap:8,
                  padding:"13px 28px",background:`linear-gradient(135deg,${t.accent},${t.accent2})`,
                  color:btnC,textDecoration:"none",borderRadius:10,fontSize:13,
                  letterSpacing:2,textTransform:"uppercase",fontFamily:t.fontB,transition:"all 0.3s",
                }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
              >🗺 Open Maps</a>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(c.addr)}`} target="_blank" rel="noopener noreferrer"
                style={{
                  display:"inline-flex",alignItems:"center",gap:8,
                  padding:"13px 28px",background:"transparent",
                  color:t.accent,textDecoration:"none",borderRadius:10,fontSize:13,
                  letterSpacing:2,textTransform:"uppercase",fontFamily:t.fontB,
                  border:t.border,transition:"all 0.3s",
                }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
              >🧭 Directions</a>
            </div>
          </div>
        </Anim>
      </section>

      {/* ─── PHOTO GALLERY placeholder ─── */}
      <section style={secPad}>
        <Anim>
          <h2 style={hdg}>Gallery</h2>
          <Div t={t}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:32}}>
            {["Our First Date","The Proposal","Together","Adventures","Family","Forever"].map((label,i)=>(
              <div key={i} style={{
                aspectRatio:"1",background:`linear-gradient(${135+i*20}deg,${t.accent}12,${t.accent2}12)`,
                borderRadius:12,border:t.border,display:"flex",alignItems:"center",justifyContent:"center",
                flexDirection:"column",gap:8,cursor:"pointer",transition:"all 0.4s",position:"relative",overflow:"hidden",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.05)";e.currentTarget.style.boxShadow=`0 8px 32px ${t.accent}20`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none";}}
              >
                <span style={{fontSize:28,opacity:0.4}}>📷</span>
                <span style={{fontSize:11,color:t.accent,opacity:0.5,letterSpacing:1}}>{label}</span>
              </div>
            ))}
          </div>
          <p style={{...sub,marginTop:20,fontSize:13}}>Upload your photos to personalize this section</p>
        </Anim>
      </section>

      {/* ─── FOOTER ─── */}
      <section style={{padding:"70px 20px 90px",textAlign:"center",position:"relative",zIndex:2}}>
        <Anim>
          <div style={{animation:"float 5s ease infinite"}}>
            <span style={{fontSize:40,display:"block",marginBottom:16}}>💒</span>
          </div>
          <p style={{fontFamily:t.fontD,color:t.accent,fontSize:"clamp(26px,4vw,40px)",fontWeight:400,marginBottom:12}}>
            {c.p1} & {c.p2}
          </p>
          <p style={{color:t.text,opacity:0.35,fontSize:14}}>{fmtDate(c.date)}</p>
          <Div t={t}/>
          <p style={{color:t.text,opacity:0.25,fontSize:12,letterSpacing:3}}>MADE WITH ♡</p>
          <div style={{marginTop:28,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={onBack} style={{background:"none",border:`1px solid ${t.accent}25`,color:t.accent,padding:"10px 24px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:t.fontB,letterSpacing:2,opacity:0.5,transition:"opacity 0.3s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.9"}
              onMouseLeave={e=>e.currentTarget.style.opacity="0.5"}
            >← Edit</button>
            <button onClick={()=>{navigator.clipboard?.writeText(window.location.href);}} style={{background:"none",border:`1px solid ${t.accent}25`,color:t.accent,padding:"10px 24px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:t.fontB,letterSpacing:2,opacity:0.5,transition:"opacity 0.3s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.9"}
              onMouseLeave={e=>e.currentTarget.style.opacity="0.5"}
            >🔗 Share</button>
          </div>
        </Anim>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════ */
export default function App(){
  const[phase,setPhase]=useState("select");
  const[tmpl,setTmpl]=useState(null);
  const[couple,setCouple]=useState(COUPLE_DEF);
  const[events,setEvents]=useState(EVENTS_DEF);

  if(phase==="select")return <TemplateSelector onSelect={t=>{setTmpl(t);setPhase("edit");}}/>;
  if(phase==="edit")return <Editor t={tmpl} couple={couple} setCouple={setCouple} events={events} setEvents={setEvents} onPreview={()=>{setPhase("preview");window.scrollTo(0,0);}} onBack={()=>setPhase("select")}/>;
  return <Preview t={tmpl} couple={couple} events={events} onBack={()=>setPhase("edit")}/>;
}
