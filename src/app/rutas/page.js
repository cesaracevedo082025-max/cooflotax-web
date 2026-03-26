'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const rutas = [
  { id:1,  origen:'Duitama',  destino:'Belén',                precio:8000,   dur:'40 min',   freq:'Cada 12 min', cat:'duitama' },
  { id:2,  origen:'Duitama',  destino:'Belencito',            precio:5000,   dur:'38 min',   freq:'Cada 15 min', cat:'duitama' },
  { id:3,  origen:'Duitama',  destino:'Cerinza',              precio:7000,   dur:'30 min',   freq:'Cada 12 min', cat:'duitama' },
  { id:4,  origen:'Duitama',  destino:'Paipa',                precio:4000,   dur:'20 min',   freq:'Cada 12 min', cat:'duitama' },
  { id:5,  origen:'Duitama',  destino:'Paz de Río',           precio:14000,  dur:'75 min',   freq:'Cada 45 min', cat:'duitama' },
  { id:6,  origen:'Duitama',  destino:'Santa Rosa de Viterbo',precio:4300,   dur:'20 min',   freq:'Cada 12 min', cat:'duitama' },
  { id:7,  origen:'Duitama',  destino:'Soatá',                precio:29000,  dur:'2h 40min', freq:'Cada 30 min', cat:'duitama' },
  { id:8,  origen:'Duitama',  destino:'Sogamoso Centro',      precio:5500,   dur:'25 min',   freq:'Cada 8 min',  cat:'duitama' },
  { id:9,  origen:'Duitama',  destino:'Sogamoso Terminal',    precio:5500,   dur:'25 min',   freq:'Cada 8 min',  cat:'duitama' },
  { id:10, origen:'Duitama',  destino:'Tibasosa',             precio:3500,   dur:'15 min',   freq:'Cada 12 min', cat:'duitama' },
  { id:11, origen:'Duitama',  destino:'Tunja',                precio:12000,  dur:'50 min',   freq:'Cada 12 min', cat:'duitama' },
  { id:12, origen:'Sogamoso', destino:'Belencito',            precio:3000,   dur:'20 min',   freq:'Cada 15 min', cat:'sogamoso' },
  { id:13, origen:'Sogamoso', destino:'Nobsa',                precio:3000,   dur:'25 min',   freq:'Cada 15 min', cat:'sogamoso' },
  { id:14, origen:'Tunja',    destino:'Ciénega',              precio:11000,  dur:'1h 45min', freq:'Cada 45 min', cat:'tunja' },
  { id:15, origen:'Tunja',    destino:'Cómbita',              precio:5500,   dur:'15 min',   freq:'Cada 20 min', cat:'tunja' },
  { id:16, origen:'Tunja',    destino:'Motavita',             precio:3000,   dur:'15 min',   freq:'Cada 10 min', cat:'tunja' },
  { id:17, origen:'Tunja',    destino:'Nuevo Colón',          precio:9000,   dur:'45 min',   freq:'Cada 30 min', cat:'tunja' },
  { id:18, origen:'Tunja',    destino:'Oicatá',               precio:5500,   dur:'30 min',   freq:'Cada 30 min', cat:'tunja' },
  { id:19, origen:'Tunja',    destino:'Ramiriquí',            precio:9000,   dur:'2h',       freq:'Cada 45 min', cat:'tunja' },
  { id:20, origen:'Tunja',    destino:'San Pedro de Iguaque', precio:8000,   dur:'1h',       freq:'Cada 45 min', cat:'tunja' },
  { id:21, origen:'Tunja',    destino:'Siachoque',            precio:9000,   dur:'40 min',   freq:'Cada 15 min', cat:'tunja' },
  { id:22, origen:'Tunja',    destino:'Sotaquirá',            precio:9000,   dur:'45 min',   freq:'Cada 20 min', cat:'tunja' },
  { id:23, origen:'Tunja',    destino:'Tuta',                 precio:9000,   dur:'30 min',   freq:'Cada 15 min', cat:'tunja' },
  { id:24, origen:'Tunja',    destino:'Viracachá',            precio:9500,   dur:'55 min',   freq:'Cada 30 min', cat:'tunja' },
];

