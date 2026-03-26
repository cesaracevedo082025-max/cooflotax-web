'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* ─── Hook: IntersectionObserver (once=true → desconecta tras primer disparo) ─── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // ✅ disconnecta después del primer trigger → sin overhead continuo
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, isInView];
}

/* ─── Contador animado ─── */
function AnimatedCounter({ end, suffix = '', duration = 2000, prefix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    let rafId;
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId); // ✅ limpia RAF al desmontar
  }, [inView, end, duration]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ─── Reveal con animación ─── */
function Reveal({ children, delay = 0, className = '', direction = 'up' }) {
  const [ref, inView] = useInView();
  const transforms = {
    up: 'translateY(50px)',
    down: 'translateY(-50px)',
    left: 'translateX(50px)',
    right: 'translateX(-50px)',
    scale: 'scale(0.94)',
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate(0) scale(1)' : transforms[direction],
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        // ✅ willChange eliminado de aquí; solo aplicar cuando la animación está activa
      }}
    >
      {children}
    </div>
  );
}

/* ─── Barra de progreso scroll (throttled con RAF) ─── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let rafScheduled = false;
    const handleScroll = () => {
      if (rafScheduled) return; // ✅ throttle via RAF, evita setState por cada pixel
      rafScheduled = true;
      requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
        rafScheduled = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#1A7FE8] via-[#2A8FF8] to-[#1A7FE8]"
        style={{
          width: `${progress}%`,
          transition: 'width 0.08s linear',
          boxShadow: '0 0 12px rgba(26,127,232,0.5)',
          willChange: 'width', // ✅ willChange solo donde aplica
        }}
      />
    </div>
  );
}

/* ─── CSS global ─── */
const GLOBAL_CSS = `
  /* Aliases de fuentes — cargadas en layout.js via next/font */
  :root {
    --font-dm-sans-alias: var(--font-dm-sans, 'DM Sans', sans-serif);
    --font-cormorant-alias: var(--font-cormorant, 'Cormorant Garamond', serif);
    --font-jetbrains-alias: var(--font-jetbrains, 'JetBrains Mono', monospace);
    --font-montserrat-alias: var(--font-montserrat, 'Montserrat', sans-serif);
  }

  html.intro-active,html.intro-active body{overflow:hidden!important;height:100dvh!important;position:fixed!important;width:100%!important;touch-action:none!important;overscroll-behavior:none!important}
  html.intro-active::-webkit-scrollbar,html.intro-active body::-webkit-scrollbar{display:none!important}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:#020A14}
  ::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#1A7FE8,#0057B8);border-radius:10px}

  @keyframes lightSweepHero{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(26,127,232,.6)}50%{box-shadow:0 0 0 6px rgba(26,127,232,0)}}
  @keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(26,127,232,.4)}50%{box-shadow:0 0 0 10px rgba(26,127,232,0)}}
  @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes activePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}

  /* ✅ Aurora animations eliminadas — blur+animation es muy costoso en GPU.
     Reemplazadas por gradientes estáticos que lucen igual pero sin costo */

  .marquee-track{animation:marquee 30s linear infinite}
  .marquee-track:hover{animation-play-state:paused}

  .corporate-shimmer-hero{
    background:linear-gradient(108deg,#0057B8 0%,#0057B8 34%,#52a9ff 40%,#daeeff 45%,#52a9ff 50%,#0057B8 56%,#0057B8 100%);
    background-size:280% auto;
    -webkit-background-clip:text;background-clip:text;
    -webkit-text-fill-color:transparent;color:transparent;
    filter:drop-shadow(0 2px 8px rgba(0,0,0,.95));
    animation:lightSweepHero 9s linear infinite
  }
  .corporate-shimmer-boyaca{
    background:linear-gradient(108deg,#0057B8 0%,#0057B8 36%,#4da3ff 41%,#d4eaff 46%,#4da3ff 51%,#0057B8 56%,#0057B8 100%);
    background-size:280% auto;
    -webkit-background-clip:text;background-clip:text;
    -webkit-text-fill-color:transparent;color:transparent;
    filter:drop-shadow(0 2px 6px rgba(0,0,0,.9));
    animation:lightSweepHero 9s linear infinite
  }
  .pulse-dot{animation:pulseDot 2s ease-in-out infinite}
  .btn-corporate-primary{
    background:linear-gradient(135deg,#0057B8 0%,#003E82 100%);
    box-shadow:0 0 30px rgba(0,87,184,.45),inset 0 1px 0 rgba(255,255,255,.12);
    transition:all .3s cubic-bezier(.4,0,.2,1)
  }
  .btn-corporate-primary:hover{background:linear-gradient(135deg,#1A7FE8 0%,#0057B8 100%);box-shadow:0 0 50px rgba(26,127,232,.6);transform:scale(1.03) translateY(-1px)}
  .btn-corporate-secondary{border:2px solid rgba(0,87,184,.45);backdrop-filter:blur(12px);transition:all .3s cubic-bezier(.4,0,.2,1)}
  .btn-corporate-secondary:hover{border-color:rgba(26,127,232,.75);background:rgba(0,87,184,.15)}
  .badge-corporate{border:1px solid rgba(0,87,184,.35);background:rgba(0,87,184,.08);backdrop-filter:blur(10px)}
  .hover-lift{transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s ease}
  .hover-lift:hover{transform:translateY(-6px);box-shadow:0 24px 50px -18px rgba(26,127,232,.18)}
  .nav-btn{
    display:inline-flex;align-items:center;gap:10px;
    padding:13px 26px;border-radius:50px;
    font-family:var(--font-dm-sans-alias);font-size:14px;font-weight:700;
    text-decoration:none;transition:all .3s cubic-bezier(.4,0,.2,1)
  }
  .nav-btn:hover{transform:translateY(-2px)}

  /* ✅ backgroundAttachment:fixed en móvil — manejado por useIsTouch() en JS */
  @media (max-width:768px){
    .parallax-section{background-attachment:scroll!important}
  }

  /* ✅ Mejoras responsive generales */
  @media (max-width:480px){
    .nav-btn{padding:12px 20px;font-size:13px}
  }

  /* Touch devices: disable expensive hover effects */
  @media (hover:none){
    .hover-lift:hover{transform:none!important;box-shadow:none!important}
    .btn-corporate-primary:hover{transform:none;box-shadow:0 0 30px rgba(0,87,184,.45),inset 0 1px 0 rgba(255,255,255,.12)}
    .btn-corporate-secondary:hover{border-color:rgba(0,87,184,.45);background:transparent}
    .nav-btn:hover{transform:none}
  }
`;

