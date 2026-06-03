'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ──────────────────────────────────────────────
   Hook: detecta dispositivo táctil (iOS/Android)
   Safari móvil ignora background-attachment:fixed.
   ────────────────────────────────────────────── */
function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);
  return isTouch;
}

/* ──────────────────────────────────────────────
Hook: IntersectionObserver — detect viewport entry
   ────────────────────────────────────────────── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const threshold = options.threshold ?? 0.15;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, isInView];
}

/* ──────────────────────────────────────────────
Componente: Contador animado con easing
   ────────────────────────────────────────────── */
function AnimatedCounter({ end, suffix = '', duration = 2000, prefix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ──────────────────────────────────────────────
   Componente: Reveal con animación de entrada
   ────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '', direction = 'up' }) {
  const [ref, inView] = useInView();
  const transforms = {
    up: 'translateY(80px)',
    down: 'translateY(-80px)',
    left: 'translateX(80px)',
    right: 'translateX(-80px)',
    scale: 'scale(0.92)',
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate(0) scale(1)' : transforms[direction],
        transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: inView ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Componente: Texto que se revela letra por letra
   Optimizado: usa CSS var --d para el delay en vez de style inline individual
   ────────────────────────────────────────────── */
function SplitText({ text, className = '', delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0) rotateX(0)' : 'translateY(100%) rotateX(-80deg)',
            transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay + i * 35}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay + i * 35}ms`,
            transformOrigin: 'bottom center',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

/* ──────────────────────────────────────────────
   Componente: Botón Magnético (sigue el cursor)
   Sin re-renders: manipula el DOM directamente vía ref
   ────────────────────────────────────────────── */
function MagneticButton({ children, className = '', href = '#', strength = 0.3, style: customStyle = {} }) {
  const btnRef = useRef(null);

  const handleMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    btn.style.transform = `translate(${x}px, ${y}px)`;
    btn.style.transition = 'transform 0.15s ease-out';
  };

  const handleLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.style.transform = 'translate(0px, 0px)';
    btn.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
  };

  return (
    <Link
      ref={btnRef}
      href={href}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ ...customStyle }}
    >
      {children}
    </Link>
  );
}

/* ──────────────────────────────────────────────
   Componente: Tarjeta con efecto 3D Tilt
   Sin re-renders: manipula el DOM directamente vía ref
   ────────────────────────────────────────────── */
function TiltCard({ children, className = '', intensity = 8, style: customStyle = {} }) {
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'transform 0.15s ease-out';
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ ...customStyle }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Componente: Parallax Scroll Section
   ────────────────────────────────────────────── */
function ParallaxLayer({ children, speed = 0.5, className = '' }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Skip parallax on touch devices — too expensive and Safari ignores fixed anyway
    if (window.matchMedia('(hover: none)').matches) return;
    let rafId = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        if (!ref.current) { rafId = null; return; }
        const rect = ref.current.getBoundingClientRect();
        const windowH = window.innerHeight;
        const progress = (windowH - rect.top) / (windowH + rect.height);
        setOffset((progress - 0.5) * 100 * speed);
        rafId = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ transform: `translateY(${offset}px)` }}>
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Componente: Barra de progreso de scroll
   ────────────────────────────────────────────── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let rafId = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
        rafId = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px]">
      <div
        className="h-full bg-gradient-to-r from-[#1A7FE8] via-[#2A8FF8] to-[#1A7FE8]"
        style={{ width: `${progress}%`, transition: 'width 0.1s linear', boxShadow: '0 0 20px rgba(26,127,232,0.5)' }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════
   HERO SEQUENCE (CON LOS TEXTOS Y SOMBRAS RESALTADOS)
   ══════════════════════════════════════════════ */

function HeroSequence() {
  const [phase, setPhase]                   = useState('text1');
  const [textIn, setTextIn]                 = useState(false);
  const [circleProgress, setCircleProgress] = useState(0);
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [tlReady, setTlReady]               = useState(false);
  const [activeDecade, setActiveDecade]     = useState(0);
  const [tlProgress, setTlProgress]         = useState(0);
  const rafRef   = useRef(null);
  const tlRafRef = useRef(null);

  const texts = [
    {
      eyebrow: 'Fundación · 1964',
      l1: 'Nació una idea',
      l2: 'nació COOFLOTAX',
      body: 'Un grupo de transportadores duitamenses unió fuerzas para crear algo más que una empresa: una familia cooperativa al servicio de Boyacá.',
    },
    {
      eyebrow: 'Seis décadas de historia',
      l1: 'Cada kilómetro',
      l2: 'es un compromiso',
      body: 'Desde los páramos hasta los valles, nuestros buses han sido testigos de bodas, reencuentros y primeros días de colegio.',
    },
    {
      eyebrow: 'Nuestra Historia',
      l1: 'Tradición que',
      l2: 'mueve a Boyacá',
      body: 'Hoy somos 380 conductores, 450 familias cooperadas y más de 60 años de trayectoria que siguen escribiéndose en cada ruta',
    },
  ];

  const milestones = [
    { year: '1964', a: 270, title: 'Fundación',            desc: 'Personería jurídica oficial de la cooperativa.',  prog: 0.000 },
    { year: '1970', a: 315, title: 'Primeras rutas',       desc: 'Sogamoso, Paipa y municipios vecinos.',           prog: 0.125 },
    { year: '1980', a: 0,   title: 'Crecimiento',          desc: 'Nuevas terminales en toda la región.',            prog: 0.250 },
    { year: '1990', a: 45,  title: 'Liderazgo regional',   desc: 'Referente departamental de transporte.',          prog: 0.375 },
    { year: '2000', a: 90,  title: 'Renovación',           desc: 'Modernización tecnológica de la flota.',          prog: 0.500 },
    { year: '2010', a: 135, title: 'Certificación ISO',    desc: 'Normas internacionales OHSAS 18001.',             prog: 0.625 },
    { year: '2015', a: 180, title: 'Calidad total',        desc: 'ISO 9001:2015 en todos los procesos.',            prog: 0.750 },
    { year: '2020', a: 225, title: 'Era digital',          desc: 'Nuevos servicios e innovación digital.',          prog: 0.875 },
    { year: '2026', a: 262, title: 'Futuro verde',         desc: 'Liderazgo cooperativo y flota sostenible.',       prog: 0.975 },
  ];

  const decades = [
    { year: '1964', label: '1964 – 1969', event: 'Fundación y personería jurídica de la Cooperativa de Transportadores Flotax Duitama.' },
    { year: '1970', label: '1970 – 1979', event: 'Expansión de rutas hacia Sogamoso, Paipa y municipios vecinos del altiplano boyacense.' },
    { year: '1980', label: '1980 – 1989', event: 'Modernización de la flota y apertura de nuevas terminales de operación en la región.' },
    { year: '1990', label: '1990 – 1999', event: 'Consolidación como líder regional del transporte terrestre intermunicipal en Boyacá.' },
    { year: '2000', label: '2000 – 2009', event: 'Renovación tecnológica y mejora de procesos internos para garantizar mayor seguridad.' },
    { year: '2010', label: '2010 – 2019', event: 'Certificación ISO 9001:2015 y OHSAS 18001. Estándares internacionales de calidad.' },
    { year: '2020', label: '2020 – 2025', event: 'Innovación digital, nuevos servicios y compromiso con la movilidad sostenible regional.' },
    { year: '2026', label: '2026',         event: 'Sesenta años conectando a Boyacá. Un legado que sigue creciendo con cada ruta, cada conductor y cada familia cooperada.' },
  ];

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  function animateCircle() {
    const TOTAL    = 13000;
    const N        = milestones.length - 1;
    const MOVE     = 0.62; 
    let   start    = null;
    let   lastMile = -1;

    const step = (ts) => {
      if (!start) start = ts;
      const t    = Math.min((ts - start) / TOTAL, 1);
      const segT = t * N;
      const seg  = Math.min(Math.floor(segT), N - 1);
      const frac = segT - seg;

      let prog;
      if (t >= 1) {
        prog = 1;
        setActiveMilestone(N);
      } else if (frac < MOVE) {
        const mt     = frac / MOVE;
        const eased  = mt < 0.5 ? 2*mt*mt : 1 - Math.pow(-2*mt+2,2)/2;
        prog = milestones[seg].prog + (milestones[seg+1].prog - milestones[seg].prog) * eased;
        if (lastMile !== seg) { lastMile = seg; setActiveMilestone(seg); }
      } else {
        prog = milestones[seg + 1].prog;
        const arrived = seg + 1;
        if (lastMile !== arrived) { lastMile = arrived; setActiveMilestone(arrived); }
      }

      setCircleProgress(Math.min(prog, 1));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }

  function startTimelineAuto(startIdx = 0) {
    let idx    = startIdx;
    const PER  = 3400;
    let startT = null;
    const tick = (ts) => {
      if (!startT) startT = ts;
      const p = Math.min((ts - startT) / PER, 1);
      setTlProgress(p);
      if (p >= 1) {
        idx = (idx + 1) % decades.length;
        setActiveDecade(idx);
        startT = null;
        setTlProgress(0);
      }
      tlRafRef.current = requestAnimationFrame(tick);
    };
    setActiveDecade(idx);
    tlRafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    let alive = true;
    const run = async () => {
      await wait(350);
      if (!alive) return;
      setPhase('text1'); setTextIn(true);
      await wait(4000); setTextIn(false); await wait(650);
      if (!alive) return;
      setPhase('text2'); setTextIn(true);
      await wait(4000); setTextIn(false); await wait(650);
      if (!alive) return;
      setPhase('text3'); setTextIn(true);
      await wait(4000); setTextIn(false); await wait(700);
      if (!alive) return;
      setPhase('circle');
      animateCircle();
      await wait(14500);
      if (!alive) return;
      setPhase('timeline');
      await wait(400);
      setTlReady(true);
      startTimelineAuto(0);
    };
    run();
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(tlRafRef.current);
    };
  }, []);

  const handleDecadeClick = (i) => {
    cancelAnimationFrame(tlRafRef.current);
    setActiveDecade(i);
    setTlProgress(0);
    startTimelineAuto(i);
  };

  const tIdx       = phase === 'text1' ? 0 : phase === 'text2' ? 1 : 2;
  const cur        = texts[tIdx];
  const showTexts  = ['text1','text2','text3'].includes(phase);
  const showCircle = phase === 'circle';
  const showTL     = phase === 'timeline';

  const R  = 200, CX = 400, CY = 400;
  const C  = 2 * Math.PI * R;
  const AL = C * circleProgress;
  const xy = (a, r = R) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  };
  const ha  = 360 * circleProgress - 90;
  const hp  = xy(ha + 90, R);

  return (
    <>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.55s ease',
        opacity: showTexts ? 1 : 0,
        pointerEvents: showTexts ? 'auto' : 'none',
        userSelect: 'none',
      }}>
        <div style={{ textAlign: 'center', padding: '0 clamp(20px, 6vw, 48px)', maxWidth: 860, width: '100%' }}>
          {/* Eyebrow */}
          <div style={{ overflow: 'hidden', marginBottom: '1.6rem' }}>
            <p style={{
              margin: 0, fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(7px, 1.8vw, 9px)', fontWeight: 700, letterSpacing: '0.48em', textTransform: 'uppercase',
              color: '#1A7FE8',
              transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease',
              transform: textIn ? 'translateY(0)' : 'translateY(110%)', opacity: textIn ? 1 : 0,
            }}>— {cur?.eyebrow} —</p>
          </div>
          {/* Línea 1 */}
          <div style={{ overflow: 'hidden' }}>
            <p style={{
              margin: '0 0 0.04em',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.6rem, 7.5vw, 7.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 0.92,
              color: '#ffffff',
              textShadow: '0 6px 40px rgba(0,0,0,0.9)',
              transition: 'transform 0.85s cubic-bezier(0.22,1,0.36,1), opacity 0.85s ease', transitionDelay: '60ms',
              transform: textIn ? 'translateY(0)' : 'translateY(100%)', opacity: textIn ? 1 : 0,
            }}>{cur?.l1}</p>
          </div>
          {/* Línea 2 */}
          <div style={{ overflow: 'hidden', marginBottom: '2.2rem' }}>
            <p style={{
              margin: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.6rem, 7.5vw, 7.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 0.92,
              color: 'rgba(255,255,255,0.80)',
              textShadow: '0 4px 24px rgba(0,0,0,0.75)',
              transition: 'transform 0.85s cubic-bezier(0.22,1,0.36,1), opacity 0.85s ease', transitionDelay: '130ms',
              transform: textIn ? 'translateY(0)' : 'translateY(100%)', opacity: textIn ? 1 : 0,
            }}>{cur?.l2}</p>
          </div>
          {/* Separador decorativo */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: '1.6rem',
            transition: 'opacity 0.6s ease, transform 0.6s ease', transitionDelay: '280ms',
            opacity: textIn ? 1 : 0, transform: textIn ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'center',
          }}>
            <span style={{ flex: '0 0 32px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(26,127,232,0.6))' }} />
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#1A7FE8', boxShadow: '0 0 8px rgba(26,127,232,0.6)' }} />
            <span style={{ flex: '0 0 32px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(26,127,232,0.6))' }} />
          </div>
          {/* Body text */}
          <div style={{ overflow: 'hidden', maxWidth: 460, margin: '0 auto' }}>
            <p style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(13px, 1.6vw, 15px)',
              fontWeight: 400,
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.72)',
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
              letterSpacing: '0.01em',
              transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease', transitionDelay: '350ms',
              transform: textIn ? 'translateY(0)' : 'translateY(90%)', opacity: textIn ? 1 : 0,
            }}>{cur?.body}</p>
          </div>
          {/* Dots indicador */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 6, marginTop: '2rem',
            transition: 'opacity 0.5s ease', transitionDelay: '460ms', opacity: textIn ? 1 : 0,
          }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                height: 2, borderRadius: 4,
                width: tIdx === i ? 28 : 8,
                background: tIdx === i ? '#1A7FE8' : 'rgba(255,255,255,0.15)',
                transition: 'width 0.4s ease, background 0.4s ease',
              }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
        opacity: showCircle ? 1 : 0, transform: showCircle ? 'scale(1)' : 'scale(0.94)',
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'relative', flexShrink: 0,
          width: 'min(88vw, 78vh)', height: 'min(88vw, 78vh)',
          maxWidth: 640, maxHeight: 640,
        }}>
          <svg viewBox="0 0 800 800" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="2 14" />
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(0,87,184,0.12)" strokeWidth="10" strokeDasharray={`${AL} ${C}`} transform={`rotate(-90 ${CX} ${CY})`} />
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#0057B8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${AL} ${C}`} transform={`rotate(-90 ${CX} ${CY})`} style={{ filter: 'drop-shadow(0 0 8px rgba(0,87,184,0.9))' }} />
            <circle cx={CX} cy={CY - R} r="5" fill="#1A7FE8" style={{ filter: 'drop-shadow(0 0 10px rgba(26,127,232,1))' }} />
            {circleProgress > 0.01 && circleProgress < 0.99 && (<>
              <circle cx={hp.x} cy={hp.y} r="9" fill="rgba(26,127,232,0.15)" />
              <circle cx={hp.x} cy={hp.y} r="5" fill="#1A7FE8" style={{ filter: 'drop-shadow(0 0 12px rgba(26,127,232,1))' }} />
            </>)}
            {milestones.map((m, i) => {
              const dot  = xy(m.a, R);
              const lbl  = xy(m.a, R + 44);
              const isA  = activeMilestone === i;
              const past = circleProgress >= m.prog - 0.01;
              const hide = circleProgress >= 0.99;
              return (
                <g key={m.year} style={{ opacity: past && !hide ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                  {isA && <circle cx={dot.x} cy={dot.y} r="16" fill="rgba(26,127,232,0.10)" />}
                  <circle cx={dot.x} cy={dot.y} r={isA ? 5.5 : 3} fill={isA ? '#1A7FE8' : 'rgba(255,255,255,0.4)'} style={{ transition: 'all 0.35s ease', filter: isA ? 'drop-shadow(0 0 10px rgba(26,127,232,0.9))' : 'none' }} />
                  <text x={lbl.x} y={lbl.y} textAnchor="middle" dominantBaseline="middle" fill={isA ? '#5db8ff' : 'rgba(255,255,255,0.28)'} fontSize="11" fontWeight="700" fontFamily="'JetBrains Mono', monospace" style={{ transition: 'fill 0.35s ease' }}>
                    {m.year}
                  </text>
                </g>
              );
            })}
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          }}>
            <div style={{
              position: 'absolute', textAlign: 'center',
              opacity: circleProgress >= 0.99 ? 1 : 0,
              transform: circleProgress >= 0.99 ? 'scale(1)' : 'scale(0.88)',
              transition: 'opacity 0.9s ease 0.3s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s',
            }}>
              <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.02em', color: 'white', textShadow: '0 4px 30px rgba(0,0,0,0.95)', lineHeight: 1 }}>COOFLOTAX</p>
              <p style={{ margin: '10px 0 0', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.5em', color: '#1A7FE8', textTransform: 'uppercase' }}>Desde 1964</p>
            </div>
            {circleProgress < 0.99 && milestones.map((m, i) => (
              <div key={i} style={{
                position: 'absolute', textAlign: 'center', maxWidth: 'min(44%, 200px)',
                opacity: activeMilestone === i ? 1 : 0,
                transform: activeMilestone === i ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.97)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}>
                <p style={{ margin: '0 0 8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#1A7FE8' }}>{m.year}</p>
                <p style={{ margin: '0 0 8px', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', fontWeight: 700, color: 'white', lineHeight: 1.15, textShadow: '0 2px 24px rgba(0,0,0,0.95)' }}>{m.title}</p>
                <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(10px, 1.1vw, 12px)', fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column',
        transition: 'opacity 0.7s ease', opacity: showTL && tlReady ? 1 : 0, pointerEvents: showTL && tlReady ? 'auto' : 'none',
      }}>
        <div style={{
          paddingTop: 'clamp(112px, 16vh, 148px)', textAlign: 'center', paddingLeft: 24, paddingRight: 24, paddingBottom: 0,
          transition: 'opacity 0.7s ease, transform 0.7s ease', transitionDelay: '100ms',
          opacity: tlReady ? 1 : 0, transform: tlReady ? 'translateY(0)' : 'translateY(-14px)',
        }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.6em', textTransform: 'uppercase', color: '#1A7FE8', margin: '0 0 10px' }}>— 60 años de historia —</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 800, lineHeight: 1.05, color: 'white', margin: 0, textShadow: '0 4px 30px rgba(0,0,0,0.9)' }}>
            Nuestra <span className="italic gold-shimmer">Historia</span>
          </h2>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', position: 'relative' }}>
          {decades.map((d, i) => (
            <div key={i} style={{
              position: 'absolute', width: '100%', maxWidth: 540, textAlign: 'center',
              opacity: activeDecade === i ? 1 : 0,
              transform: activeDecade === i ? 'translateY(0)' : `translateY(${activeDecade > i ? -16 : 16}px)`,
              transition: 'opacity 0.55s ease, transform 0.55s ease', pointerEvents: 'none',
            }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(5rem, 14vw, 9rem)', fontWeight: 900, lineHeight: 0.8, color: 'rgba(26,127,232,0.18)', textShadow: '0 4px 20px rgba(0,0,0,0.5)', margin: '0 0 6px', letterSpacing: '-0.05em', userSelect: 'none' }}>{d.year}</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#1A7FE8', margin: '0 0 18px' }}>{d.label}</p>
              <div style={{ width: 40, height: 1, background: 'rgba(26,127,232,0.4)', margin: '0 auto 18px' }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(13px, 1.7vw, 15.5px)', fontWeight: 400, lineHeight: 1.85, color: 'rgba(255,255,255,0.95)', textShadow: '0 2px 10px rgba(0,0,0,0.8)', margin: 0, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>{d.event}</p>
            </div>
          ))}
        </div>
        <div style={{
          paddingBottom: 'clamp(24px, 4.5vh, 44px)', paddingLeft: '5%', paddingRight: '5%',
          transition: 'opacity 0.8s ease, transform 0.8s ease', transitionDelay: '260ms',
          opacity: tlReady ? 1 : 0, transform: tlReady ? 'translateY(0)' : 'translateY(22px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
            {decades.map((d, i) => (
              <button key={d.year} onClick={() => handleDecadeClick(i)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, opacity: tlReady ? 1 : 0, transform: tlReady ? 'translateY(0)' : 'translateY(-8px)', transition: `opacity 0.5s ease ${110 + i*40}ms, transform 0.5s ease ${110 + i*40}ms` }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: activeDecade === i ? '#1A7FE8' : 'rgba(255,255,255,0.2)', transition: 'color 0.35s ease', whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>{d.year}</span>
                <div style={{ width: 1, height: activeDecade === i ? 16 : 6, background: activeDecade === i ? '#1A7FE8' : 'rgba(255,255,255,0.1)', transition: 'all 0.35s ease' }} />
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', height: 2, marginBottom: 8 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.07) 4%, rgba(255,255,255,0.07) 96%, transparent)' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${(activeDecade / (decades.length - 1)) * 100}%`, background: 'linear-gradient(to right, rgba(0,87,184,0.4), #1A7FE8)', boxShadow: '0 0 10px rgba(26,127,232,0.35)', transition: 'width 0.75s cubic-bezier(0.22,1,0.36,1)' }} />
            {decades.map((d, i) => {
              const pct = (i / (decades.length - 1)) * 100;
              const active = activeDecade === i;
              const past   = i < activeDecade;
              return (
                <button key={d.year} onClick={() => handleDecadeClick(i)} style={{ position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%, -50%)', width: active ? 18 : 10, height: active ? 18 : 10, borderRadius: '50%', background: active ? '#1A7FE8' : past ? 'rgba(0,87,184,0.65)' : 'rgba(255,255,255,0.12)', border: active ? '2px solid rgba(255,255,255,0.2)' : 'none', boxShadow: active ? '0 0 0 5px rgba(26,127,232,0.15), 0 0 18px rgba(26,127,232,0.55)' : 'none', cursor: 'pointer', transition: 'all 0.4s ease', zIndex: 5 }} />
              );
            })}
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${tlProgress * 100}%`, background: 'linear-gradient(to right, #0057B8, #1A7FE8)', transition: 'width 0.1s linear' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, paddingBottom: 10, transition: 'opacity 0.7s ease 900ms', opacity: tlReady ? 0.25 : 0 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'white' }}>Scroll</span>
          <div style={{ width: 14, height: 25, border: '1px solid rgba(255,255,255,0.16)', borderRadius: 7, display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
            <div style={{ width: 2, height: 5, background: '#1A7FE8', borderRadius: 2, animation: 'float 2s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────
   Componente: Mapa animado de rutas Cooflotax
   ────────────────────────────────────────────── */
function RoutesWidget() {
  const [ref, inView] = useInView();
  const [revealed, setRevealed] = useState(false);

  const nodes = {
    duitama:   { x: 270, y: 240, name: 'Duitama',       type: 'origen' },
    paipa:     { x: 222, y: 268, name: 'Paipa',          type: 'ruta' },
    sogamoso:  { x: 332, y: 300, name: 'Sogamoso',       type: 'hub' },
    tibasosa:  { x: 302, y: 280, name: 'Tibasosa',       type: 'ruta' },
    staRosa:   { x: 296, y: 218, name: 'Sta. Rosa',      type: 'ruta' },
    belen:     { x: 335, y: 165, name: 'Belén',          type: 'ruta' },
    pazDeRio:  { x: 352, y: 138, name: 'Paz de Río',     type: 'ruta' },
    socha:     { x: 408, y: 155, name: 'Socha',          type: 'ruta' },
    soata:     { x: 440, y: 15,  name: 'Soatá',          type: 'ruta' },
    tunja:     { x: 105, y: 395, name: 'Tunja',          type: 'capital' },
    sotaquira: { x: 158, y: 278, name: 'Sotaquirá',      type: 'ruta' },
    tuta:      { x: 175, y: 320, name: 'Tuta',           type: 'ruta' },
    siachoque: { x: 162, y: 400, name: 'Siachoque',      type: 'ruta' },
    motavita:  { x: 92,  y: 365, name: 'Motavita',       type: 'ruta' },
  };

  const routes = [
    ['duitama','paipa','8s','0s'],      ['duitama','sogamoso','9s','1.5s'],
    ['duitama','tibasosa','7s','3s'],   ['duitama','staRosa','8s','4.5s'],
    ['duitama','belen','11s','0.5s'],   ['duitama','pazDeRio','14s','2.5s'],
    ['duitama','socha','15s','5s'],     ['duitama','soata','18s','1s'],
    ['duitama','tunja','12s','2s'],     ['duitama','sotaquira','9s','6s'],
    ['duitama','tuta','8s','4s'],       ['tunja','siachoque','9s','3s'],
    ['tunja','motavita','6s','5s'],
  ];

  useEffect(() => {
    if (inView) { const t = setTimeout(() => setRevealed(true), 400); return () => clearTimeout(t); }
  }, [inView]);

  const makePath = (o,d) => {
    const ox=o.x,oy=o.y,dx=d.x,dy=d.y;
    return `M${ox},${oy} Q${ox+(dx-ox)*0.5+(dy-oy)*0.12},${oy+(dy-oy)*0.5-Math.abs(dx-ox)*0.10} ${dx},${dy}`;
  };

  return (
    <div ref={ref} style={{ marginBottom: 16 }}>
      <Reveal direction="up" delay={200}>
        <div style={{
          borderRadius: 20, overflow: 'hidden', position: 'relative',
          background: '#0A1628',
          border: '1px solid rgba(26,127,232,0.10)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(26,127,232,0.05)',
        }}>

          {/* Fondo matching footer — navy blue oscuro */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0E1C32 0%, #0A1628 50%, #081220 100%)' }} />
          {/* Zona ligeramente más clara en centro del mapa */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 55% at 55% 50%, rgba(14,28,50,0.50) 0%, transparent 70%)' }} />
          {/* Vignette */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 75% at 50% 48%, transparent 45%, rgba(6,12,24,0.50) 100%)' }} />

          {/* Contenido */}
          <div style={{ position: 'relative', zIndex: 2, padding: '14px 14px 10px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(26,127,232,0.12)', border: '1px solid rgba(26,127,232,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#1A7FE8" strokeWidth={2.2}><path d="M3 6l6-3 6 3 6-3v12l-6 3-6-3-6 3V6z"/></svg>
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.1 }}>Mapa de Rutas</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7, fontWeight: 500, color: 'rgba(26,127,232,0.50)', margin: 0 }}>Boyacá, Colombia</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 10, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.12)' }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ebf1f7', animation: 'pulseGlow 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7.5, fontWeight: 600, color: '#1a39e8' }}>En vivo</span>
              </div>
            </div>

            <svg viewBox="0 0 490 450" style={{ width: '100%', height: 'auto', display: 'block' }}>
              <defs>
                <filter id="cg"><feGaussianBlur stdDeviation="2.5" result="b1"/><feGaussianBlur stdDeviation="5" result="b2"/><feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="tg"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="hg"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <radialGradient id="hr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1A7FE8" stopOpacity="0.10"/><stop offset="100%" stopColor="#1A7FE8" stopOpacity="0"/></radialGradient>
                <radialGradient id="ht" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1A7FE8" stopOpacity="0.07"/><stop offset="100%" stopColor="#1A7FE8" stopOpacity="0"/></radialGradient>
                {routes.map(([fk,tk],i)=><path key={`d${i}`} id={`r${i}`} d={makePath(nodes[fk],nodes[tk])} fill="none" stroke="none"/>)}
              </defs>

              {/* Grid sutil */}
              <pattern id="mg" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0L0 0 0 36" fill="none" stroke="rgba(26,127,232,0.03)" strokeWidth="0.5"/></pattern>
              <rect width="490" height="450" fill="url(#mg)"/>

              {/* Carreteras — estilo Apple Maps dark con azul Cooflotax */}
              <path d="M30,450 Q70,420 105,395 Q140,370 175,320 Q200,285 222,268 Q245,252 270,240 Q290,230 302,280 Q320,290 332,300 Q360,315 490,340" fill="none" stroke="rgba(26,127,232,0.10)" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M270,240 Q282,228 296,218 Q316,195 335,165 Q344,148 352,138 Q380,100 440,15" fill="none" stroke="rgba(26,127,232,0.08)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M335,165 Q345,150 352,138 Q380,145 408,155" fill="none" stroke="rgba(26,127,232,0.06)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M270,240 Q210,260 158,278" fill="none" stroke="rgba(26,127,232,0.05)" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M105,395 Q130,398 162,400" fill="none" stroke="rgba(26,127,232,0.05)" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M105,395 Q100,378 92,365" fill="none" stroke="rgba(26,127,232,0.04)" strokeWidth="1" strokeLinecap="round"/>
              <path d="M175,320 Q155,345 140,360" fill="none" stroke="rgba(26,127,232,0.04)" strokeWidth="1" strokeLinecap="round"/>

              {/* Zonas urbanas */}
              <ellipse cx={nodes.duitama.x} cy={nodes.duitama.y} rx="26" ry="18" fill="rgba(26,127,232,0.04)"/>
              <ellipse cx={nodes.tunja.x} cy={nodes.tunja.y} rx="20" ry="14" fill="rgba(26,127,232,0.03)"/>
              <ellipse cx={nodes.sogamoso.x} cy={nodes.sogamoso.y} rx="18" ry="12" fill="rgba(26,127,232,0.025)"/>

              {/* Rutas Cooflotax */}
              {routes.map(([fk,tk],i)=>(
                <path key={`b${i}`} d={makePath(nodes[fk],nodes[tk])} fill="none" stroke="rgba(26,127,232,0.07)" strokeWidth="1.2" style={{opacity:revealed?1:0,transition:`opacity 0.8s ease ${i*0.06}s`}}/>
              ))}

              {/* Carros */}
              {revealed && routes.map(([fk,tk,dur,delay],i)=>{
                const ret=`${parseFloat(delay)+parseFloat(dur)*0.55}s`;
                return(
                  <g key={`c${i}`}>
                    <circle r="5" fill="#1A7FE8" opacity="0" filter="url(#tg)">
                      <animateMotion dur={dur} begin={delay} repeatCount="indefinite" fill="freeze"><mpath href={`#r${i}`}/></animateMotion>
                      <animate attributeName="opacity" values="0;0.10;0.08;0.02;0" keyTimes="0;0.04;0.55;0.92;1" dur={dur} begin={delay} repeatCount="indefinite"/>
                    </circle>
                    <circle r="2.8" fill="#5DB8FF" opacity="0" filter="url(#cg)">
                      <animateMotion dur={dur} begin={delay} repeatCount="indefinite" fill="freeze"><mpath href={`#r${i}`}/></animateMotion>
                      <animate attributeName="opacity" values="0;0.45;0.38;0.10;0" keyTimes="0;0.04;0.60;0.93;1" dur={dur} begin={delay} repeatCount="indefinite"/>
                    </circle>
                    <circle r="1.5" fill="white" filter="url(#cg)">
                      <animateMotion dur={dur} begin={delay} repeatCount="indefinite" fill="freeze"><mpath href={`#r${i}`}/></animateMotion>
                      <animate attributeName="opacity" values="0;1;0.90;0.25;0" keyTimes="0;0.03;0.65;0.95;1" dur={dur} begin={delay} repeatCount="indefinite"/>
                    </circle>
                    <circle r="1" fill="#5DB8FF" filter="url(#cg)">
                      <animateMotion dur={dur} begin={ret} repeatCount="indefinite" fill="freeze" keyPoints="1;0" keyTimes="0;1" calcMode="linear"><mpath href={`#r${i}`}/></animateMotion>
                      <animate attributeName="opacity" values="0;0.30;0.25;0.05;0" keyTimes="0;0.04;0.60;0.94;1" dur={dur} begin={ret} repeatCount="indefinite"/>
                    </circle>
                  </g>
                );
              })}

              {/* Hub glows */}
              <circle cx={nodes.duitama.x} cy={nodes.duitama.y} r="48" fill="url(#hr)" style={{opacity:revealed?1:0,transition:'opacity 1.5s ease'}}/>
              {revealed&&[0,1].map(r=><circle key={`dp${r}`} cx={nodes.duitama.x} cy={nodes.duitama.y} r="14" fill="none" stroke="rgba(26,127,232,0.15)" strokeWidth="0.5" opacity="0"><animate attributeName="r" values="14;35;35" dur="4.5s" begin={`${r*2.2}s`} repeatCount="indefinite"/><animate attributeName="opacity" values="0.20;0.03;0" dur="4.5s" begin={`${r*2.2}s`} repeatCount="indefinite"/></circle>)}
              <circle cx={nodes.tunja.x} cy={nodes.tunja.y} r="36" fill="url(#ht)" style={{opacity:revealed?1:0,transition:'opacity 1.5s ease 0.5s'}}/>

              {/* Ciudades */}
              {Object.values(nodes).map((city,i)=>{
                const isO=city.type==='origen', isC=city.type==='capital', isH=city.type==='hub', isB=isO||isC||isH;
                const lx = isB ? city.x+14 : city.x>350 ? city.x-6 : city.x+8;
                const anc = !isB&&city.x>350 ? 'end' : 'start';
                return(
                  <g key={city.name} style={{opacity:revealed?1:0,transform:revealed?'scale(1)':'scale(0)',transformOrigin:`${city.x}px ${city.y}px`,transition:`all 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i*0.06+0.3}s`}}>
                    <circle cx={city.x} cy={city.y} r={isO?5.5:isC?4.5:isH?4:2.2} fill={isO?'#1A7FE8':isC?'#1A7FE8':isH?'#5DB8FF':'rgba(93,184,255,0.40)'} stroke={isB?'rgba(255,255,255,0.45)':'none'} strokeWidth={isB?1.8:0} filter={isB?'url(#hg)':'none'}/>
                    {!isB&&<circle cx={city.x} cy={city.y} r="0.8" fill="rgba(93,184,255,0.7)"/>}
                    <text x={lx} y={city.y+(isB?1.5:3)} textAnchor={anc} fill={isO?'rgba(255,255,255,0.88)':isC?'rgba(255,255,255,0.78)':isH?'rgba(255,255,255,0.68)':'rgba(160,195,230,0.40)'} fontSize={isO?10:isC?9.5:isH?9:7.5} fontWeight={isB?600:400} fontFamily="'DM Sans', sans-serif">{city.name}</text>
                    {isO&&<text x={lx} y={city.y+12} fill="rgba(26,127,232,0.45)" fontSize="5" fontWeight="600" fontFamily="'DM Sans', sans-serif">Sede principal</text>}
                    {isC&&<text x={lx} y={city.y+12} fill="rgba(26,127,232,0.35)" fontSize="5" fontWeight="600" fontFamily="'DM Sans', sans-serif">Capital</text>}
                  </g>
                );
              })}
            </svg>

            {/* Leyenda */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16,padding:'4px 0 0'}}>
              {[{c:'#1A7FE8',l:'Origen',r:true},{c:'#1A7FE8',l:'Capital',r:true},{c:'rgba(93,184,255,0.4)',l:'Destinos'},{c:'white',l:'En tránsito',g:true}].map((l,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:4}}>
                  <div style={{width:l.g?6:5,height:l.g?6:5,borderRadius:'50%',background:l.c,border:l.r?'1.5px solid rgba(255,255,255,0.35)':'none',boxShadow:l.g?'0 0 4px rgba(93,184,255,0.6)':''}}/>
                  <span style={{fontFamily:"'DM Sans', sans-serif",fontSize:7,fontWeight:500,color:'rgba(160,195,230,0.35)'}}>{l.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL: NOSOTROS
   ══════════════════════════════════════════════ */
export default function Nosotros() {
  const isTouch = useIsTouch();

  return (
    <main className="relative bg-[#020A14] text-white overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <ScrollProgress />

      {/* Fuentes cargadas globalmente desde layout.js via next/font */}

      <style dangerouslySetInnerHTML={{ __html: `
        /* Aliases para que los font-family del JSX sigan funcionando
           usando las fuentes ya cargadas por next/font en layout.js */
        :root {
          --dm-sans: var(--font-dm-sans, 'DM Sans', sans-serif);
          --cormorant: var(--font-cormorant, 'Cormorant Garamond', serif);
          --jetbrains: var(--font-jetbrains, 'JetBrains Mono', monospace);
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #020A14; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #1A7FE8, #0057B8); border-radius: 10px; }

        @keyframes goldShimmer {
          0% { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, #1A7FE8 0%, #A8D4FF 25%, #1A7FE8 50%, #A8D4FF 75%, #1A7FE8 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldShimmer 6s linear infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 30s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }

        .hover-lift {
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px -20px rgba(26,127,232,0.15);
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(26,127,232,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(26,127,232,0); }
        }

        @keyframes gradientSlide {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-18px) rotate(1deg); }
          66% { transform: translateY(-8px) rotate(-1deg); }
        }

        .float-slow { animation: floatSlow 10s ease-in-out infinite; }
        .float-slow-delay { animation: floatSlow 8s ease-in-out 2s infinite; }

        @keyframes lightSweepBoyaca {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        @keyframes auroraShift {
          0%   { transform: translate(0%, 0%) rotate(0deg) scale(1); }
          25%  { transform: translate(5%, -8%) rotate(3deg) scale(1.05); }
          50%  { transform: translate(-3%, 4%) rotate(-2deg) scale(0.97); }
          75%  { transform: translate(7%, 2%) rotate(4deg) scale(1.03); }
          100% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
        }
        @keyframes auroraShift2 {
          0%   { transform: translate(0%, 0%) rotate(0deg) scale(1); }
          33%  { transform: translate(-8%, 5%) rotate(-4deg) scale(1.08); }
          66%  { transform: translate(4%, -6%) rotate(2deg) scale(0.95); }
          100% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
        }
        @keyframes auroraShift3 {
          0%   { transform: translate(0%, 0%) scale(1); }
          40%  { transform: translate(6%, 6%) scale(1.1); }
          80%  { transform: translate(-5%, -3%) scale(0.96); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes driftParticle {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-120px) translateX(30px); opacity: 0; }
        }

        @keyframes orbitSlow {
          0%   { transform: rotate(0deg) translateX(180px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
        }
        @keyframes orbitSlow2 {
          0%   { transform: rotate(120deg) translateX(140px) rotate(-120deg); }
          100% { transform: rotate(480deg) translateX(140px) rotate(-480deg); }
        }
        @keyframes morphBlob {
          0%, 100% { border-radius: 42% 58% 62% 38% / 45% 55% 45% 55%; transform: scale(1) rotate(0deg); }
          33%      { border-radius: 55% 45% 38% 62% / 52% 48% 52% 48%; transform: scale(1.05) rotate(60deg); }
          66%      { border-radius: 38% 62% 55% 45% / 48% 52% 48% 52%; transform: scale(0.97) rotate(120deg); }
        }
        @keyframes shimmerLine {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes floatBus {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes spinWheelFront {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spinWheelRear {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes motionLine1 {
          0%   { opacity: 0; transform: translateX(0px);  }
          40%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(-28px); }
        }
        @keyframes motionLine2 {
          0%   { opacity: 0; transform: translateX(0px);  }
          40%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(-22px); }
        }
        @keyframes motionLine3 {
          0%   { opacity: 0; transform: translateX(0px);  }
          40%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(-18px); }
        }
        @keyframes windowGlow {
          0%, 100% { opacity: 0.65; }
          50%       { opacity: 0.90; }
        }

        /* ── Taxi driving animations ── */
        @keyframes taxiFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          30%      { transform: translateY(-6px) rotate(-0.3deg); }
          60%      { transform: translateY(-3px) rotate(0.2deg); }
          80%      { transform: translateY(-7px) rotate(-0.2deg); }
        }
        @keyframes taxiShadowDrive {
          0%,100% { transform: scaleX(1);    opacity: 0.18; }
          40%     { transform: scaleX(0.92); opacity: 0.12; }
          70%     { transform: scaleX(0.95); opacity: 0.14; }
        }
        @keyframes taxiGlow {
          0%,100% { opacity: 0.18; transform: scale(1); }
          50%     { opacity: 0.28; transform: scale(1.06); }
        }

        .corporate-shimmer-boyaca {
          background: linear-gradient(
            108deg,
            #0057B8 0%,
            #0057B8 36%,
            #4da3ff 41%,
            #d4eaff 46%,
            #4da3ff 51%,
            #0057B8 56%,
            #0057B8 100%
          );
          background-size: 280% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.9));
          animation: lightSweepBoyaca 9s linear infinite;
        }

        /* ── Valores section ── */
        @keyframes carBreath {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes shadowBreath {
          0%, 100% { transform: translateX(-50%) scaleX(1);   opacity: 0.18; }
          50%       { transform: translateX(-50%) scaleX(0.93); opacity: 0.12; }
        }
        @keyframes glowBreath {
          0%, 100% { opacity: 0.35; transform: translateX(-50%) scaleX(1); }
          50%       { opacity: 0.55; transform: translateX(-50%) scaleX(1.05); }
        }
        @keyframes badgePop {
          0%   { opacity: 0; transform: scale(0.85) translateY(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .val-card-white { transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease; }
        .val-card-white:hover { transform: translateY(-8px) !important; }
        .val-card-white:hover .val-icon-bg { transform: scale(1.08); }
        .val-card-white:hover .val-bar { width: 52px !important; }
        .val-card-blue { transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease; }
        .val-card-blue:hover { transform: translateY(-7px) !important; box-shadow: 0 20px 48px rgba(26,127,232,0.14), 0 4px 12px rgba(26,127,232,0.08) !important; }
        .val-card-blue:hover .val-bar-blue { width: 50px !important; }
        .val-card-blue:hover .val-icon-blue { transform: scale(1.10); }

        /* ── CTA section ── */
        @keyframes activePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes ctaMapShadow {
          0%, 100% { box-shadow: 0 20px 60px rgba(26,127,232,0.12), 0 4px 16px rgba(26,127,232,0.06); }
          50%       { box-shadow: 0 28px 72px rgba(26,127,232,0.20), 0 6px 20px rgba(26,127,232,0.10); }
        }
        .cta-map-card { animation: ctaMapShadow 4s ease-in-out infinite; }
        .cta-dest-chip:hover { background: rgba(26,127,232,0.12) !important; border-color: rgba(26,127,232,0.35) !important; color: #1A7FE8 !important; }
        .cta-dest-chip { transition: all 0.25s ease; cursor: default; }
        .cta-stat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(26,127,232,0.12) !important; }
        .cta-stat-card { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease; }
        .cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 20px 50px rgba(26,127,232,0.55) !important; }
        .cta-btn-primary { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .cta-btn-secondary:hover { background: #F0F6FF !important; border-color: rgba(26,127,232,0.4) !important; }
        .cta-btn-secondary { transition: background 0.25s ease, border-color 0.25s ease; }

        /* ══════════════════════════════════════════
           RESPONSIVE — Mobile & Tablet
        ══════════════════════════════════════════ */

        /* ── Tablet (≤1023px) ── */
        @media (max-width: 1023px) {
          .valores-grid { grid-template-columns: 1fr !important; }
          .valores-grid > * { order: unset; }
          .valores-cards-grid { grid-template-columns: 1fr 1fr !important; }
          .resena-sidebar { display: none !important; }

        }

        /* ── Mobile (≤767px) ── */
        @media (max-width: 767px) {
          /* Sección Legado stats: 2 col en mobile */
          .legado-stats-grid { grid-template-columns: 1fr 1fr !important; }

          /* CTA layout: 1 columna */
          .cta-layout-grid { grid-template-columns: 1fr !important; }

          /* Mapa mínimo en mobile */
          .mapa-minheight { min-height: 260px !important; }

          /* CTA stat cards: 2 columnas */
          .cta-stat-card-grid { grid-template-columns: 1fr 1fr !important; }

          /* Chips de destinos: flex-wrap más apretado */
          .cta-dest-chip { padding: 7px 12px !important; font-size: 12px !important; }

          /* Botones CTA: full width apilados */
          .cta-btns-stack { flex-direction: column !important; }
          .cta-btns-stack a, .cta-btns-stack button { width: 100% !important; justify-content: center !important; }

          /* Padding del mini stats grid de Valores */
          .valores-stats-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }

        /* ── Móvil pequeño (≤639px) ── */
        @media (max-width: 639px) {
          .valores-cards-grid { grid-template-columns: 1fr !important; }
          .legado-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .mapa-minheight { min-height: 240px !important; }
          .cta-layout-grid { grid-template-columns: 1fr !important; }
          .hero-eyebrow { font-size: 7px !important; letter-spacing: 0.3em !important; }

          /* Texto de la sección divisor cinematográfico */
          .parallax-text-heading { font-size: clamp(2rem, 8vw, 3.5rem) !important; }
        }

        /* ── iPhone SE y pantallas muy pequeñas (≤390px) ── */
        @media (max-width: 390px) {
          .legado-stats-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .valores-cards-grid { grid-template-columns: 1fr !important; }
          .cta-dest-chip { padding: 6px 10px !important; font-size: 11px !important; border-radius: 8px !important; }
        }

        /* ── Touch devices: sin hovers costosos ── */
        @media (hover: none) {
          .val-card-blue:hover, .val-card-white:hover { transform: none !important; }
          .hover-lift:hover { transform: none !important; box-shadow: none !important; }
          .cta-stat-card:hover { transform: none !important; }
          .cta-btn-primary:hover { transform: none !important; }
        }
      `}} />

      {/* ════════════════════════════════════════════
          SECCIÓN 1 · HERO — Secuencia cinematográfica (INTACTO)
      ════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden bg-[#020A14]">
        <video autoPlay muted loop playsInline preload="auto" x-webkit-airplay="allow"
          className="absolute inset-0 w-full h-full object-cover opacity-75 scale-[1.04]">
          <source src="/HistoriaFondo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#020A14]/20 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(2,10,20,0.85) 100%)' }} />
        <div className="absolute top-0 inset-x-0 h-44 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(2,10,20,0.8), transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-44 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(2,10,20,0.9), transparent)' }} />
        <HeroSequence />
      </section>

      {/* ════════════════════════════════════════════
          MARQUEE SEPARATOR (INTACTO)
      ════════════════════════════════════════════ */}
      <section className="relative py-[13px] overflow-hidden z-20" style={{ background: '#020D1F', borderTop: '1px solid rgba(26,127,232,0.18)', borderBottom: '1px solid rgba(26,127,232,0.18)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, #020D1F 0%, transparent 8%, transparent 92%, #020D1F 100%)', zIndex: 2 }} />
        <div className="flex whitespace-nowrap marquee-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 mx-8">
              {['Compromiso', 'Seguridad', 'Calidad', 'Tradición', 'Innovación', 'Cooperativismo', '60 Años'].map((word, j) => (
                <span key={j} className="flex items-center gap-8">
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', color: j % 2 === 1 ? '#1A7FE8' : 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>{word}</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(26,127,232,0.7)', display: 'inline-block' }} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════
          ██████  CONTENIDO NUEVO DESDE AQUÍ  ██████
      ════════════════════════════════════════════════════════════════ */}


      {/* ════════════════════════════════════════════
          SECCIÓN · RESEÑA HISTÓRICA — Editorial cinematográfica
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#FAFCFF' }}>
        {/* Formas decorativas abstractas */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(26,127,232,0.15), transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,87,184,0.12), transparent 70%)' }} />
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(26,127,232,0.12), transparent)' }} />

        <div className="relative z-10 max-w-[1340px] mx-auto px-6" style={{ paddingTop: 'clamp(80px, 10vh, 120px)', paddingBottom: 'clamp(80px, 10vh, 120px)' }}>

          {/* Header de sección */}
          <div className="text-center" style={{ marginBottom: 'clamp(48px, 6vh, 72px)' }}>
            <Reveal>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 22px', borderRadius: 40, background: 'linear-gradient(135deg, rgba(26,127,232,0.06), rgba(0,87,184,0.04))', border: '1px solid rgba(26,127,232,0.12)', marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A7FE8', animation: 'pulseGlow 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#0057B8' }}>Est. 1964 · Duitama, Boyacá</span>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)', fontWeight: 800, color: '#0A1628', lineHeight: 1.05, margin: '0 0 20px' }}>
                La Historia de{' '}
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{ color: '#1A7FE8' }}>Cooflotax</span>
                  <svg className="absolute -bottom-1 left-0 w-full" height="10" viewBox="0 0 200 10" fill="none" style={{ overflow: 'visible' }}>
                    <path d="M0 5 Q40 1, 100 5 T200 5" stroke="#1A7FE8" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.35" />
                  </svg>
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(15px, 1.5vw, 18px)', color: '#64748B', lineHeight: 1.85, maxWidth: 680, margin: '0 auto' }}>
                Más de seis décadas moviendo a Boyacá. Una cooperativa que nació del trabajo honesto, la comunidad y la visión de un grupo de transportadores.
              </p>
            </Reveal>
          </div>

          {/* Layout editorial: texto e imagen */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 56 }} className="lg:!grid-cols-[1fr_420px]">

            {/* Columna de contenido principal */}
            <div>
              <Reveal direction="right" delay={100}>
                <div style={{ position: 'relative', padding: '40px 0 40px 36px', borderLeft: '2px solid rgba(26,127,232,0.15)' }}>
                  {/* Dot en la línea */}
                  <div style={{ position: 'absolute', left: -6, top: 44, width: 10, height: 10, borderRadius: '50%', background: '#1A7FE8', border: '2px solid #FAFCFF' }} />
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#1A7FE8', margin: '0 0 14px' }}>23 de octubre de 1964</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(15px, 1.4vw, 17px)', color: '#374151', lineHeight: 1.95, margin: '0 0 24px' }}>
                    En asamblea general, los socios fundadores se reunieron con el objetivo de constituir una sociedad cooperativa. Todos dedicados a la industria del transporte automotor con vehículos propios, mediante instrumento público N.° 1198 del 28 de diciembre de 1964, protocolizado ante la Notaría Primera del Circuito, bajo la presidencia de <strong style={{ color: '#0A1628', fontWeight: 700 }}>Carlos Arturo Morales</strong>, primer gerente provisional elegido por aclamación.
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(15px, 1.4vw, 17px)', color: '#374151', lineHeight: 1.95, margin: 0 }}>
                    Mediante resolución N.° 00787 del 17 de diciembre de 1964, la Superintendencia Nacional de Cooperativas reconoció la personería jurídica de la <strong style={{ color: '#0A1628', fontWeight: 700 }}>"Cooperativa de Transportadores Flotax Duitama Ltda."</strong>, con domicilio en Duitama y operaciones en los municipios de Duitama, Sogamoso y Santa Rosa de Viterbo.
                  </p>
                </div>
              </Reveal>

              <Reveal direction="right" delay={180}>
                <div style={{ position: 'relative', padding: '32px 0 32px 36px', borderLeft: '2px solid rgba(26,127,232,0.15)' }}>
                  <div style={{ position: 'absolute', left: -6, top: 36, width: 10, height: 10, borderRadius: '50%', background: '#3D8FD4', border: '2px solid #FAFCFF' }} />
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#3D8FD4', margin: '0 0 14px' }}>Crecimiento y expansión</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(15px, 1.4vw, 17px)', color: '#374151', lineHeight: 1.95, margin: 0 }}>
                    Inicialmente su radio de acción fue Duitama y Santa Rosa de Viterbo. Su objeto: satisfacer las necesidades de transporte regional mediante el fomento de la industria con base en el trabajo de los propios socios, integrando el transporte de pasajeros y encomiendas. Hoy, Cooflotax cuenta con habilitación del Ministerio de Transporte en modalidad de pasajeros por carretera — servicio especial e intermunicipal — con destinos a Santa Rosa de Viterbo, Belén, Paz de Río, Socha, Sogamoso, Paipa, Tunja, Tuta, Siachoque, Nuevo Colón, Motavita y Sotaquirá, además del servicio urbano tipo taxi y servicio mixto habilitado por la Alcaldía de Duitama.
                  </p>
                </div>
              </Reveal>

              <Reveal direction="right" delay={260}>
                <div style={{ position: 'relative', padding: '32px 0 0 36px', borderLeft: '2px solid rgba(26,127,232,0.08)' }}>
                  <div style={{ position: 'absolute', left: -6, top: 36, width: 10, height: 10, borderRadius: '50%', background: '#0057B8', border: '2px solid #FAFCFF' }} />
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#0057B8', margin: '0 0 14px' }}>Hoy en día</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(15px, 1.4vw, 17px)', color: '#374151', lineHeight: 1.95, margin: 0 }}>
                    Actualmente, Cooflotax genera alrededor de <strong style={{ color: '#0A1628' }}>300 empleos directos</strong> y <strong style={{ color: '#0A1628' }}>200 empleos indirectos</strong>, consolidándose como uno de los principales motores de desarrollo económico y social de la región. La cooperativa opera bajo un sistema integrado de gestión certificado en <strong style={{ color: '#0A1628' }}>OHSAS 18001:2007</strong> e <strong style={{ color: '#0A1628' }}>ISO 9001:2015</strong>, garantizando estándares internacionales de calidad, seguridad y mejora continua en cada uno de sus procesos. A través de su flota y sus estaciones de servicio, Cooflotax sigue fortaleciendo los vínculos con las comunidades boyacenses, contribuyendo al bienestar de cientos de familias de la región.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Columna lateral: imagen + stats */}
            <div className="resena-sidebar hidden lg:block">
              <Reveal direction="left" delay={200}>
                <div className="sticky" style={{ top: 100 }}>
                  {/* Logo flotante con animación */}
                  <div className="float-slow" style={{ position: 'relative', marginBottom: 28 }}>
                    {/* Glow detrás del logo */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(26,127,232,0.12) 0%, rgba(26,127,232,0.04) 50%, transparent 70%)', borderRadius: '50%', filter: 'blur(30px)', animation: 'pulseGlow 3s ease-in-out infinite' }} />
                    <div style={{
                      position: 'relative', borderRadius: 28, overflow: 'hidden',
                      background: 'linear-gradient(145deg, #F0F5FF 0%, #FAFCFF 50%, #EBF4FF 100%)',
                      border: '1px solid rgba(26,127,232,0.10)',
                      boxShadow: '0 24px 64px rgba(0,0,0,0.06), 0 8px 24px rgba(26,127,232,0.06)',
                      padding: '48px 32px 40px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {/* Logo image con animación de flotación independiente */}
                      <div className="float-slow-delay" style={{ marginBottom: 24, filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.12))' }}>
                        <img
                          src="/logo.webp"
                          alt="Logo Cooflotax"
                          loading="lazy"
                          style={{
                            width: 220, height: 'auto', objectFit: 'contain', display: 'block',
                          }}
                        />
                      </div>
                      {/* Texto debajo del logo */}
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 800, color: '#0A1628', margin: '0 0 4px', letterSpacing: '-0.01em' }}>Duitama, Boyacá</p>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#1A7FE8', margin: '0 0 12px' }}>Sede Principal</p>
                        <div style={{ width: 40, height: 2, background: 'linear-gradient(to right, transparent, #1A7FE8, transparent)', margin: '0 auto 12px', borderRadius: 1 }} />
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#64748B', margin: 0, lineHeight: 1.6 }}>Servimos con Calidez</p>
                      </div>
                    </div>
                  </div>

                  {/* Widget de Rutas animado */}
                  <RoutesWidget />

                  {/* Mini stats grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { end: 60, suffix: '+', label: 'Años', color: '#1A7FE8' },
                      { end: 450, suffix: '+', label: 'Familias', color: '#0057B8' },
                      { end: 380, suffix: '+', label: 'Conductores', color: '#3D8FD4' },
                      { end: 33, suffix: '', label: 'Empleos directos', color: '#1A7FE8' },
                    ].map((s, i) => (
                      <Reveal key={i} direction="up" delay={300 + i * 60}>
                        <div className="hover-lift" style={{
                          padding: '24px 16px', borderRadius: 16, textAlign: 'center',
                          background: 'white', border: `1px solid ${s.color}18`,
                          boxShadow: `0 4px 24px ${s.color}08`,
                        }}>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>
                            <AnimatedCounter end={s.end} suffix={s.suffix} />
                          </div>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', marginTop: 8, margin: '8px 0 0' }}>{s.label}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SEPARADOR · Imagen cinematográfica full-width
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(320px, 45vh, 520px)', background: '#000' }}>
        {/* En desktop: parallax fixed. En móvil/iOS: img normal (Safari ignora fixed) */}
        {isTouch ? (
          <img
            src="/duitama.webp"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 40%',
              display: 'block',
            }}
          />
        ) : (
          <div className="parallax-bg" style={{
            position: 'absolute', inset: 0,
            backgroundImage: "url('/duitama.webp')",
            backgroundSize: 'cover', backgroundPosition: 'center 40%',
            backgroundAttachment: 'fixed',
          }} />
        )}
        {/* Overlay oscuro central para legibilidad del texto */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(2,8,20,0.55) 0%, rgba(2,8,20,0.30) 60%, rgba(2,8,20,0.15) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #FAFCFF 0%, transparent 12%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #F0F5FF 0%, transparent 14%)' }} />

        {/* Título centrado */}
        <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
          <Reveal>
            <div style={{ textAlign: 'center', padding: '0 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.5))' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.55em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>Desde 1964</span>
                <div style={{ width: 40, height: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.5))' }} />
              </div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.6rem, 6.5vw, 5.2rem)', fontWeight: 800,
                color: 'white', lineHeight: 1.0, margin: '0 0 12px',
                letterSpacing: '-0.02em',
                textShadow: '0 4px 40px rgba(0, 0, 0, 0.01), 0 1px 3px rgba(216, 196, 196, 0)',
              }}>
                Moviendo a{' '}
                <em className="corporate-shimmer-boyaca" style={{ fontStyle: 'italic' }}>Boyacá</em>
                
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(13px, 1.4vw, 16px)',
                fontWeight: 400, color: 'rgba(255,255,255,0.7)', margin: 0,
                letterSpacing: '0.02em', textShadow: '0 2px 12px rgba(0,0,0,0.7)',
              }}>
                Cada kilómetro, un compromiso con nuestra comunidad
              </p>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          SECCIÓN · NUESTRO LEGADO — Foto + texto conciso + fondo animado
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#020A18' }}>

        {/* ── FONDO ANIMADO ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
          {/* Orbes aurora */}
          <div style={{ position: 'absolute', top: '-20%', left: '-15%', width: '60%', height: '65%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,87,184,0.20) 0%, rgba(0,40,90,0.05) 50%, transparent 70%)', filter: 'blur(80px)', animation: 'auroraShift 18s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '55%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,127,232,0.16) 0%, rgba(26,127,232,0.03) 50%, transparent 70%)', filter: 'blur(70px)', animation: 'auroraShift2 22s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '40%', left: '50%', width: '30%', height: '35%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(126,200,255,0.08) 0%, transparent 60%)', filter: 'blur(55px)', animation: 'auroraShift3 15s ease-in-out infinite' }} />
          {/* Partículas */}
          {[
            { t: '65%', l: '8%', s: 2.5, d: 0, dur: 9 },
            { t: '78%', l: '22%', s: 2, d: 2.5, dur: 11 },
            { t: '72%', l: '55%', s: 3, d: 1, dur: 8 },
            { t: '82%', l: '75%', s: 2, d: 4, dur: 10 },
            { t: '68%', l: '90%', s: 2.5, d: 3, dur: 12 },
          ].map((p, i) => (
            <div key={`lp${i}`} style={{ position: 'absolute', top: p.t, left: p.l, width: p.s, height: p.s, borderRadius: '50%', background: 'rgba(126,200,255,0.45)', boxShadow: '0 0 8px rgba(126,200,255,0.25)', animation: `driftParticle ${p.dur}s ease-in-out ${p.d}s infinite` }} />
          ))}
          {/* Noise */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }} />
        </div>

        {/* Líneas borde */}
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(26,127,232,0.30), transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(26,127,232,0.18), transparent)' }} />

        {/* ── CONTENIDO ── */}
        <div className="relative z-10 max-w-[1340px] mx-auto px-6" style={{ paddingTop: 'clamp(90px, 12vh, 140px)', paddingBottom: 'clamp(90px, 12vh, 140px)' }}>

          {/* LAYOUT: Foto izquierda + texto derecha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(40px, 5vw, 72px)', alignItems: 'center' }} className="lg:!grid-cols-[1fr_1.15fr]">

            {/* ── COLUMNA IZQUIERDA: FOTO ── */}
            <Reveal direction="right" delay={100}>
              <div style={{ position: 'relative' }}>
                {/* Glow detrás de la foto */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(26,127,232,0.15) 0%, transparent 60%)', filter: 'blur(50px)', animation: 'auroraShift3 12s ease-in-out infinite' }} />

                {/* Foto principal */}
                <div style={{
                  position: 'relative', borderRadius: 24, overflow: 'hidden',
                  border: '1px solid rgba(26,127,232,0.15)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset',
                  aspectRatio: '4 / 5',
                }}>
                  <img
                    src="/terminal.webp"
                    alt="terminal de Duitama"
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', display: 'block' }}
                  />
                  {/* Overlay gradiente inferior */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,10,24,0.85) 0%, rgba(2,10,24,0.15) 35%, transparent 60%)' }} />
                  {/* Overlay gradiente superior sutil */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2,10,24,0.30) 0%, transparent 30%)' }} />

                  {/* Badge sobre la foto */}
                  <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 40, background: 'rgba(2,10,24,0.60)', backdropFilter: 'blur(12px)', border: '1px solid rgba(26,127,232,0.25)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A7FE8', boxShadow: '0 0 10px rgba(26,127,232,0.5)', animation: 'pulseGlow 2.5s ease-in-out infinite' }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>Est. 1964</span>
                  </div>

                  {/* Texto sobre la foto (abajo) */}
                  <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28 }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, margin: '0 0 8px', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
                      Duitama, Boyacá
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.60)', margin: 0 }}>Sede principal · Terminal de transporte</p>
                  </div>
                </div>

                {/* Decoración: línea lateral animada */}
                <div style={{ position: 'absolute', top: '15%', left: -16, width: 2, height: '30%', background: 'linear-gradient(to bottom, transparent, #1A7FE8, transparent)', borderRadius: 1, opacity: 0.4, animation: 'floatSlow 8s ease-in-out infinite' }} />
              </div>
            </Reveal>

            {/* ── COLUMNA DERECHA: TEXTO + STATS ── */}
            <div>
              <Reveal>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                  <div style={{ width: 48, height: 1.5, background: 'linear-gradient(to right, #1A7FE8, transparent)', borderRadius: 1 }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(126,200,255,0.75)' }}>Nuestro Legado</span>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(2.6rem, 5vw, 4.2rem)', fontWeight: 800,
                  color: 'white', lineHeight: 1.05,
                  margin: '0 0 28px', letterSpacing: '-0.02em',
                }}>
                  Seis décadas{' '}
                  <em style={{ color: '#1A7FE8', fontStyle: 'italic', textShadow: '0 0 50px rgba(26,127,232,0.25)' }}>de compromiso</em>
                  {' '}con Boyacá
                </h2>
              </Reveal>

              <Reveal delay={180}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 'clamp(15px, 1.5vw, 17px)', fontWeight: 400,
                  color: 'rgba(255,255,255,0.52)', lineHeight: 1.95,
                  margin: '0 0 40px', maxWidth: 540,
                }}>
                  Desde 1964, Cooflotax conecta los municipios de Boyacá con un servicio que nació del trabajo honesto y la visión cooperativa. Hoy operamos con certificaciones internacionales de calidad y seguridad, moviendo a miles de pasajeros cada día.
                </p>
              </Reveal>

              {/* Stats — 2x2 grid compacto */}
              <div className="legado-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
                {[
                  { end: 60, suffix: '+', label: 'Años', desc: 'de trayectoria', color: '#60B5FF' },
                  { end: 380, suffix: '+', label: 'Conductores', desc: 'profesionales activos', color: '#1A7FE8' },
                  { end: 12, suffix: '+', label: 'Municipios', desc: 'conectados en Boyacá', color: '#7EC8FF' },
                  { end: 450, suffix: '+', label: 'Familias', desc: 'cooperadas beneficiadas', color: '#60B5FF' },
                ].map((s, i) => (
                  <Reveal key={i} direction="up" delay={250 + i * 80}>
                    <div style={{
                      padding: '24px 22px',
                      borderRadius: 16,
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(26,127,232,0.10)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'background 0.4s ease, border-color 0.4s ease',
                    }}
                      className="hover:!bg-[rgba(26,127,232,0.06)] hover:!border-[rgba(26,127,232,0.20)]"
                    >
                      {/* Línea superior */}
                      <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1.5, background: `linear-gradient(to right, transparent, ${s.color}35, transparent)`, borderRadius: 1 }} />

                      {/* Número */}
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(2.4rem, 3.5vw, 3rem)', fontWeight: 900,
                        color: s.color, lineHeight: 1, letterSpacing: '-0.03em',
                        marginBottom: 4,
                        filter: `drop-shadow(0 2px 12px ${s.color}25)`,
                      }}>
                        <AnimatedCounter end={s.end} suffix={s.suffix} />
                      </div>

                      {/* Label */}
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.88)', margin: '0 0 2px' }}>{s.label}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{s.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Certificaciones + datos en línea */}
              <Reveal delay={580}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {['ISO 9001:2015', 'OHSAS 18001:2007'].map((cert, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 10, background: 'rgba(26,127,232,0.06)', border: '1px solid rgba(26,127,232,0.14)' }}>
                      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#1A7FE8" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.70)' }}>{cert}</span>
                    </div>
                  ))}
                  <div style={{ width: 1, height: 18, background: 'rgba(26,127,232,0.12)' }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.32)' }}>300 empleos directos · 2 estaciones</span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          SECCIÓN · MISIÓN, VISIÓN, SERVICIOS — Innovador premium
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#FFFFFF' }}>

        {/* ── FONDO ANIMADO ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
          {/* Grid de puntos animado */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.025 }}>
            <defs>
              <pattern id="dotGrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#0057B8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
          </svg>
          {/* Blob morfing */}
          <div style={{ position: 'absolute', top: '-12%', right: '-8%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(26,127,232,0.05) 0%, transparent 60%)', animation: 'morphBlob 28s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,87,184,0.04) 0%, transparent 60%)', animation: 'morphBlob 35s ease-in-out 4s infinite' }} />
          {/* Líneas shimmer */}
          {[22, 52, 78].map((t, i) => (
            <div key={`sh${i}`} style={{ position: 'absolute', top: `${t}%`, left: 0, right: 0, height: 1, background: 'rgba(26,127,232,0.035)', overflow: 'hidden' }}>
              <div style={{ width: '25%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(26,127,232,0.10), transparent)', animation: `shimmerLine ${14 + i * 5}s linear ${i * 2}s infinite` }} />
            </div>
          ))}
          {/* Número 60 decorativo gigante */}
          <div style={{ position: 'absolute', top: '8%', right: '-2%', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(20rem, 30vw, 38rem)', fontWeight: 900, lineHeight: 0.85, color: 'rgba(26,127,232,0.018)', pointerEvents: 'none', userSelect: 'none' }}>60</div>
        </div>

        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent 5%, rgba(26,127,232,0.12) 50%, transparent 95%)' }} />

        <div className="relative z-10 max-w-[1340px] mx-auto px-6" style={{ paddingTop: 'clamp(100px, 13vh, 160px)', paddingBottom: 'clamp(100px, 13vh, 160px)' }}>

          {/* ── HEADER con layout asimétrico ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 'clamp(64px, 9vh, 100px)' }} className="lg:!grid-cols-[1fr_auto]">
            <div>
              <Reveal>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1A7FE8', boxShadow: '0 0 12px rgba(26,127,232,0.4)', animation: 'pulseGlow 2.5s ease-in-out infinite' }} />
                  <div style={{ width: 40, height: 1.5, background: 'linear-gradient(to right, #1A7FE8, transparent)' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#0057B8' }}>Quiénes Somos</span>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.8rem, 5.5vw, 4.6rem)', fontWeight: 800, color: '#0A1628', lineHeight: 1.02, margin: 0, letterSpacing: '-0.03em' }}>
                  Los pilares que<br />
                  guían nuestro{' '}
                  <em style={{ color: '#1A7FE8', fontStyle: 'italic', position: 'relative', display: 'inline-block' }}>
                    camino
                    <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" style={{ overflow: 'visible' }}>
                      <path d="M0 4 Q50 0, 100 4 T200 4" stroke="#1A7FE8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3" />
                    </svg>
                  </em>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={160}>
              <div className="hidden lg:block" style={{ maxWidth: 320, paddingTop: 48 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#64748B', lineHeight: 1.85 }}>
                  Cada decisión, cada ruta y cada compromiso con la comunidad Boyacense está respaldado por estos principios fundamentales.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ══════════════════════════════════════════════════════════
              MISIÓN · VISIÓN · OBJETIVO — Carro hero grande + 3 tarjetas
          ══════════════════════════════════════════════════════════ */}
          <div style={{ marginBottom: 'clamp(80px, 10vh, 120px)' }}>
            {/* ── 3 TARJETAS EN FILA — Misión · Visión · Objetivo ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 24, alignItems: 'stretch' }}>

              {/* Misión */}
              <Reveal direction="up" delay={200}>
                <div style={{ position: 'relative', height: '100%' }}>
                  <div style={{ position: 'absolute', top: -20, left: 20, fontFamily: "'Cormorant Garamond', serif", fontSize: '5.5rem', fontWeight: 900, color: '#1A7FE808', lineHeight: 1, pointerEvents: 'none', zIndex: 0 }}>01</div>
                  <div className="hover-lift" style={{ position: 'relative', zIndex: 1, padding: 'clamp(32px, 4vw, 44px) clamp(28px, 3vw, 36px)', borderRadius: 24, height: '100%', background: 'linear-gradient(160deg, #FFFFFF 0%, #FAFCFF 100%)', border: '1px solid rgba(26,127,232,0.08)', boxShadow: '0 12px 48px rgba(10,22,40,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: 3, background: 'linear-gradient(to right, #1A7FE8, transparent)', borderRadius: '0 0 2px 0' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                      <div style={{ width: 54, height: 54, borderRadius: 16, background: '#1A7FE80C', border: '1px solid #1A7FE818', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#1A7FE8" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#1A7FE8', opacity: 0.6 }}>01</span>
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 2.5vw, 2.3rem)', fontWeight: 800, color: '#0A1628', margin: '0 0 18px', letterSpacing: '-0.01em' }}>Misión</h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, fontWeight: 400, lineHeight: 1.9, color: '#64748B', margin: '0 0 24px', flex: 1 }}>Contribuir al desarrollo integral de nuestra región a través del transporte terrestre. La satisfacción, la calidez en el servicio y el respeto a la dignidad humana son nuestros valores fundamentales.</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, background: '#1A7FE806', border: '1px solid #1A7FE812', alignSelf: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1A7FE8' }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: '#1A7FE8' }}>Pioneros en transporte de pasajeros</span>
                    </div>
                  </div>
                </div>
              </Reveal>
              {/* Visión */}
              <Reveal direction="up" delay={310}>
                <div style={{ position: 'relative', height: '100%' }}>
                  <div style={{ position: 'absolute', top: -20, left: 16, fontFamily: "'Cormorant Garamond', serif", fontSize: '5rem', fontWeight: 900, color: '#0057B808', lineHeight: 1, pointerEvents: 'none', zIndex: 0 }}>02</div>
                  <div className="hover-lift" style={{ position: 'relative', zIndex: 1, padding: 'clamp(32px, 4vw, 44px) clamp(28px, 3vw, 36px)', borderRadius: 24, height: '100%', background: 'linear-gradient(160deg, #FFFFFF 0%, #F8FBFF 100%)', border: '1px solid rgba(0,87,184,0.08)', boxShadow: '0 12px 48px rgba(10,22,40,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: 3, background: 'linear-gradient(to right, #0057B8, transparent)', borderRadius: '0 0 2px 0' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                      <div style={{ width: 54, height: 54, borderRadius: 16, background: '#0057B80C', border: '1px solid #0057B818', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0057B8" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z M12 9a3 3 0 100 6 3 3 0 000-6z" /></svg>
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#0057B8', opacity: 0.6 }}>02</span>
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 2.5vw, 2.3rem)', fontWeight: 800, color: '#0A1628', margin: '0 0 18px', letterSpacing: '-0.01em' }}>Visión</h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, fontWeight: 400, lineHeight: 1.9, color: '#64748B', margin: '0 0 24px', flex: 1 }}>Ser líder en atención en el transporte de pasajeros, comprometidos con la calidez del servicio como nuestra mayor diferenciación competitiva.</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, background: '#0057B806', border: '1px solid #0057B812', alignSelf: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#0057B8' }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: '#0057B8' }}>Autónomos y autosuficientes</span>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Objetivo */}
              <Reveal direction="up" delay={420}>
                <div style={{ position: 'relative', height: '100%' }}>
                  <div style={{ position: 'absolute', top: -20, left: 20, fontFamily: "'Cormorant Garamond', serif", fontSize: '5.5rem', fontWeight: 900, color: '#1A7FE808', lineHeight: 1, pointerEvents: 'none', zIndex: 0 }}>03</div>
                  <div className="hover-lift" style={{ position: 'relative', zIndex: 1, padding: 'clamp(32px, 4vw, 44px) clamp(28px, 3vw, 36px)', borderRadius: 24, height: '100%', background: 'linear-gradient(160deg, #FFFFFF 0%, #FAFCFF 100%)', border: '1px solid rgba(26,127,232,0.08)', boxShadow: '0 12px 48px rgba(10,22,40,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: 3, background: 'linear-gradient(to right, #1A7FE8, transparent)', borderRadius: '0 0 2px 0' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                      <div style={{ width: 54, height: 54, borderRadius: 16, background: '#1A7FE80C', border: '1px solid #1A7FE818', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#1A7FE8" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#1A7FE8', opacity: 0.6 }}>03</span>
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 2.5vw, 2.3rem)', fontWeight: 800, color: '#0A1628', margin: '0 0 18px', letterSpacing: '-0.01em' }}>Objetivo</h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, fontWeight: 400, lineHeight: 1.9, color: '#64748B', margin: '0 0 24px', flex: 1 }}>Como organización de economía solidaria, generar rentabilidad económica y social para garantizar supervivencia, crecimiento y desarrollo empresarial permanente.</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, background: '#1A7FE806', border: '1px solid #1A7FE812', alignSelf: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1A7FE8' }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: '#1A7FE8' }}>Economía solidaria</span>
                    </div>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>

                    {/* ── SERVICIOS + DESTINOS — Layout innovador ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0, borderRadius: 28, overflow: 'hidden', border: '1px solid rgba(26,127,232,0.08)', boxShadow: '0 16px 64px rgba(10,22,40,0.05)' }} className="lg:!grid-cols-[1.1fr_1fr]">

            {/* LADO IZQUIERDO — Servicios como timeline */}
            <div style={{ padding: 'clamp(40px, 5vw, 60px)', background: 'linear-gradient(180deg, #FAFCFF, #FFFFFF)' }} className="lg:border-r lg:border-r-[rgba(26,127,232,0.06)] border-b border-b-[rgba(26,127,232,0.06)] lg:border-b-0">
              <Reveal>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 1.5, background: 'linear-gradient(to right, #1A7FE8, transparent)' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#1A7FE8' }}>Habilitaciones</span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#0A1628', margin: '0 0 36px', letterSpacing: '-0.01em' }}>
                  Nuestros <em style={{ color: '#1A7FE8', fontStyle: 'italic' }}>Servicios</em>
                </h3>
              </Reveal>

              {/* Timeline vertical */}
              <div style={{ position: 'relative', paddingLeft: 28 }}>
                {/* Línea vertical */}
                <div style={{ position: 'absolute', top: 8, bottom: 8, left: 5, width: 1.5, background: 'linear-gradient(to bottom, #1A7FE8, rgba(26,127,232,0.08))', borderRadius: 1 }} />

                {[
                  { title: 'Pasajeros Intermunicipales', badge: 'Min. Transporte', desc: 'Rutas entre municipios de Boyacá con habilitación nacional.' },
                  { title: 'Servicio Especial', badge: 'Habilitado', desc: 'Transporte para empresas, instituciones y eventos.' },
                  { title: 'Urbano Tipo Taxi', badge: 'Alcaldía', desc: 'Taxis individuales habilitados en Duitama.' },
                  { title: 'Servicio Mixto', badge: 'Habilitado', desc: 'Pasajeros y carga liviana en una modalidad integrada.' },
                ].map((s, i) => (
                  <Reveal key={i} direction="right" delay={i * 90 + 100}>
                    <div style={{ position: 'relative', marginBottom: i < 3 ? 28 : 0, paddingLeft: 24 }}>
                      {/* Dot en la línea */}
                      <div style={{
                        position: 'absolute', left: -28, top: 6,
                        width: 12, height: 12, borderRadius: '50%',
                        background: 'white', border: '2.5px solid #1A7FE8',
                        boxShadow: '0 0 0 4px rgba(26,127,232,0.08)',
                      }} />

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#0A1628', margin: 0 }}>{s.title}</h4>
                        <span style={{ padding: '2px 10px', borderRadius: 6, background: '#EBF4FF', border: '1px solid rgba(26,127,232,0.12)', fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#1A7FE8' }}>{s.badge}</span>
                      </div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 400, lineHeight: 1.7, color: '#718096', margin: 0 }}>{s.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Certificaciones al pie */}
              <Reveal delay={500}>
                <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid rgba(26,127,232,0.06)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  {['ISO 9001:2015', 'OHSAS 18001:2007'].map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#1A7FE8" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 700, color: '#0A1628' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* LADO DERECHO — Mapa de destinos estilo hub */}
            <div style={{ padding: 'clamp(20px, 5vw, 60px)', background: 'linear-gradient(160deg, #F0F5FF, #FAFCFF)', position: 'relative', overflow: 'hidden' }}>
              {/* Patrón radial decorativo de fondo */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(26,127,232,0.04)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(26,127,232,0.03)', pointerEvents: 'none' }} />

              <Reveal direction="left">
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 1.5, background: 'linear-gradient(to right, #0057B8, transparent)' }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#0057B8' }}>Red de Destinos</span>
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#0A1628', margin: '0 0 32px', letterSpacing: '-0.01em' }}>
                    Conectamos <em style={{ color: '#1A7FE8', fontStyle: 'italic' }}>Boyacá</em>
                  </h3>
                </div>
              </Reveal>

              {/* Hub central: Duitama */}
              <Reveal direction="left" delay={100}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 22px', borderRadius: 16, marginBottom: 20,
                    background: 'linear-gradient(135deg, #0057B8, #1A7FE8)',
                    boxShadow: '0 8px 32px rgba(26,127,232,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset',
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'white', boxShadow: '0 0 12px rgba(255,255,255,0.5)', animation: 'pulseGlow 2s ease-in-out infinite', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 800, color: 'white', margin: 0 }}>Duitama</p>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', margin: 0 }}>Hub Central · Sede Principal</p>
                    </div>
                  </div>

                  {/* Grid de destinos como chips conectados */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(6px, 1.5vw, 8px)' }}>
                    {['Santa Rosa de Viterbo', 'Belén', 'Paz de Río', 'Socha', 'Sogamoso', 'Paipa', 'Tunja', 'Tuta', 'Siachoque', 'Nuevo Colón', 'Motavita', 'Sotaquirá'].map((city, i) => (
                      <Reveal key={i} direction="up" delay={150 + i * 40}>
                        <div className="hover-lift" style={{
                          padding: 'clamp(7px,1.5vw,10px) clamp(12px,2vw,18px)', borderRadius: 12,
                          background: 'white',
                          border: '1px solid rgba(26,127,232,0.10)',
                          boxShadow: '0 2px 12px rgba(26,127,232,0.04)',
                          cursor: 'default',
                          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        }}>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(11px,1.2vw,13px)', fontWeight: 600, color: '#374151', margin: 0, whiteSpace: 'nowrap' }}>{city}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>

                  {/* Stat de cobertura */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,3vw,20px)', marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(26,127,232,0.06)', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, color: '#1A7FE8', lineHeight: 1 }}>
                        <AnimatedCounter end={12} suffix="+" />
                      </div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', margin: '4px 0 0' }}>Municipios</p>
                    </div>
                    <div style={{ width: 1, height: 40, background: 'rgba(26,127,232,0.08)' }} />
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, color: '#0057B8', lineHeight: 1 }}>
                        <AnimatedCounter end={4} suffix="" />
                      </div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', margin: '4px 0 0' }}>Modalidades</p>
                    </div>
                    <div style={{ width: 1, height: 40, background: 'rgba(26,127,232,0.08)' }} />
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, color: '#1A7FE8', lineHeight: 1 }}>
                        <AnimatedCounter end={2} suffix="" />
                      </div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', margin: '4px 0 0' }}>Estaciones</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent 5%, rgba(26,127,232,0.12) 50%, transparent 95%)' }} />
      </section>


      {/* ════════════════════════════════════════════
          DIVISOR · IMAGEN CINEMATOGRÁFICA DEL BUS
          — mismo patrón exacto que "Moviendo a Boyacá"
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(320px, 45vh, 520px)', background: '#000' }}>
        {/* 1 · En desktop: parallax fixed. En móvil/iOS: img normal (Safari ignora fixed) */}
        {isTouch ? (
          <img
            src="/soata.webp"
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
          <div className="parallax-bg" style={{
            position: 'absolute', inset: 0,
            backgroundImage: "url('/soata.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 55%',
            backgroundAttachment: 'fixed',
          }} />
        )}

        {/* 2 · Overlay radial central para legibilidad del texto */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(2,8,20,0.55) 0%, rgba(2,8,20,0.30) 60%, rgba(2,8,20,0.15) 100%)' }} />

        {/* 3 · Fusión TOP: la sección anterior es oscura (#020A18) */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #020A18 0%, transparent 14%)' }} />

        {/* 4 · Fusión BOTTOM: la sección siguiente es oscura (#030814) */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #030814 0%, transparent 14%)' }} />

        {/* 5 · Texto centrado */}
        <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
          <Reveal>
            <div style={{ textAlign: 'center', padding: '0 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.5))' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.55em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>Lo que nos define</span>
                <div style={{ width: 40, height: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.5))' }} />
              </div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.6rem, 6.5vw, 5.2rem)', fontWeight: 800,
                color: 'white', lineHeight: 1.0, margin: '0 0 12px',
                letterSpacing: '-0.02em',
                textShadow: '0 4px 40px rgba(0,0,0,0.6)',
              }}>
                Valores &{' '}
                <em className="corporate-shimmer-boyaca" style={{ fontStyle: 'italic' }}>Principios</em>
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(13px, 1.4vw, 16px)',
                fontWeight: 400, color: 'rgba(255,255,255,0.7)', margin: 0,
                letterSpacing: '0.02em', textShadow: '0 2px 12px rgba(0,0,0,0.7)',
              }}>
                Seis décadas de excelencia, cooperativismo y compromiso con Boyacá
              </p>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          SECCIÓN · VALORES — Fondo blanco + carro flotante + 4 tarjetas
      ════════════════════════════════════════════ */}

      <section style={{ background: 'linear-gradient(180deg, #f0f6ff 0%, #ffffff 35%, #f8faff 100%)', paddingTop: '5.5rem', paddingBottom: '6.5rem', position: 'relative', overflow: 'hidden' }}>

        {/* Decoración fondo suave */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,127,232,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="max-w-[1340px] mx-auto px-6" style={{ position: 'relative', zIndex: 2 }}>

          {/* ── Encabezado ── */}
          <Reveal direction="up">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', borderRadius: 40, background: 'rgba(26,127,232,0.08)', border: '1px solid rgba(26,127,232,0.18)', marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A7FE8', boxShadow: '0 0 8px rgba(26,127,232,0.6)' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#1A7FE8' }}>NUESTROS VALORES</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 800, color: '#0a1628', lineHeight: 1.1, margin: 0 }}>
                Lo que nos define{' '}<em style={{ color: '#1A7FE8', fontStyle: 'italic' }}>desde 1964</em>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#64748b', maxWidth: 520, margin: '14px auto 0', lineHeight: 1.7 }}>
                Más de seis décadas construyendo un servicio de transporte fundamentado en principios sólidos que no cambian con el tiempo.
              </p>
            </div>
          </Reveal>

          {/* ── Layout principal ── */}
          <div className="valores-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', gap: '4rem', alignItems: 'center' }}>

            {/* ══ COLUMNA IZQUIERDA: Flota profesional ══ */}
            <Reveal direction="right">
              <div style={{ position: 'relative' }}>

                {/* ── Tarjeta sin fondo, carros centrados ── */}
                <div style={{ borderRadius: 28, background: 'transparent', border: 'none', boxShadow: 'none', overflow: 'visible', position: 'relative' }}>

                  {/* Header de la tarjeta */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px 16px', position: 'relative', zIndex: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 40, background: 'white', border: '1px solid rgba(26,127,232,0.20)', boxShadow: '0 2px 12px rgba(26,127,232,0.10)' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1A7FE8', boxShadow: '0 0 7px rgba(26,127,232,0.7)' }} />
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: '#1A7FE8' }}>COOFLOTAX · DUITAMA</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['ISO 9001', 'OHSAS'].map((t, i) => (
                        <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', color: '#0057B8', background: 'white', border: '1px solid rgba(26,127,232,0.22)', padding: '4px 9px', borderRadius: 7, boxShadow: '0 2px 8px rgba(26,127,232,0.08)' }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Contenedor de los DOS carros */}
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: 380, gap: 0 }}>

                    {/* Glow global */}
                    <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: 28, borderRadius: '50%', background: 'rgba(26,127,232,0.18)', filter: 'blur(20px)', animation: 'glowBreath 5s ease-in-out infinite' }} />
                    {/* Sombra suelo BUS */}
                    <div style={{ position: 'absolute', bottom: 2, left: '10%', width: '36%', height: 14, borderRadius: '50%', background: 'rgba(10,30,80,0.22)', filter: 'blur(10px)', animation: 'shadowBreath 5s ease-in-out infinite' }} />
                    {/* Sombra suelo TAXI */}
                    <div style={{ position: 'absolute', bottom: 2, right: '8%', width: '38%', height: 16, borderRadius: '50%', background: 'rgba(10,30,80,0.28)', filter: 'blur(12px)', animation: 'shadowBreath 5s 0.8s ease-in-out infinite' }} />

                    {/* ══ BUS ══ */}
                    <div style={{ position: 'relative', width: '50%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'carBreath 5s ease-in-out infinite', zIndex: 3, flexShrink: 0 }}>
                      {/* Reflejo BUS */}
                      <img src="/Flota.webp" alt="" aria-hidden="true" loading="lazy" style={{
                        position: 'absolute', bottom: -4, left: '50%',
                        transform: 'translateX(-62%) scale(2.1) scaleY(-0.28)',
                        transformOrigin: 'bottom center',
                        width: 300, height: 300,
                        objectFit: 'contain', objectPosition: 'bottom center',
                        opacity: 0.35, filter: 'blur(3px)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 85%)',
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 85%)',
                        pointerEvents: 'none', zIndex: 2,
                      }} />
                      <img src="/Flota.webp" alt="Flota Cooflotax" loading="lazy" style={{
                        width: 300, height: 300,
                        objectFit: 'contain', objectPosition: 'bottom center',
                        display: 'block',
                        transform: 'scale(2.1)', transformOrigin: 'bottom center',
                        filter: 'drop-shadow(0 20px 32px rgba(10,30,90,0.32)) drop-shadow(0 8px 14px rgba(10,30,90,0.22)) drop-shadow(0 2px 5px rgba(10,30,90,0.14))',
                        position: 'relative', zIndex: 3,
                      }} />
                    </div>

                    {/* ══ TAXI ══ */}
                    <div style={{ position: 'relative', width: '50%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'carBreath 5s 0.8s ease-in-out infinite', zIndex: 3, flexShrink: 0 }}>
                      {/* Reflejo TAXI */}
                      <img src="/Taxi.webp" alt="" aria-hidden="true" loading="lazy" style={{
                        position: 'absolute', bottom: -4, left: '50%',
                        transform: 'translateX(-38%) scaleY(-0.28)',
                        transformOrigin: 'bottom center',
                        width: 300, height: 300,
                        objectFit: 'contain', objectPosition: 'bottom center',
                        opacity: 0.35, filter: 'blur(3px)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 85%)',
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 85%)',
                        pointerEvents: 'none', zIndex: 2,
                      }} />
                      <img src="/Taxi.webp" alt="Taxi Cooflotax" loading="lazy" style={{
                        width: 300, height: 300,
                        objectFit: 'contain', objectPosition: 'bottom center',
                        display: 'block',
                        filter: 'drop-shadow(0 20px 32px rgba(10,30,90,0.32)) drop-shadow(0 8px 14px rgba(10,30,90,0.22)) drop-shadow(0 2px 5px rgba(10,30,90,0.14))',
                        position: 'relative', zIndex: 3,
                      }} />
                    </div>

                  </div>
                </div>

                {/* ── Stats debajo — diseño premium ── */}
                <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'white', borderRadius: 20, border: '1px solid rgba(26,127,232,0.10)', boxShadow: '0 4px 32px rgba(26,127,232,0.10), 0 1px 4px rgba(26,127,232,0.05)', overflow: 'hidden' }}>
                  {[
                    { n: '+60', label: 'Años de servicio', sub: 'Fundados en 1964', icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
                    { n: '380', label: 'Conductores',      sub: 'Certificados ISO',  icon: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z' },
                    { n: '450', label: 'Familias',         sub: 'Cooperadas',        icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center', padding: '20px 10px 18px', borderRight: i < 2 ? '1px solid rgba(26,127,232,0.08)' : 'none', position: 'relative', background: i === 1 ? 'linear-gradient(180deg, rgba(26,127,232,0.03) 0%, white 100%)' : 'white' }}>
                      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 32, height: 3, background: 'linear-gradient(to right, #1A7FE8, #60B5FF)', borderRadius: '0 0 6px 6px' }} />
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(26,127,232,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#1A7FE8" strokeWidth={1.8}><path d={s.icon} /></svg>
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.3rem', fontWeight: 900, color: '#1A7FE8', lineHeight: 1 }}>{s.n}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#1e3a5f', marginTop: 5 }}>{s.label}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

              </div>
            </Reveal>

            {/* ══ COLUMNA DERECHA: 4 tarjetas — solo azules ══ */}
            <div className="valores-cards-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {[
                {
                  icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
                  title: 'Seguridad',
                  tag: 'ISO · OHSAS',
                  desc: 'Operamos bajo los más altos estándares internacionales de seguridad vial y ocupacional, respaldados por las certificaciones OHSAS 18001:2007 e ISO 9001:2015.',
                  bullets: ['Mantenimiento preventivo certificado', 'Capacitación continua a conductores', 'Monitoreo GPS en tiempo real'],
                  accent: '#1A7FE8', iconBg: 'rgba(26,127,232,0.09)', tagBg: 'rgba(26,127,232,0.08)', tagColor: '#1A7FE8',
                },
                {
                  icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
                  title: 'Calidez Humana',
                  tag: 'Servicio · Dignidad',
                  desc: 'La dignidad humana y la atención al cliente son la columna vertebral de cada interacción. Tratamos a cada pasajero como parte de nuestra familia cooperativa.',
                  bullets: ['Atención personalizada en ruta', 'Respeto y empatía garantizados', 'Pasajeros vulnerables prioritarios'],
                  accent: '#0057B8', iconBg: 'rgba(0,87,184,0.09)', tagBg: 'rgba(0,87,184,0.08)', tagColor: '#0057B8',
                },
                {
                  icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
                  title: 'Cooperativismo',
                  tag: '450 Familias',
                  desc: 'Somos una familia cooperativa que trabaja unida por el bienestar de todos. Más de 450 familias boyacenses dependen y confían en nuestra cooperativa desde hace décadas.',
                  bullets: ['Distribución equitativa de beneficios', 'Decisiones democráticas', 'Apoyo social a asociados'],
                  accent: '#0284C7', iconBg: 'rgba(2,132,199,0.09)', tagBg: 'rgba(2,132,199,0.08)', tagColor: '#0284C7',
                },
                {
                  icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
                  title: 'Innovación',
                  tag: 'Tecnología · Futuro',
                  desc: 'Apostamos por la modernización tecnológica y la movilidad sostenible. Integramos soluciones digitales para mejorar la experiencia de cada viaje en la región boyacense.',
                  bullets: ['Flota con tecnología de bajo consumo', 'Plataforma digital de servicios', 'Plan de transición a movilidad verde'],
                  accent: '#1e40af', iconBg: 'rgba(30,64,175,0.09)', tagBg: 'rgba(30,64,175,0.08)', tagColor: '#1e40af',
                },
              ].map((v, i) => (
                <Reveal key={i} direction="up" delay={i * 80}>
                  <div
                    className="val-card-blue"
                    style={{
                      borderRadius: 20, overflow: 'hidden',
                      background: 'white',
                      border: `1px solid ${v.accent}18`,
                      boxShadow: '0 4px 20px rgba(15,40,90,0.07), 0 1px 4px rgba(15,40,90,0.04)',
                      height: '100%',
                    }}
                  >
                    {/* Franja color */}
                    <div style={{ height: 4, background: `linear-gradient(to right, ${v.accent}, ${v.accent}55)` }} />

                    <div style={{ padding: '22px 22px 26px' }}>

                      {/* Icon + tag */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div
                          className="val-icon-blue"
                          style={{
                            width: 50, height: 50, borderRadius: 14,
                            background: v.iconBg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={v.accent} strokeWidth={1.8}><path d={v.icon} /></svg>
                        </div>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
                          letterSpacing: '0.11em', textTransform: 'uppercase',
                          color: v.tagColor, background: v.tagBg,
                          padding: '5px 11px', borderRadius: 20,
                        }}>
                          {v.tag}
                        </span>
                      </div>

                      {/* Título */}
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: 7, lineHeight: 1.2 }}>{v.title}</h3>
                      <div className="val-bar-blue" style={{ width: 28, height: 3, background: v.accent, borderRadius: 2, marginBottom: 14, transition: 'width 0.4s ease' }} />

                      {/* Descripción */}
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, lineHeight: 1.85, color: '#475569', margin: '0 0 16px 0' }}>{v.desc}</p>

                      {/* Separador */}
                      <div style={{ height: 1, background: `${v.accent}12`, marginBottom: 14 }} />

                      {/* Bullets */}
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                        {v.bullets.map((b, bi) => (
                          <li key={bi} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <div style={{ width: 18, height: 18, borderRadius: 6, background: v.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                              <svg width={10} height={10} viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke={v.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          SECCIÓN · CTA FINAL — Fondo blanco, mapa grande, tarjetas mejoradas
      ════════════════════════════════════════════ */}

      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F8FF 40%, #EEF4FF 100%)',
        paddingTop: 'clamp(80px, 11vh, 130px)',
        paddingBottom: 'clamp(80px, 11vh, 130px)',
      }}>

        {/* Decoración fondo suave */}
        <div style={{ position: 'absolute', top: '-10%', right: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,127,232,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,87,184,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Grid de puntos sutil */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.018 }}>
          <defs>
            <pattern id="ctaDotGrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.2" fill="#0057B8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ctaDotGrid)" />
        </svg>

        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent 5%, rgba(26,127,232,0.18) 50%, transparent 95%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">

          {/* ── Encabezado centrado ── */}
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vh, 72px)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', borderRadius: 40, background: 'rgba(26,127,232,0.07)', border: '1px solid rgba(26,127,232,0.18)', marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A7FE8', animation: 'pulseGlow 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#0057B8' }}>Cooflotax · Duitama · Est. 1964</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)', fontWeight: 800, color: '#0A1628', lineHeight: 1.0, margin: '0 0 18px', letterSpacing: '-0.02em' }}>
                60 años{' '}
                <em style={{ color: '#1A7FE8', fontStyle: 'italic' }}>conectando</em>{' '}
                a Boyacá
              </h2>
              <div style={{ width: 56, height: 2.5, background: 'linear-gradient(to right, transparent, #1A7FE8, transparent)', margin: '0 auto 20px', borderRadius: 2 }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(15px, 1.6vw, 17px)', fontWeight: 400, lineHeight: 1.85, color: '#64748B', maxWidth: 560, margin: '0 auto' }}>
                Un legado de tradición, cooperativismo y servicio que sigue creciendo con cada ruta, cada conductor y cada familia que confía en nosotros.
              </p>
            </div>
          </Reveal>

          {/* ── Layout: Texto izquierda + Mapa derecha ── */}
          <div className="cta-layout-grid !grid-cols-1 lg:!grid-cols-[1fr_1.45fr]" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.45fr)', gap: 'clamp(28px, 4vw, 52px)', alignItems: 'stretch' }}
          >

            {/* ── Columna izquierda: CTA info ── */}
            <Reveal direction="right">
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* ── Tarjeta principal ── */}
                <div style={{
                  padding: '32px 30px 28px',
                  borderRadius: 22, background: 'white',
                  border: '1px solid rgba(26,127,232,0.10)',
                  boxShadow: '0 8px 40px rgba(10,22,40,0.07)',
                  flex: 1, display: 'flex', flexDirection: 'column',
                }}>
                  {/* Indicador activo */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.70)', display: 'inline-block', animation: 'activePulse 2s ease-in-out infinite', flexShrink: 0 }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 600, color: '#22c55e', letterSpacing: '0.03em' }}>Servicio activo · Duitama, Boyacá</span>
                  </div>

                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.7rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#0A1628', lineHeight: 1.1, margin: '0 0 10px' }}>
                    Tu cooperativa de<br />transporte en Boyacá
                  </h3>
                  <div style={{ width: 36, height: 2.5, background: '#1A7FE8', borderRadius: 2, marginBottom: 14 }} />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, lineHeight: 1.85, color: '#64748B', margin: '0 0 22px' }}>
                    Conectamos municipios boyacenses con puntualidad, seguridad y calidez humana desde 1964. Certificados en ISO 9001:2015 y OHSAS 18001:2007.
                  </p>

                  {/* Sedes — tarjetas mejoradas */}
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#94A3B8', margin: '0 0 10px' }}>Nuestras sedes</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>

                    {/* Sede principal */}
                    <a href="https://maps.google.com/?q=Cra.+18+N+23-30,+Duitama,+Boyaca" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <div className="cta-dest-chip" style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px', borderRadius: 16,
                        background: 'white',
                        border: '1.5px solid rgba(26,127,232,0.18)',
                        boxShadow: '0 2px 12px rgba(26,127,232,0.07)',
                        cursor: 'pointer', transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                      }}>
                        {/* Ícono */}
                        <div style={{
                          width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                          background: 'linear-gradient(135deg, #1A7FE8, #0057B8)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(26,127,232,0.30)',
                        }}>
                          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 700, color: '#0A1628' }}>Sede Principal</span>
                            <span style={{
                              padding: '2px 9px', borderRadius: 20,
                              background: 'rgba(26,127,232,0.08)',
                              fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
                              color: '#1A7FE8', letterSpacing: '0.02em',
                            }}>Principal</span>
                          </div>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>Cra. 18 N° 23-30, Duitama, Boyacá</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#1A7FE8" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: '#1A7FE8' }}>7622222</span>
                          </div>
                        </div>
                        {/* Arrow */}
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </div>
                    </a>

                    {/* Terminal de Transporte */}
                    <a href="https://www.google.com/maps/place/Nuevo+Terminal+de+Transporte+Duitama/@5.8097732,-73.033057,15z/data=!4m10!1m2!2m1!1sCll+5+36B+140+Villa+Rouse+Duitama+Boyaca!3m6!1s0x8e6a3f7da45c039f:0x5b64aae1dd11b57d!8m2!3d5.8075201!4d-73.0321886!15sCihDbGwgNSAzNkIgMTQwIFZpbGxhIFJvdXNlIER1aXRhbWEgQm95YWNhWioiKGNsbCA1IDM2YiAxNDAgdmlsbGEgcm91c2UgZHVpdGFtYSBib3lhY2GSARZ0cmFuc3BvcnRhdGlvbl9zZXJ2aWNlmgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVU10YkdJeVJYQm5SUkFC4AEA-gEECAAQQw!16s%2Fg%2F11bwypcly0?entry=ttu&g_ep=EgoyMDI2MDMyMy4xIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <div className="cta-dest-chip" style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px', borderRadius: 16,
                        background: 'white',
                        border: '1.5px solid rgba(0,87,184,0.15)',
                        boxShadow: '0 2px 12px rgba(0,87,184,0.06)',
                        cursor: 'pointer', transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                      }}>
                        {/* Ícono */}
                        <div style={{
                          width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                          background: 'linear-gradient(135deg, #0284C7, #0057B8)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0,87,184,0.28)',
                        }}>
                          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                          </svg>
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 700, color: '#0A1628' }}>Terminal de Transporte</span>
                            <span style={{
                              padding: '2px 9px', borderRadius: 20,
                              background: 'rgba(0,87,184,0.08)',
                              fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
                              color: '#0057B8', letterSpacing: '0.02em',
                            }}>Terminal</span>
                          </div>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>Cll 5 36B 140 · Villa Rouse, Duitama</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#0057B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#0057B8', fontWeight: 500 }}>Lun – Dom · 5:00 AM – 10:00 PM</span>
                          </div>
                        </div>
                        {/* Arrow */}
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </div>
                    </a>
                  </div>

                  {/* Botones CTA */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 'auto' }}>
                    <MagneticButton
                      href="/rutas"
                      className="cta-btn-primary"
                      style={{
                        padding: '14px 28px', borderRadius: 40,
                        background: 'linear-gradient(135deg, #1A7FE8, #0057B8)',
                        color: 'white', fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                        fontSize: 14, letterSpacing: '0.03em', textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        boxShadow: '0 10px 36px rgba(26,127,232,0.38)',
                      }}
                    >
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 11l19-9-9 19-2-8-8-2z" />
                      </svg>
                      Ver Rutas →
                    </MagneticButton>
                    <MagneticButton
                      href="/servicios"
                      className="cta-btn-secondary"
                      style={{
                        padding: '14px 22px', borderRadius: 40,
                        background: 'white',
                        border: '1.5px solid rgba(26,127,232,0.22)',
                        color: '#0A1628', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                        fontSize: 14, textDecoration: 'none', display: 'inline-block',
                        boxShadow: '0 4px 14px rgba(26,127,232,0.07)',
                      }}
                    >
                      Servicios
                    </MagneticButton>
                    <MagneticButton
                      href="/contacto"
                      className="cta-btn-secondary"
                      style={{
                        padding: '14px 22px', borderRadius: 40,
                        background: 'white',
                        border: '1.5px solid rgba(10,22,40,0.09)',
                        color: '#64748B', fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                        fontSize: 14, textDecoration: 'none', display: 'inline-block',
                      }}
                    >
                      Contacto
                    </MagneticButton>
                  </div>
                </div>

                {/* ── Tarjeta de certificaciones ── */}
                <div style={{
                  padding: '18px 22px',
                  borderRadius: 16, background: 'linear-gradient(135deg, #0057B8 0%, #1A7FE8 100%)',
                  boxShadow: '0 10px 32px rgba(26,127,232,0.28)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', margin: '0 0 7px' }}>Certificaciones</p>
                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        {['ISO 9001:2015', 'OHSAS 18001:2007'].map((c) => (
                          <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: 'white' }}>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)' }}>
                      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: 'white' }}>Calidad garantizada</span>
                    </div>
                  </div>
                </div>

              </div>
            </Reveal>

            {/* ── Columna derecha: Mapa grande ── */}
            <Reveal direction="left" delay={150}>
              <div className="cta-map-card" style={{
                borderRadius: 24, overflow: 'hidden',
                border: '1px solid rgba(26,127,232,0.14)',
                background: 'white',
                height: '100%',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(10,22,40,0.10)',
              }}>

                {/* Header del mapa — igual a la imagen */}
                <div style={{
                  padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'white',
                  borderBottom: '1px solid rgba(26,127,232,0.08)',
                  flexShrink: 0,
                }}>
                  {/* Pin icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, #1A7FE8, #0057B8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(26,127,232,0.28)',
                  }}>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  {/* Título */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 700, color: '#0A1628', margin: 0, lineHeight: 1.2 }}>Sede Central Cooflotax</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#94A3B8', margin: 0 }}>Terminal de Transportes · Duitama, Boyacá</p>
                  </div>
                  {/* Badge activo */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)', flexShrink: 0 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'activePulse 2s ease-in-out infinite' }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: '#16a34a' }}>Activo</span>
                  </div>
                </div>

                {/* Mapa con overlay de "Abrir en Maps" */}
                <div className="mapa-minheight" style={{ position: 'relative', flex: 1, minHeight: 400 }}>
                  <iframe
                    title="Cooflotax Duitama"
                    src="https://maps.google.com/maps?q=Cooflotax+Duitama+Boyaca+Colombia&z=13&output=embed"
                    width="100%"
                    height="100%"
                    style={{ display: 'block', border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  {/* Botón flotante "Abrir en Maps" sobre el iframe */}
                  <a
                    href="https://maps.google.com/?q=Cooflotax+Duitama+Boyaca+Colombia"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      position: 'absolute', top: 12, left: 12, zIndex: 10,
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 20,
                      background: 'white',
                      border: '1px solid rgba(26,127,232,0.20)',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                      color: '#1A7FE8', textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                    }}
                  >
                    Abrir en Maps
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>

                {/* Footer del mapa */}
                <div style={{
                  padding: '13px 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  background: 'white',
                  borderTop: '1px solid rgba(26,127,232,0.08)',
                  flexShrink: 0, flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#1A7FE8" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 600, color: '#374151' }}>Cra. 18 N° 23-30 · Cll 5 36B 140, Duitama</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 17 }}>
                      <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#94A3B8' }}>Lun – Dom · 5:00 AM – 10:00 PM</span>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Cooflotax+Duitama+Boyaca+Colombia"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '10px 20px', borderRadius: 22,
                      background: 'linear-gradient(135deg, #1A7FE8, #0057B8)',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 700,
                      color: 'white', textDecoration: 'none',
                      boxShadow: '0 6px 18px rgba(26,127,232,0.30)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    Cómo llegar
                  </a>
                </div>
              </div>
            </Reveal>

          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent 5%, rgba(26,127,232,0.14) 50%, transparent 95%)' }} />
      </section>

    </main>
  );
}