const origenes = [
  { id:'todas', label:'Todas', count:rutas.length },
  { id:'duitama', label:'Duitama', count:rutas.filter(r=>r.cat==='duitama').length },
  { id:'sogamoso', label:'Sogamoso', count:rutas.filter(r=>r.cat==='sogamoso').length },
  { id:'tunja', label:'Tunja', count:rutas.filter(r=>r.cat==='tunja').length },
];
const populares = ['Tunja','Sogamoso','Paipa','Siachoque','Paz de Río'];
const todosDestinos = [...new Set(rutas.map(r=>r.destino))].sort();

function useInView(opts={}) {
  const ref=useRef(null); const [v,setV]=useState(false);
  const threshold = opts.threshold ?? 0.15;
  useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold});obs.observe(el);return()=>obs.disconnect();},[threshold]);
  return [ref,v];
}
function AnimNum({value}){const [n,setN]=useState(0);const [ref,inView]=useInView();useEffect(()=>{if(!inView)return;const t=parseInt(value);if(isNaN(t)){setN(value);return;}let t0=null;const tick=(ts)=>{if(!t0)t0=ts;const p=Math.min((ts-t0)/800,1);setN(Math.floor((1-Math.pow(1-p,4))*t));if(p<1)requestAnimationFrame(tick);else setN(t);};requestAnimationFrame(tick);},[inView,value]);return <span ref={ref}>{n}</span>;}