/* ─── Datos estáticos fuera del componente ─── */
const STATS = [
  { end: 60,  suffix: '+', label: 'Años',        desc: 'de trayectoria',           color: '#60B5FF' },
  { end: 380, suffix: '+', label: 'Conductores', desc: 'profesionales activos',     color: '#1A7FE8' },
  { end: 12,  suffix: '+', label: 'Municipios',  desc: 'conectados en Boyaca',      color: '#7EC8FF' },
  { end: 450, suffix: '+', label: 'Familias',    desc: 'cooperadas beneficiadas',   color: '#60B5FF' },
];

const FEATURES_BUS = [
  'Salidas desde Duitama, Sogamoso y Tunja',
  'Vehiculos con seguro de pasajeros',
  'Frecuencias desde cada 8 minutos',
  'Tarifas desde $3.000',
];

const FEATURES_TAXI = [
  'Disponibilidad 24 horas, 7 dias',
  'Conductores con identificacion visible',
  'Servicio a domicilio',
];

const STATS_BUS  = [{ val: '24+', lbl: 'Rutas' }, { val: '3', lbl: 'Ciudades' }, { val: '8 min', lbl: 'Frecuencia' }];
const STATS_TAXI = [{ val: '24/7', lbl: 'Disponible' }, { val: '100%', lbl: 'Duitama' }, { val: '310', lbl: 'Linea' }];

const RUTAS_POPULARES = [
  { origen: 'Duitama', destino: 'Tunja',      precio: 12000, dur: '50 min',   freq: 'Cada 12 min' },
  { origen: 'Duitama', destino: 'Sogamoso',   precio: 5500,  dur: '25 min',   freq: 'Cada 8 min'  },
  { origen: 'Duitama', destino: 'Paipa',      precio: 4000,  dur: '20 min',   freq: 'Cada 12 min' },
  { origen: 'Duitama', destino: 'Soata',      precio: 29000, dur: '2h 40min', freq: 'Cada 30 min' },
  { origen: 'Tunja',   destino: 'Siachoque',  precio: 9000,  dur: '40 min',   freq: 'Cada 15 min' },
  { origen: 'Duitama', destino: 'Paz de Rio', precio: 14000, dur: '75 min',   freq: 'Cada 45 min' },
];

const PASOS = [
  { n: '01', title: 'Elige tu servicio',   sub: 'Bus intermunicipal o taxi' },
  { n: '02', title: 'Consulta horarios',   sub: 'Disponibilidad y frecuencias' },
  { n: '03', title: 'Adquiere tu tiquete', sub: 'En taquillas o por telefono' },
  { n: '04', title: 'Viaja tranquilo',     sub: 'Seguridad y calidez' },
];

/* ─── Hook: detecta dispositivo táctil — Safari móvil ignora background-attachment:fixed ─── */
function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);
  return isTouch;
}