export default function RutasPage(){
  const [filtro,setFiltro]=useState('todas');
  const [q,setQ]=useState('');
  const [heroQ,setHeroQ]=useState('');
  const [sug,setSug]=useState([]);
  const tableRef=useRef(null);
  const visible=useMemo(()=>rutas.filter(r=>{if(filtro!=='todas'&&r.cat!==filtro)return false;if(q&&!r.destino.toLowerCase().includes(q.toLowerCase())&&!r.origen.toLowerCase().includes(q.toLowerCase()))return false;return true;}),[filtro,q]);
  const handleHeroQ=useCallback((v)=>{setHeroQ(v);setSug(v.length>1?todosDestinos.filter(d=>d.toLowerCase().includes(v.toLowerCase())).slice(0,5):[]);},[]);
  const goTo=useCallback((dest)=>{setHeroQ(dest);setQ(dest);setSug([]);setTimeout(()=>tableRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),100);},[]);

  return (
    <main className="relative overflow-hidden" style={{fontFamily:"var(--font-dm-sans-alias)",background:'#ffffff',color:'#0A1628'}}>
      {/* Fuentes cargadas globalmente desde layout.js via next/font */}

      <style dangerouslySetInnerHTML={{__html:`
/* Aliases para que los font-family del CSS sigan funcionando
   usando las fuentes ya cargadas por next/font en layout.js */
:root {
  --font-dm-sans-alias: var(--font-dm-sans, 'DM Sans', sans-serif);
  --font-cormorant-alias: var(--font-cormorant, 'Cormorant Garamond', serif);
  --font-jetbrains-alias: var(--font-jetbrains, 'JetBrains Mono', monospace);
  --font-instrument-alias: var(--font-instrument, 'Instrument Serif', serif);
  --font-anybody-alias: var(--font-anybody, 'Anybody', sans-serif);
}

:root{--blue:#1A7FE8;--blue-dim:#0057B8;--blue-glow:rgba(26,127,232,0.18);--sky:#5DB8FF;--g50:#F8FAFD;--g100:#F0F4FA;--g200:#E2E8F2;--g300:#CBD5E1;--g400:#94A3B8;--g500:#64748B;--g600:#475569;--g700:#334155;--g800:#1E293B;--g900:#0F172A;--green:#059669;--border:rgba(0,87,184,0.08);--border-h:rgba(26,127,232,0.18);--ease:cubic-bezier(0.16,1,0.3,1)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* HERO — compact, centered content, image bg */
.rt-hero{min-height:0;display:flex;flex-direction:column;position:relative;overflow:hidden;padding:clamp(140px,16vh,180px) 0 clamp(60px,8vh,90px);color:white}
.rt-hero-media{position:absolute;inset:0;z-index:0}
.rt-hero-media video,.rt-hero-media img{width:100%;height:100%;object-fit:cover;object-position:center 30%;display:block}
.rt-hero-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(2,10,20,0.85) 0%,rgba(10,22,40,0.72) 40%,rgba(10,22,40,0.90) 100%)}
.rt-hero-grain{position:absolute;inset:0;z-index:2;background-image:radial-gradient(circle,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
.rt-hero-vignette{position:absolute;inset:0;z-index:2;background:radial-gradient(ellipse 70% 60% at 50% 45%,transparent 40%,rgba(2,10,20,0.55) 100%);pointer-events:none}
.rt-hero-glow{position:absolute;inset:0;z-index:2;background:radial-gradient(ellipse 50% 40% at 30% 50%,rgba(26,127,232,0.07) 0%,transparent 70%);pointer-events:none}
.rt-wrap{max-width:1400px;margin:0 auto;padding:0 clamp(28px,6vw,72px);position:relative;z-index:2}
.rt-live-dot{width:6px;height:6px;border-radius:50%;background:#5DB8FF;box-shadow:0 0 8px rgba(93,184,255,0.5);animation:rtP 2.5s ease infinite;flex-shrink:0}
@keyframes rtP{0%,100%{opacity:1}50%{opacity:.35}}
.rt-h1{font-family:var(--font-cormorant-alias);font-size:clamp(2.8rem,7vw,5.2rem);font-weight:700;color:white;line-height:1.08;letter-spacing:-.025em;margin:0 0 20px;text-shadow:0 4px 30px rgba(0,0,0,0.6)}
.rt-h1 em{font-style:italic;color:var(--sky);-webkit-text-fill-color:var(--sky);text-shadow:0 2px 20px rgba(93,184,255,0.3)}
.rt-desc{font-size:clamp(14px,1.5vw,16px);color:rgba(255,255,255,0.5);line-height:1.85;max-width:500px;margin:0 0 36px}
.rt-search-wrap{position:relative;max-width:560px}
.rt-search{display:flex;align-items:center;background:rgba(14,28,50,0.55);border:1px solid rgba(26,127,232,0.08);border-radius:14px;padding:5px 5px 5px 20px;gap:12px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:all .25s var(--ease)}
.rt-search:focus-within{border-color:rgba(26,127,232,0.18);box-shadow:0 0 0 4px rgba(26,127,232,0.06),0 20px 50px rgba(0,0,0,0.3)}
.rt-search input{flex:1;background:none;border:none;outline:none;font-family:var(--font-dm-sans-alias);font-size:15px;color:white;padding:12px 0}
.rt-search input::placeholder{color:rgba(255,255,255,0.22)}
.rt-search-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:10px;background:var(--blue);color:white;font-weight:700;font-size:13px;border:none;cursor:pointer;transition:all .2s var(--ease);box-shadow:0 4px 16px var(--blue-glow)}
.rt-search-btn:hover{box-shadow:0 6px 24px rgba(26,127,232,0.35);transform:translateY(-1px)}
.rt-dropdown{position:absolute;top:calc(100% + 8px);left:0;right:0;background:#0E1C32;border:1px solid rgba(26,127,232,0.18);border-radius:12px;overflow:hidden;z-index:60;box-shadow:0 24px 60px rgba(0,0,0,0.5);animation:rtD .15s ease}
@keyframes rtD{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
.rt-drop-item{display:flex;align-items:center;gap:14px;padding:13px 20px;cursor:pointer;font-size:14px;color:rgba(255,255,255,0.5);border-bottom:1px solid rgba(255,255,255,0.03);transition:background .12s ease}
.rt-drop-item:last-child{border-bottom:none}
.rt-drop-item:hover{background:rgba(26,127,232,0.08)}
.rt-drop-item strong{color:var(--sky)}
.rt-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px;align-items:center}
.rt-tag-lbl{font-family:var(--font-jetbrains-alias);font-size:9px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.22);margin-right:4px}
.rt-tag{padding:6px 16px;border-radius:100px;background:rgba(26,127,232,0.06);border:1px solid rgba(26,127,232,0.08);color:rgba(255,255,255,0.5);font-size:12px;cursor:pointer;transition:all .2s var(--ease)}
.rt-tag:hover{background:rgba(26,127,232,0.12);border-color:rgba(26,127,232,0.18);color:var(--sky)}
.rt-stats{margin-top:auto;border-top:1px solid rgba(26,127,232,0.08);padding:0 clamp(28px,6vw,72px)}
.rt-stats-inner{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr)}
.rt-stat{padding:28px 0;text-align:center;border-right:1px solid rgba(26,127,232,0.08)}
.rt-stat:last-child{border-right:none}
.rt-stat-val{font-family:var(--font-cormorant-alias);font-size:clamp(1.6rem,3vw,2.4rem);font-weight:700;color:var(--blue);line-height:1;display:block}
.rt-stat-lbl{font-family:var(--font-jetbrains-alias);font-size:9px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,0.22);margin-top:8px;display:block}
@media(max-width:640px){.rt-stats-inner{grid-template-columns:repeat(2,1fr)}.rt-stat:nth-child(2){border-right:none}.rt-stat:nth-child(n+3){border-top:1px solid rgba(26,127,232,0.08)}}

/* LIGHT BODY */
.rt-notice{background:var(--g50);border-bottom:1px solid var(--border);padding:14px 28px;display:flex;align-items:center;justify-content:center;gap:10px}
.rt-notice p{font-size:13px;color:var(--g500);margin:0}
.rt-notice a{color:var(--blue);font-weight:700;text-decoration:none}
.rt-filters{background:rgba(255,255,255,0.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid var(--border);padding:12px 0;position:sticky;top:0;z-index:40}
.rt-filters-inner{max-width:1400px;margin:0 auto;padding:0 clamp(28px,6vw,72px);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.rt-tabs{display:flex;gap:4px}
.rt-tab{padding:9px 20px;border-radius:8px;border:1px solid transparent;background:transparent;color:var(--g400);font-size:13px;font-weight:600;cursor:pointer;transition:all .2s var(--ease);display:flex;align-items:center;gap:8px}
.rt-tab:hover{color:var(--g700);background:var(--g50)}
.rt-tab.active{background:var(--blue);border-color:var(--blue);color:white;box-shadow:0 2px 10px var(--blue-glow)}
.rt-tab-count{font-family:var(--font-jetbrains-alias);font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;background:rgba(26,127,232,0.08);color:var(--blue)}
.rt-tab.active .rt-tab-count{background:rgba(255,255,255,0.2);color:white}
.rt-filter-right{display:flex;align-items:center;gap:14px}
.rt-filter-search{display:flex;align-items:center;gap:10px;background:var(--g50);border:1.5px solid var(--g200);border-radius:8px;padding:0 14px;transition:all .2s var(--ease)}
.rt-filter-search:focus-within{border-color:var(--blue);box-shadow:0 0 0 3px rgba(26,127,232,0.06);background:white}
.rt-filter-search input{background:none;border:none;outline:none;font-size:13px;color:var(--g900);padding:9px 0;width:170px}
.rt-filter-search input::placeholder{color:var(--g400)}
.rt-x{background:none;border:none;cursor:pointer;color:var(--g400);padding:4px;border-radius:4px;display:flex;transition:all .15s}
.rt-x:hover{color:var(--g600);background:var(--g100)}
.rt-pill{padding:7px 16px;border-radius:6px;background:rgba(26,127,232,0.06);border:1px solid var(--border);font-family:var(--font-jetbrains-alias);font-size:10px;font-weight:600;letter-spacing:.06em;color:var(--blue)}

/* TABLE */
.rt-table{background:var(--g50);padding:clamp(40px,6vh,72px) 0 clamp(56px,8vh,96px)}

/* ═══ OPTION C — TICKET CARD ═══ */
.rt-card{
  display:grid;grid-template-columns:48px 1fr auto;align-items:stretch;
  background:white;border:1px solid var(--g200);border-radius:12px;
  overflow:hidden;transition:all .3s var(--ease);position:relative;
}
.rt-card:hover{border-color:var(--border-h);box-shadow:0 8px 32px rgba(26,127,232,0.06);transform:translateY(-2px)}
.rt-card-anim{animation:rtUp .3s var(--ease) both}
@keyframes rtUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* side bar */
.rt-sidebar{
  background:var(--blue-dim);display:flex;align-items:center;justify-content:center;
  writing-mode:vertical-rl;text-orientation:mixed;
}
.rt-sidebar span{
  font-family:var(--font-anybody-alias);font-size:9px;font-weight:700;
  color:rgba(181,212,244,0.7);letter-spacing:0.35em;text-transform:uppercase;
  transform:rotate(180deg);
}

/* content zone */
.rt-content{padding:20px 24px;display:flex;flex-direction:column;gap:12px}
.rt-route-row{display:flex;align-items:center;gap:0}
.rt-from-wrap{
  display:inline-flex;align-items:center;gap:8px;
  padding:5px 14px 5px 10px;background:rgba(26,127,232,0.05);
  border-radius:8px 0 0 8px;
}
.rt-from-dot{width:8px;height:8px;border-radius:50%;background:var(--blue-dim);box-shadow:0 0 0 3px rgba(26,127,232,0.12)}
.rt-from-name{
  font-family:var(--font-jetbrains-alias);font-size:11px;font-weight:600;
  color:#0C447C;letter-spacing:0.07em;text-transform:uppercase;
}
.rt-bridge{
  height:32px;width:40px;background:rgba(26,127,232,0.05);
  display:flex;align-items:center;justify-content:center;
}
.rt-to-wrap{padding:5px 16px 5px 12px;background:rgba(26,127,232,0.05);border-radius:0 8px 8px 0}
.rt-dest-name{
  font-family:var(--font-instrument-alias);font-size:1.45rem;
  font-style:italic;color:var(--g900);line-height:1;letter-spacing:-0.02em;
}
.rt-data-row{display:flex;gap:20px}
.rt-data-item{display:flex;flex-direction:column;gap:2px}
.rt-data-k{font-family:var(--font-jetbrains-alias);font-size:10px;color:var(--g400);letter-spacing:0.06em}
.rt-data-v{font-size:14px;font-weight:600;color:var(--g800)}

/* price end zone */
.rt-price-end{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:16px 26px;min-width:134px;
  border-left:1px solid var(--g200);
  position:relative;transition:all .3s var(--ease);
}
.rt-card:hover .rt-price-end{background:rgba(26,127,232,0.02)}
.rt-pe-line{width:28px;height:2px;background:rgba(26,127,232,0.15);border-radius:1px;margin-bottom:10px}
.rt-pe-amount{display:flex;align-items:baseline;gap:2px}
.rt-pe-sym{font-family:var(--font-anybody-alias);font-size:16px;font-weight:700;color:#378ADD}
.rt-pe-num{font-family:var(--font-anybody-alias);font-size:28px;font-weight:900;color:#185FA5;line-height:1;letter-spacing:-0.03em}
.rt-pe-lbl{font-family:var(--font-jetbrains-alias);font-size:8px;color:var(--g400);letter-spacing:0.16em;text-transform:uppercase;margin-top:6px}

/* responsive */
@media(max-width:900px){
  .rt-grid-2{grid-template-columns:1fr!important}
}
@media(max-width:768px){
  .rt-card{grid-template-columns:1fr}
  .rt-sidebar{display:none}
  .rt-price-end{border-left:none;border-top:1px solid var(--g200);flex-direction:row;gap:8px;padding:14px 24px;min-width:0}
  .rt-pe-line{display:none}
  .rt-pe-lbl{margin-top:0;margin-left:4px}
}

.rt-empty{text-align:center;padding:72px 24px;background:white;border-radius:12px;border:1px solid var(--g200)}
.rt-foot{text-align:center;margin-top:28px;font-family:var(--font-jetbrains-alias);font-size:10px;color:var(--g400);letter-spacing:.06em}

/* Touch devices: disable expensive hover effects */
@media(hover:none){
  .rt-card:hover{transform:none;box-shadow:none;border-color:var(--g200)}
  .rt-card:hover .rt-price-end{background:transparent}
  .rt-pv-card:hover{transform:none;box-shadow:none;border-color:var(--g200)}
  .rt-pv-card:hover::before{opacity:0}
  .rt-btn-solid:hover,.rt-btn-ghost:hover{transform:none;box-shadow:none}
  .rt-search-btn:hover{transform:none;box-shadow:0 4px 16px var(--blue-glow)}
  .rt-tag:hover{background:rgba(26,127,232,0.06);border-color:rgba(26,127,232,0.08);color:rgba(255,255,255,0.5)}
  /* Reduce card animation delay on mobile for faster perceived render */
  .rt-card-anim{animation-duration:.15s}
}

/* PUNTOS DE VENTA */
.rt-pv{padding:clamp(64px,9vh,110px) 0;background:white;border-top:1px solid var(--g200)}
.rt-stag{display:inline-flex;align-items:center;gap:10px;margin-bottom:20px}
.rt-stag-line{width:28px;height:1.5px;background:var(--blue)}
.rt-stag-text{font-family:var(--font-jetbrains-alias);font-size:9px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--blue)}
.rt-pv-title{font-family:var(--font-cormorant-alias);font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:700;color:var(--g900);margin-bottom:10px}
.rt-pv-desc{font-size:15px;color:var(--g500);margin-bottom:48px}
.rt-pv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px}
.rt-pv-card{background:var(--g50);border:1px solid var(--g200);border-radius:12px;padding:28px 24px;transition:all .25s var(--ease);position:relative;overflow:hidden}
.rt-pv-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--blue),var(--blue-dim));opacity:0;transition:opacity .25s ease}
.rt-pv-card:hover{border-color:var(--border-h);box-shadow:0 12px 40px rgba(26,127,232,0.06);transform:translateY(-2px)}
.rt-pv-card:hover::before{opacity:1}
.rt-pv-badge{display:inline-flex;padding:3px 12px;border-radius:4px;background:rgba(26,127,232,0.06);font-family:var(--font-jetbrains-alias);font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue);margin-bottom:12px}
.rt-pv-name{font-weight:700;font-size:15px;color:var(--g900);margin-bottom:6px;line-height:1.4}
.rt-pv-addr{font-size:13px;color:var(--g500);line-height:1.6;margin-bottom:12px}
.rt-pv-hours{display:flex;align-items:center;gap:7px;font-family:var(--font-jetbrains-alias);font-size:11px;font-weight:600;color:var(--blue)}

/* CTA (dark) */
.rt-cta{padding:clamp(72px,10vh,120px) 0;position:relative;overflow:hidden;background:linear-gradient(170deg,#020A14,#0A1628);color:white}
.rt-cta-glow{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(26,127,232,0.06) 0%,transparent 70%);pointer-events:none}
.rt-cta-title{font-family:var(--font-cormorant-alias);font-size:clamp(2rem,4vw,3.4rem);font-weight:700;color:white;margin-bottom:16px}
.rt-cta-desc{color:rgba(255,255,255,0.5);font-size:16px;max-width:520px;margin:0 auto 44px;line-height:1.8}
.rt-cta-btns{display:flex;flex-wrap:wrap;gap:14px;justify-content:center}
.rt-btn-solid{display:inline-flex;align-items:center;gap:9px;padding:15px 30px;border-radius:10px;background:var(--blue);color:white;font-weight:700;font-size:14px;text-decoration:none;transition:all .2s var(--ease);box-shadow:0 4px 16px var(--blue-glow)}
.rt-btn-solid:hover{box-shadow:0 6px 28px rgba(26,127,232,0.35);transform:translateY(-2px)}
.rt-btn-ghost{display:inline-flex;align-items:center;gap:9px;padding:15px 28px;border-radius:10px;border:1px solid rgba(255,255,255,0.10);color:white;font-weight:600;font-size:14px;text-decoration:none;transition:all .2s var(--ease)}
.rt-btn-ghost:hover{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.18)}
      `}}/>

      {/* HERO — image background */}
      <section className="rt-hero">
        {/* Background image — reemplaza la ruta con tu foto de Boyacá */}
        <div className="rt-hero-media">
          <Image src="/soata.webp" alt="Paisaje de Boyacá" fill priority quality={85} style={{ objectFit:'cover', objectPosition:'center 30%' }} />
        </div>
        <div className="rt-hero-overlay"/>
        <div className="rt-hero-grain"/>
        <div className="rt-hero-vignette"/>
        <div className="rt-hero-glow"/>

        <div className="rt-wrap" style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',zIndex:3}}>
          <div style={{maxWidth:640}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:10,marginBottom:28,padding:'6px 18px 6px 14px',borderRadius:100,background:'rgba(26,127,232,0.12)',border:'1px solid rgba(93,184,255,0.15)',backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)'}}>
              <span className="rt-live-dot"/>
              <span style={{fontFamily:"var(--font-jetbrains-alias)",fontSize:10,fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#5DB8FF'}}>Transporte intermunicipal · Boyacá</span>
            </div>
            <h1 className="rt-h1">Rutas a<br/><em>toda Boyacá</em></h1>
            <p className="rt-desc" style={{margin:'0 auto 36px',maxWidth:480}}>Desde Duitama, Sogamoso y Tunja hacia más de 20 destinos. Bus intermunicipal y taxi urbano con salidas cada pocos minutos.</p>
            <div className="rt-search-wrap" style={{margin:'0 auto'}}>
              <form className="rt-search" onSubmit={(e)=>{e.preventDefault();if(heroQ)goTo(heroQ);}}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="¿A dónde quieres viajar?" value={heroQ} onChange={(e)=>handleHeroQ(e.target.value)} autoComplete="off" aria-label="Buscar destino"/>
                <button type="submit" className="rt-search-btn">Buscar<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
              </form>
              {sug.length>0&&<div className="rt-dropdown" role="listbox">{sug.map(s=><div key={s} className="rt-drop-item" role="option" onClick={()=>goTo(s)}><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><strong>{s}</strong></div>)}</div>}
            </div>
            <div className="rt-tags" style={{justifyContent:'center'}}><span className="rt-tag-lbl">Popular</span>{populares.map(d=><button key={d} className="rt-tag" onClick={()=>goTo(d)}>{d}</button>)}</div>
          </div>
        </div>
      </section>

      {/* NOTICE */}
      <div className="rt-notice"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>Horarios y tarifas orientativos. Confirma al <a href="tel:+576087602888">(608) 760 2888</a> o en taquillas.</p></div>

      {/* FILTERS */}
      <nav className="rt-filters" ref={tableRef} aria-label="Filtros de rutas">
        <div className="rt-filters-inner">
          <div className="rt-tabs" role="tablist">{origenes.map(c=><button key={c.id} role="tab" aria-selected={filtro===c.id} className={`rt-tab${filtro===c.id?' active':''}`} onClick={()=>setFiltro(c.id)}>{c.label}<span className="rt-tab-count">{c.count}</span></button>)}</div>
          <div className="rt-filter-right">
            <div className="rt-filter-search"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--g400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="Filtrar destino…" value={q} onChange={e=>setQ(e.target.value)} aria-label="Filtrar"/>{q&&<button className="rt-x" onClick={()=>setQ('')} aria-label="Limpiar"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}</div>
            <span className="rt-pill">{visible.length} ruta{visible.length!==1?'s':''}</span>
          </div>
        </div>
      </nav>

      {/* ROUTES — ticket cards */}
      <section className="rt-table"><div className="rt-wrap">
        <div className="rt-grid-2" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
          {visible.length===0
            ? <div className="rt-empty" style={{gridColumn:'1/-1'}}><p style={{fontWeight:700,fontSize:16,color:'var(--g600)',marginBottom:6}}>Sin resultados para &ldquo;{q}&rdquo;</p><p style={{fontSize:13,color:'var(--g400)'}}>Intenta con otro destino.</p></div>
            : visible.map((r,i)=>(
              <div key={r.id} className="rt-card rt-card-anim" style={{animationDelay:`${i*25}ms`}}>
                <div className="rt-sidebar"><span>Cooflotax</span></div>
                <div className="rt-content">
                  <div className="rt-route-row">
                    <div className="rt-from-wrap">
                      <span className="rt-from-dot"/>
                      <span className="rt-from-name">{r.origen}</span>
                    </div>
                    <div className="rt-bridge">
                      <svg width="40" height="2" viewBox="0 0 40 2"><line x1="0" y1="1" x2="33" y2="1" stroke="#378ADD" strokeWidth="1.5" strokeDasharray="3 3"/><polygon points="33,0 40,1 33,2" fill="#378ADD"/></svg>
                    </div>
                    <div className="rt-to-wrap">
                      <span className="rt-dest-name">{r.destino}</span>
                    </div>
                  </div>
                  <div className="rt-data-row">
                    <div className="rt-data-item"><span className="rt-data-k">Duración</span><span className="rt-data-v">{r.dur}</span></div>
                    <div className="rt-data-item"><span className="rt-data-k">Frecuencia</span><span className="rt-data-v">{r.freq}</span></div>
                  </div>
                </div>
                <div className="rt-price-end">
                  <div className="rt-pe-line"/>
                  <div className="rt-pe-amount">
                    <span className="rt-pe-sym">$</span>
                    <span className="rt-pe-num">{r.precio.toLocaleString('es-CO')}</span>
                  </div>
                  <span className="rt-pe-lbl">pasaje</span>
                </div>
              </div>
            ))
          }
        </div>
        <p className="rt-foot">{visible.length} ruta{visible.length!==1?'s':''} · Cooflotax Duitama</p>
      </div></section>

      {/* PUNTOS DE VENTA */}
      <section className="rt-pv"><div className="rt-wrap">
        <div className="rt-stag"><div className="rt-stag-line"/><span className="rt-stag-text">Puntos de venta</span></div>
        <h2 className="rt-pv-title">Dónde comprar tus tiquetes</h2>
        <p className="rt-pv-desc">Adquiere tus pasajes en nuestras taquillas habilitadas.</p>
        <div className="rt-pv-grid">{[{nombre:'Terminal de Transportes Duitama',horario:'Lun–Dom: 5:00 AM – 9:00 PM',dir:' Cl. 5 #36b-140, Duitama',principal:true},{nombre:'Taquilla Terminal – Tunja',horario:'Lun–Sáb: 6:00 AM – 7:00 PM',dir:'Avenida Circunvalar # 18 – 221, Tunja',principal:false},{nombre:'Taquilla Sogamoso',horario:'Lun–Dom: 5:30 AM – 8:00 PM',dir:' Cra. 17 #11-123',principal:false}].map((p,i)=><div key={i} className="rt-pv-card">{p.principal&&<span className="rt-pv-badge">Sede principal</span>}<h4 className="rt-pv-name">{p.nombre}</h4><p className="rt-pv-addr">{p.dir}</p><div className="rt-pv-hours"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{p.horario}</div></div>)}</div>
      </div></section>

      {/* CTA */}
      <section className="rt-cta"><div className="rt-cta-glow"/><div className="rt-wrap" style={{textAlign:'center',position:'relative',zIndex:1}}>
        <div className="rt-stag" style={{justifyContent:'center',marginBottom:24}}><div className="rt-stag-line"/><span className="rt-stag-text" style={{color:'var(--sky)'}}>Cooflotax</span><div className="rt-stag-line"/></div>
        <h2 className="rt-cta-title">¿No encuentras tu destino?</h2>
        <p className="rt-cta-desc">Podemos cubrir rutas especiales o indicarte el mejor camino para llegar donde necesitas.</p>
        <div className="rt-cta-btns">
          <Link href="/contacto" className="rt-btn-solid"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Consultar ruta especial</Link>
          <a href="https://wa.me/573103332323" target="_blank" rel="noopener noreferrer" className="rt-btn-ghost"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>Escribenos por WhatsApp</a>
        </div>
      </div></section>
    </main>
  );
}