export default function Home() {
  const isTouch = useIsTouch();
  const [introComplete, setIntroComplete] = useState(false);
  const videoRef = useRef(null);

  // ✅ useCallback para evitar re-creación en cada render
  const introFiredRef = useRef(false);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || introFiredRef.current) return;
    const { currentTime, duration } = video;
    if (duration > 0 && currentTime >= duration * 0.5) {
      introFiredRef.current = true;
      setIntroComplete(true);
      window.dispatchEvent(new Event('introTerminada'));
    }
  }, []);

  const skipIntro = useCallback(() => {
    if (introFiredRef.current) return;
    introFiredRef.current = true;
    setIntroComplete(true);
    window.dispatchEvent(new Event('introTerminada'));
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    // ✅ preventScroll simple y sin dependencias extra
    const preventScroll = (e) => { e.preventDefault(); };
    const preventKeyScroll = (e) => {
      if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();
    };

    if (!introComplete) {
      html.classList.add('intro-active');
      window.scrollTo(0, 0);
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('keydown', preventKeyScroll);
    } else {
      html.classList.remove('intro-active');
      window.scrollTo(0, 0);
    }
    return () => {
      html.classList.remove('intro-active');
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeyScroll);
    };
  }, [introComplete]);

  return (
    <main className="relative bg-[#020A18] text-white" style={{ fontFamily: 'var(--font-dm-sans-alias)' }}>

      {/* dangerouslySetInnerHTML evita hydration mismatch en Next.js */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <ScrollProgress />

      {/* ═══════════════════════════════════════════════════════
          HERO + INTRO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Video background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onTimeUpdate={handleTimeUpdate}
            poster="/poster-bus.webp"
            preload="auto"
            x-webkit-airplay="allow"
            className="w-full h-full object-cover opacity-75"
          >
            {/* H.264 baseline — máxima compatibilidad iOS/Safari */}
            <source src="/bus.mp4" type="video/mp4" />
          </video>
          {/* Overlays */}
          <div className="absolute inset-0 bg-[#020A18]/30 z-10 pointer-events-none" />
          <div
            className="absolute inset-y-0 left-0 z-10 pointer-events-none"
            style={{ width: '65%', background: 'linear-gradient(to right, rgba(2,10,24,.96) 0%, rgba(2,10,24,.88) 40%, rgba(2,10,24,.55) 70%, transparent 100%)' }}
          />
          <div
            className="absolute bottom-0 inset-x-0 z-10 pointer-events-none"
            style={{ height: '45%', background: 'linear-gradient(to top, rgba(2,10,24,.90) 0%, rgba(2,10,24,.35) 50%, transparent 100%)' }}
          />
          <div
            className="absolute top-0 inset-x-0 h-28 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(2,10,24,.80) 0%, transparent 100%)' }}
          />
        </div>

        {/* ── Pantalla de intro ── */}
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${
            introComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="text-center w-full px-4 sm:px-8 flex flex-col items-center">
            <h1
              className="text-[2.8rem] xs:text-5xl sm:text-6xl md:text-[6rem] font-black tracking-tighter corporate-shimmer-hero break-words max-w-full"
              style={{ fontFamily: 'var(--font-montserrat-alias)' }}
            >
              COOFLOTAX
            </h1>
            <p
              className="text-white/90 text-[10px] sm:text-sm font-medium mt-3 tracking-[0.2em] sm:tracking-[0.4em] uppercase"
              style={{ textShadow: '0 4px 12px rgba(0,0,0,.85)' }}
            >
              Tradicion desde 1964
            </p>
          </div>
          <button
            onClick={skipIntro}
            className={`absolute bottom-10 right-5 sm:bottom-14 sm:right-10 group flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-[9px] sm:text-xs font-semibold uppercase tracking-widest transition-all duration-500 backdrop-blur-md pointer-events-auto btn-corporate-secondary ${
              introComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <span>Saltar Intro</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ── Contenido hero (post-intro) ── */}
        <div
          className={`relative z-20 w-full min-h-screen flex items-center transition-opacity duration-700 ease-out ${
            introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-28 sm:pt-36 md:pt-40 lg:pt-44 pb-14 sm:pb-20">
            <div
              className="w-full max-w-[95%] xs:max-w-[88%] sm:max-w-[78%] md:max-w-[60%] lg:max-w-[54%] xl:max-w-[48%] flex flex-col"
              style={{ fontFamily: 'var(--font-montserrat-alias)' }}
            >
              {/* Badge */}
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 sm:px-4 w-max mb-4 sm:mb-5 shadow-lg transition-all duration-700 ease-out badge-corporate ${
                  introComplete ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-6 opacity-0'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A7FE8] pulse-dot flex-shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-[#1A7FE8] uppercase">
                  Tradicion y Excelencia
                </span>
              </div>

              {/* Titulos */}
              <div
                className={`mb-4 sm:mb-5 transition-all duration-700 ease-out leading-none ${
                  introComplete ? 'translate-y-0 opacity-100 delay-[400ms]' : 'translate-y-6 opacity-0'
                }`}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-white drop-shadow-lg">
                  Descubre
                </h1>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-none text-white mb-3 drop-shadow-lg tracking-tight">
                  Boyaca
                </h2>
                <h3 className="text-[9px] sm:text-[10px] font-bold text-[#1A7FE8] tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-2">
                  El confort de viajar con los lideres
                </h3>
                <h4 className="text-4xl sm:text-5xl md:text-[4rem] lg:text-[4.8rem] font-black tracking-tighter leading-none corporate-shimmer-hero pb-1">
                  COOFLOTAX
                </h4>
              </div>

              {/* Descripción */}
              <p
                className={`text-white/75 text-xs sm:text-sm md:text-[14px] font-normal leading-6 sm:leading-7 max-w-full sm:max-w-[460px] mb-8 sm:mb-10 drop-shadow-md transition-all duration-700 ease-out ${
                  introComplete ? 'translate-y-0 opacity-100 delay-[600ms]' : 'translate-y-6 opacity-0'
                }`}
              >
                Llevamos la experiencia de viaje a otro nivel. Conectamos cada rincon del departamento con una flota
                vanguardista, garantizando no solo tu llegada a tiempo, sino un trayecto marcado por la maxima
                seguridad, confort absoluto y un servicio de clase mundial.
              </p>

              {/* CTAs */}
              <div
                className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 transition-all duration-700 ease-out w-full ${
                  introComplete ? 'translate-y-0 opacity-100 delay-[800ms]' : 'translate-y-6 opacity-0'
                }`}
              >
                <Link
                  href="/rutas"
                  className="btn-corporate-primary text-white justify-center px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 rounded-full text-sm sm:text-base font-bold flex items-center gap-2 sm:gap-3 text-center"
                >
                  Ver Rutas y Tarifas
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/contacto"
                  className="btn-corporate-secondary text-white text-center px-6 py-3 sm:px-8 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold"
                >
                  Contactanos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MARQUEE
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative py-[13px] overflow-hidden z-20"
        style={{ background: '#020D1F', borderTop: '1px solid rgba(26,127,232,.18)', borderBottom: '1px solid rgba(26,127,232,.18)' }}
        aria-hidden="true" /* decorativo */
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg,#020D1F 0%,transparent 8%,transparent 92%,#020D1F 100%)', zIndex: 2 }}
        />
        {/* ✅ Reducido de 8 repeticiones a 4 — suficiente para seamless loop, menos DOM */}
        <div className="flex whitespace-nowrap marquee-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 mx-8">
              {['Compromiso', 'Seguridad', 'Calidad', 'Tradicion', 'Innovacion', 'Cooperativismo', '60 Años'].map((word, j) => (
                <span key={j} className="flex items-center gap-8">
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains-alias)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.28em',
                      color: j % 2 === 1 ? '#1A7FE8' : 'rgba(255,255,255,.7)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {word}
                  </span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(26,127,232,.7)', display: 'inline-block' }} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          QUIÉNES SOMOS
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#020A18' }}>
        {/* ✅ Gradientes estáticos en lugar de blobs animados con blur — mismo look, 0 jank */}
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-15%', width: '60%', height: '65%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,87,184,.18) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '55%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,127,232,.13) 0%, transparent 70%)' }} />
        </div>
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(26,127,232,.30), transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(26,127,232,.18), transparent)' }} />

        <div
          className="relative z-10 max-w-[1340px] mx-auto px-5 sm:px-8"
          style={{ paddingTop: 'clamp(80px, 11vh, 130px)', paddingBottom: 'clamp(80px, 11vh, 130px)' }}
        >
          <div
            className="grid gap-[clamp(36px,5vw,72px)] lg:grid-cols-[1fr_1.15fr] items-center"
          >
            {/* Imagen */}
            <Reveal direction="right" delay={100}>
              <div className="relative">
                <div
                  style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '80%', height: '80%',
                    background: 'radial-gradient(circle, rgba(26,127,232,.12) 0%, transparent 60%)',
                    filter: 'blur(40px)',
                  }}
                />
                <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(26,127,232,.15)', boxShadow: '0 24px 70px rgba(0,0,0,.4)', aspectRatio: '4 / 5' }}>
                  <Image
                    src="/terminal.webp"
                    alt="Terminal Cooflotax Duitama"
                    fill
                    loading="lazy"
                    quality={85}
                    style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,10,24,.85) 0%, rgba(2,10,24,.12) 35%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2,10,24,.28) 0%, transparent 30%)' }} />
                  <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px', borderRadius: 40, background: 'rgba(2,10,24,.60)', backdropFilter: 'blur(10px)', border: '1px solid rgba(26,127,232,.25)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A7FE8', boxShadow: '0 0 10px rgba(26,127,232,.5)', animation: 'pulseGlow 2.5s ease-in-out infinite' }} />
                    <span style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,.85)' }}>Est. 1964</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
                    <p style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, margin: '0 0 6px', textShadow: '0 2px 20px rgba(0,0,0,.6)' }}>Duitama, Boyaca</p>
                    <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,.55)', margin: 0 }}>Sede principal - Terminal de transporte</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Texto */}
            <div>
              <Reveal>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                  <div style={{ width: 44, height: 1.5, background: 'linear-gradient(to right, #1A7FE8, transparent)', borderRadius: 1 }} />
                  <span style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(126,200,255,.75)' }}>Quienes Somos</span>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <h2 style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 'clamp(2.3rem, 4.5vw, 4rem)', fontWeight: 800, color: 'white', lineHeight: 1.05, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
                  Seis decadas{' '}<em style={{ color: '#1A7FE8', fontStyle: 'italic', textShadow: '0 0 40px rgba(26,127,232,.25)' }}>de compromiso</em>{' '}con Boyacá
                </h2>
              </Reveal>
              <Reveal delay={180}>
                <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 'clamp(14px, 1.5vw, 16px)', fontWeight: 400, color: 'rgba(255,255,255,.52)', lineHeight: 1.9, margin: '0 0 36px', maxWidth: 520 }}>
                  Desde 1964, Cooflotax conecta los municipios de Boyaca con un servicio que nacio del trabajo honesto y la vision cooperativa. Hoy operamos con certificaciones internacionales de calidad y seguridad, moviendo a miles de pasajeros cada dia.
                </p>
              </Reveal>

              {/* Contadores */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {STATS.map((s, i) => (
                  <Reveal key={i} direction="up" delay={250 + i * 80}>
                    <div style={{ padding: 'clamp(18px,2.5vw,24px) clamp(14px,2vw,22px)', borderRadius: 16, background: 'rgba(255,255,255,.025)', border: '1px solid rgba(26,127,232,.10)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1.5, background: `linear-gradient(to right, transparent, ${s.color}35, transparent)`, borderRadius: 1 }} />
                      <div style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 'clamp(2rem, 3.2vw, 2.8rem)', fontWeight: 900, color: s.color, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 4 }}>
                        <AnimatedCounter end={s.end} suffix={s.suffix} />
                      </div>
                      <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,.88)', margin: '0 0 2px' }}>{s.label}</p>
                      <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 12, color: 'rgba(255,255,255,.35)', margin: 0 }}>{s.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={500}>
                <Link href="/nosotros" className="nav-btn" style={{ background: 'linear-gradient(135deg, #1A7FE8, #0057B8)', color: 'white', boxShadow: '0 8px 28px rgba(26,127,232,.35)' }}>
                  Conoce nuestra historia
                  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          DIVISOR CINEMATOGRÁFICO
          ✅ En desktop: parallax fixed. En iOS/touch: img normal (Safari ignora fixed)
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden parallax-section"
        style={{ height: 'clamp(300px, 42vh, 500px)', background: '#000' }}
      >
        {isTouch ? (
          <img
            src="/duitama.webp"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 55%',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: "url('duitama.webp')",
              backgroundSize: 'cover',
              backgroundPosition: 'center 55%',
              backgroundAttachment: 'fixed',
            }}
          />
        )}
        <div className="absolute inset-0" style={{ background: 'rgba(2,8,20,.50)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #020A18 0%, transparent 14%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #FFFFFF 0%, transparent 14%)' }} />
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <Reveal>
            <div className="text-center px-5 sm:px-8">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 14 }}>
                <div style={{ width: 36, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,.5))' }} />
                <span style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 9, fontWeight: 700, letterSpacing: '0.55em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)', textShadow: '0 2px 12px rgba(0,0,0,.8)' }}>Nuestros Servicios</span>
                <div style={{ width: 36, height: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,.5))' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 'clamp(2.4rem, 6vw, 5rem)', fontWeight: 800, color: 'white', lineHeight: 1.0, margin: '0 0 10px', letterSpacing: '-0.02em', textShadow: '0 4px 40px rgba(0,0,0,.6)' }}>
                Moviendo a{' '}<em className="corporate-shimmer-boyaca" style={{ fontStyle: 'italic' }}>Boyacá</em>
              </h2>
              <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 'clamp(13px, 1.4vw, 16px)', color: 'rgba(255,255,255,.7)', margin: 0, textShadow: '0 2px 12px rgba(0,0,0,.7)' }}>
                Cada kilometro, un compromiso con nuestra comunidad
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SERVICIOS
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        {/* ✅ SVG dot-grid + shimmerLine animations eliminados — eran costosos y casi invisibles */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 92% -5%, rgba(26,127,232,.04) 0%, transparent 70%)',
          }}
        />
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent 5%, rgba(26,127,232,.12) 50%, transparent 95%)' }} />

        <div
          className="relative z-10 max-w-[1340px] mx-auto px-5 sm:px-8"
          style={{ paddingTop: 'clamp(80px, 11vh, 140px)', paddingBottom: 'clamp(80px, 11vh, 140px)' }}
        >
          {/* Header */}
          <Reveal>
            <div className="text-center" style={{ marginBottom: 'clamp(44px, 6vh, 68px)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', borderRadius: 40, background: 'rgba(26,127,232,.07)', border: '1px solid rgba(26,127,232,.18)', marginBottom: 18 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A7FE8', animation: 'pulseGlow 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 9, fontWeight: 700, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#0057B8' }}>Lo que ofrecemos</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontWeight: 800, color: '#0A1628', lineHeight: 1.05, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                Dos servicios, una misma{' '}<em style={{ color: '#1A7FE8', fontStyle: 'italic' }}>calidad</em>
              </h2>
              <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 'clamp(14px, 1.4vw, 16px)', color: '#64748B', maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
                Transporte intermunicipal en bus y servicio de taxi urbano en Duitama. Mas de seis decadas moviendo a Boyaca.
              </p>
            </div>
          </Reveal>

          {/* Tarjetas */}
          <div className="grid gap-5 lg:grid-cols-2">

            {/* INTERMUNICIPAL */}
            <Reveal direction="right" delay={100}>
              <div className="hover-lift" style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(26,127,232,.10)', boxShadow: '0 12px 48px rgba(10,22,40,.06)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', padding: '30px 26px 22px', overflow: 'hidden', minHeight: 180 }}>
                  <Image
                    src="/Flota.webp"
                    alt="Bus intermunicipal Cooflotax"
                    fill
                    loading="lazy"
                    quality={85}
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,22,40,.88) 0%, rgba(14,36,68,.80) 50%, rgba(20,51,102,.75) 100%)' }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(26,127,232,.15)', border: '1px solid rgba(93,184,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5DB8FF' }}>
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                        </svg>
                      </div>
                      <span style={{ padding: '5px 14px', borderRadius: 50, background: 'rgba(26,127,232,.15)', border: '1px solid rgba(93,184,255,.2)', fontFamily: 'var(--font-jetbrains-alias)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5DB8FF' }}>Mas solicitado</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', fontWeight: 700, fontStyle: 'italic', color: 'white', margin: '0 0 5px', lineHeight: 1.1 }}>Transporte Intermunicipal</h3>
                    <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 13, color: 'rgba(255,255,255,.45)', margin: 0 }}>Conectando los municipios de Boyaca</p>
                    <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,.08)', marginTop: 18 }}>
                      {STATS_BUS.map((st, si) => (
                        <div key={si} style={{ flex: 1, padding: '13px 0', textAlign: 'center', borderRight: si < 2 ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
                          <span style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 19, fontWeight: 900, color: 'white', display: 'block', lineHeight: 1 }}>{st.val}</span>
                          <span style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 8, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.30)', marginTop: 4, display: 'block' }}>{st.lbl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '22px 26px 26px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 14, lineHeight: 1.85, color: '#64748B', margin: '0 0 18px' }}>
                    Cubrimos las principales rutas entre los municipios con salidas frecuentes, vehiculos modernos y conductores certificados.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #E2E8F2', paddingTop: 14, marginBottom: 22, flex: 1 }}>
                    {FEATURES_BUS.map((f, fi) => (
                      <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F0F4FA', fontSize: 13, color: '#475569' }}>
                        <div style={{ width: 18, height: 18, borderRadius: 5, background: 'rgba(26,127,232,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#1A7FE8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link href="/rutas" className="nav-btn" style={{ background: 'linear-gradient(135deg, #1A7FE8, #0057B8)', color: 'white', boxShadow: '0 6px 20px rgba(26,127,232,.25)', justifyContent: 'center', width: '100%' }}>
                    Ver todas las rutas
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* TAXI */}
            <Reveal direction="left" delay={200}>
              <div className="hover-lift" style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(217,119,6,.12)', boxShadow: '0 12px 48px rgba(10,22,40,.06)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', padding: '30px 26px 22px', overflow: 'hidden', minHeight: 180 }}>
                  <Image
                    src="/Taxi.webp"
                    alt="Taxi Cooflotax Duitama"
                    fill
                    loading="lazy"
                    quality={85}
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(28,16,8,.88) 0%, rgba(61,38,16,.80) 50%, rgba(92,58,24,.75) 100%)' }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(217,119,6,.15)', border: '1px solid rgba(251,191,36,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24' }}>
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3" y="11" width="18" height="8" rx="2"/><path d="M6 11V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/><line x1="3" y1="15" x2="21" y2="15"/>
                        </svg>
                      </div>
                      <span style={{ padding: '5px 14px', borderRadius: 50, background: 'rgba(217,119,6,.15)', border: '1px solid rgba(251,191,36,.2)', fontFamily: 'var(--font-jetbrains-alias)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FBBF24' }}>24 horas</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', fontWeight: 700, fontStyle: 'italic', color: 'white', margin: '0 0 5px', lineHeight: 1.1 }}>Taxi Municipal</h3>
                    <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 13, color: 'rgba(255,255,255,.45)', margin: 0 }}>Servicio urbano en Duitama</p>
                    <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,.08)', marginTop: 18 }}>
                      {STATS_TAXI.map((st, si) => (
                        <div key={si} style={{ flex: 1, padding: '13px 0', textAlign: 'center', borderRight: si < 2 ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
                          <span style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 19, fontWeight: 900, color: 'white', display: 'block', lineHeight: 1 }}>{st.val}</span>
                          <span style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 8, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.30)', marginTop: 4, display: 'block' }}>{st.lbl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '22px 26px 26px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 14, lineHeight: 1.85, color: '#64748B', margin: '0 0 18px' }}>
                    Flota de taxis disponible las 24 horas en Duitama. Tarifas reguladas y conductores identificados.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #E2E8F2', paddingTop: 14, marginBottom: 22, flex: 1 }}>
                    {FEATURES_TAXI.map((f, fi) => (
                      <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F0F4FA', fontSize: 13, color: '#475569' }}>
                        <div style={{ width: 18, height: 18, borderRadius: 5, background: 'rgba(217,119,6,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                  <a
                    href="tel:+576087602888"
                    className="nav-btn"
                    style={{ background: 'rgba(217,119,6,.08)', color: '#D97706', border: '2px solid rgba(217,119,6,.18)', justifyContent: 'center', width: '100%' }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Solicitar taxi
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Como funciona */}
          <Reveal delay={300}>
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(26,127,232,.06)' }}>
              <div style={{ textAlign: 'center', marginBottom: 26 }}>
                <span style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 9, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#1A7FE8' }}>Como funciona?</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 max-w-[860px] mx-auto">
                {PASOS.map((p, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '14px 10px', position: 'relative' }}>
                    <div style={{ width: 46, height: 46, borderRadius: '50%', margin: '0 auto 10px', background: 'rgba(26,127,232,.06)', border: '1.5px solid rgba(26,127,232,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-dm-sans-alias)', fontSize: 15, fontWeight: 900, color: '#1A7FE8' }}>{p.n}</div>
                    <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontWeight: 700, color: '#0A1628', fontSize: 13, margin: '0 0 3px' }}>{p.title}</p>
                    <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 12, color: '#94A3B8', margin: 0 }}>{p.sub}</p>
                    {i < 3 && <span style={{ position: 'absolute', right: -8, top: 30, color: 'rgba(26,127,232,.2)', fontSize: 18 }} className="hidden sm:block" aria-hidden="true">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <Link href="/servicios" className="nav-btn" style={{ background: 'white', color: '#0057B8', border: '2px solid rgba(0,87,184,.18)', boxShadow: '0 4px 16px rgba(0,87,184,.06)' }}>
                Todos nuestros servicios
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent 5%, rgba(26,127,232,.12) 50%, transparent 95%)' }} />
      </section>

      {/* ═══════════════════════════════════════════════════════
          RUTAS POPULARES
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: '#020A18', paddingTop: 'clamp(70px, 10vh, 120px)', paddingBottom: 'clamp(70px, 10vh, 120px)' }}
      >
        {/* ✅ Blobs estáticos */}
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: '50%', height: '55%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,127,232,.10) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '40%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,87,184,.08) 0%, transparent 70%)' }} />
        </div>
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(26,127,232,.25), transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(26,127,232,.18), transparent)' }} />

        <div className="relative z-10 max-w-[1340px] mx-auto px-5 sm:px-8">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(44px, 6vh, 68px)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', borderRadius: 40, background: 'rgba(26,127,232,.10)', border: '1px solid rgba(26,127,232,.20)', marginBottom: 18 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5DB8FF', boxShadow: '0 0 8px rgba(93,184,255,.5)', animation: 'pulseGlow 2.5s ease-in-out infinite' }} />
                <span style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 9, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#5DB8FF' }}>Rutas mas populares</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontWeight: 800, color: 'white', lineHeight: 1.05, margin: '0 0 14px', letterSpacing: '-0.02em' }}>
                Viaja desde <em style={{ color: '#1A7FE8', fontStyle: 'italic' }}>$3.500</em>
              </h2>
              <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 'clamp(14px, 1.4vw, 16px)', color: 'rgba(255,255,255,.45)', maxWidth: 460, margin: '0 auto', lineHeight: 1.8 }}>
                Salidas cada pocos minutos desde Duitama, Sogamoso y Tunja hacia mas de 20 destinos en Boyaca.
              </p>
            </div>
          </Reveal>

          {/* ✅ Grilla responsive con Tailwind nativo, sin !important hacks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RUTAS_POPULARES.map((r, i) => (
              <Reveal key={i} direction="up" delay={i * 60}>
                <div
                  className="hover-lift"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(26,127,232,.12)', borderRadius: 16, overflow: 'hidden' }}
                >
                  <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(26,127,232,.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 11px 5px 7px', background: 'rgba(26,127,232,.08)', borderRadius: 8 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1A7FE8', boxShadow: '0 0 0 3px rgba(26,127,232,.15)', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5DB8FF' }}>{r.origen}</span>
                      </div>
                      <svg width="22" height="8" viewBox="0 0 24 8" fill="none" aria-hidden="true">
                        <line x1="0" y1="4" x2="18" y2="4" stroke="#1A7FE8" strokeWidth="1.5" strokeDasharray="3 3" />
                        <polygon points="18,1 24,4 18,7" fill="#1A7FE8" />
                      </svg>
                    </div>
                    <p style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 'clamp(1.4rem, 2.3vw, 1.75rem)', fontWeight: 700, fontStyle: 'italic', color: 'white', margin: 0, lineHeight: 1.2 }}>{r.destino}</p>
                  </div>
                  <div style={{ padding: '16px 20px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 14 }}>
                      <span style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 15, fontWeight: 800, color: '#5DB8FF' }}>$</span>
                      <span style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 30, fontWeight: 900, color: '#1A7FE8', lineHeight: 1, letterSpacing: '-0.02em' }}>{r.precio.toLocaleString('es-CO')}</span>
                      <span style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 9, color: 'rgba(255,255,255,.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: 6 }}>pasaje</span>
                    </div>
                    <div style={{ display: 'flex', gap: 22 }}>
                      <div>
                        <p style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 9, color: 'rgba(255,255,255,.28)', letterSpacing: '0.06em', margin: '0 0 2px' }}>Duracion</p>
                        <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.75)', margin: 0 }}>{r.dur}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 9, color: 'rgba(255,255,255,.28)', letterSpacing: '0.06em', margin: '0 0 2px' }}>Frecuencia</p>
                        <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.75)', margin: 0 }}>{r.freq}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link href="/rutas" className="nav-btn" style={{ background: 'linear-gradient(135deg, #1A7FE8, #0057B8)', color: 'white', boxShadow: '0 8px 28px rgba(26,127,232,.35)' }}>
                Ver todas las rutas y tarifas
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <p style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 10, color: 'rgba(255,255,255,.22)', marginTop: 12, letterSpacing: '0.06em' }}>24 rutas disponibles - Cooflotax Duitama</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA CONTACTO + MAPA
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F8FF 40%, #EEF4FF 100%)', paddingTop: 'clamp(70px, 10vh, 120px)', paddingBottom: 'clamp(70px, 10vh, 120px)' }}
      >
        {/* Decorativos estáticos */}
        <div style={{ position: 'absolute', top: '-10%', right: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,127,232,.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.018 }} aria-hidden="true">
          <defs>
            <pattern id="ctaDotGrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.2" fill="#0057B8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ctaDotGrid)" />
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(44px, 6vh, 68px)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', borderRadius: 40, background: 'rgba(26,127,232,.07)', border: '1px solid rgba(26,127,232,.18)', marginBottom: 18 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A7FE8', animation: 'pulseGlow 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 9, fontWeight: 700, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#0057B8' }}>Cooflotax - Duitama - Est. 1964</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 800, color: '#0A1628', lineHeight: 1.0, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                Listo para{' '}<em style={{ color: '#1A7FE8', fontStyle: 'italic' }}>viajar</em>?
              </h2>
              <div style={{ width: 52, height: 2.5, background: 'linear-gradient(to right, transparent, #1A7FE8, transparent)', margin: '0 auto 18px', borderRadius: 2 }} />
              <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 'clamp(14px, 1.5vw, 17px)', fontWeight: 400, lineHeight: 1.85, color: '#64748B', maxWidth: 530, margin: '0 auto' }}>
                Encuentranos en Duitama o comunicáte con nosotros. Estamos siempre listos para llevarte a tu destino.
              </p>
            </div>
          </Reveal>

          {/* ✅ Grid responsive con Tailwind nativo */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.45fr] gap-[clamp(26px,4vw,50px)] items-stretch">
            <Reveal direction="right">
              <div className="h-full flex flex-col gap-5">
                {/* Info card */}
                <div style={{ padding: 'clamp(24px,3vw,32px) clamp(20px,2.5vw,30px)', borderRadius: 22, background: 'white', border: '1px solid rgba(26,127,232,.10)', boxShadow: '0 8px 40px rgba(10,22,40,.07)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,.70)', display: 'inline-block', animation: 'activePulse 2s ease-in-out infinite', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 11.5, fontWeight: 600, color: '#22c55e' }}>Servicio activo - Duitama, Boyaca</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-cormorant-alias)', fontSize: 'clamp(1.6rem, 2.6vw, 2.3rem)', fontWeight: 800, color: '#0A1628', lineHeight: 1.1, margin: '0 0 8px' }}>Tu cooperativa de transporte en Boyaca</h3>
                  <div style={{ width: 34, height: 2.5, background: '#1A7FE8', borderRadius: 2, marginBottom: 12 }} />
                  <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 13.5, lineHeight: 1.85, color: '#64748B', margin: '0 0 24px' }}>Conectamos municipios boyacenses con puntualidad, seguridad y calidez humana desde 1964.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
                    <Link
                      href="/contacto"
                      className="nav-btn"
                      style={{ background: 'linear-gradient(135deg, #1A7FE8, #0057B8)', color: 'white', boxShadow: '0 8px 28px rgba(26,127,232,.30)', justifyContent: 'center' }}
                    >
                      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>
                      Contactanos
                    </Link>
                    <Link
                      href="/rutas"
                      className="nav-btn"
                      style={{ background: 'white', color: '#0057B8', border: '2px solid rgba(0,87,184,.18)', justifyContent: 'center' }}
                    >
                      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      Ver rutas disponibles
                    </Link>
                  </div>
                </div>

                {/* Certificaciones */}
                <div style={{ padding: '16px 20px', borderRadius: 16, background: 'linear-gradient(135deg, #0057B8 0%, #1A7FE8 100%)', boxShadow: '0 10px 30px rgba(26,127,232,.28)' }}>
                  <p style={{ fontFamily: 'var(--font-jetbrains-alias)', fontSize: 8, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', margin: '0 0 7px' }}>Certificaciones</p>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    {['ISO 9001:2015', 'OHSAS 18001:2007'].map((c) => (
                      <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.95)" strokeWidth={2.2} aria-hidden="true"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 13, fontWeight: 700, color: 'white' }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Mapa */}
            <Reveal direction="left" delay={150}>
              <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(26,127,232,.14)', background: 'white', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(10,22,40,.10)' }}>
                <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderBottom: '1px solid rgba(26,127,232,.08)', flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg, #1A7FE8, #0057B8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(26,127,232,.28)' }}>
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 13, fontWeight: 700, color: '#0A1628', margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Sede Central Cooflotax</p>
                    <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 11, color: '#94A3B8', margin: 0 }}>Terminal de Transportes - Duitama, Boyaca</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.22)', flexShrink: 0 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'activePulse 2s ease-in-out infinite' }} />
                    <span style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 11, fontWeight: 700, color: '#16a34a' }}>Activo</span>
                  </div>
                </div>
                <div style={{ position: 'relative', flex: 1, minHeight: 'clamp(260px, 40vw, 420px)' }}>
                  <iframe
                    title="Cooflotax Duitama"
                    src="https://maps.google.com/maps?q=Cooflotax+Duitama+Boyaca+Colombia&z=13&output=embed"
                    width="100%"
                    height="100%"
                    style={{ display: 'block', border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a
                    href="https://maps.google.com/?q=Cooflotax+Duitama+Boyaca+Colombia"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 20, background: 'white', border: '1px solid rgba(26,127,232,.20)', fontFamily: 'var(--font-dm-sans-alias)', fontSize: 12, fontWeight: 600, color: '#1A7FE8', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,.12)' }}
                  >
                    Abrir en Maps
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  </a>
                </div>
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: 'white', borderTop: '1px solid rgba(26,127,232,.08)', flexShrink: 0, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#1A7FE8" strokeWidth={2.2} aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      <span style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 11, fontWeight: 600, color: '#374151' }}>Cra. 18 N 23-30 - Cll 5 36B 140, Duitama</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingLeft: 16 }}>
                      <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2} aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      <span style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 11, color: '#94A3B8' }}>Lun - Dom &mdash; 5:00 AM - 10:00 PM</span>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Cooflotax+Duitama+Boyaca+Colombia"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 22, background: 'linear-gradient(135deg, #1A7FE8, #0057B8)', fontFamily: 'var(--font-dm-sans-alias)', fontSize: 12, fontWeight: 700, color: 'white', textDecoration: 'none', boxShadow: '0 6px 18px rgba(26,127,232,.30)', whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    Como llegar
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent 5%, rgba(26,127,232,.14) 50%, transparent 95%)' }} />
      </section>


    </main>
  );
}