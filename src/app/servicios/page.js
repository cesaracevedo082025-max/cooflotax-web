'use client';

import Link from 'next/link';
import Image from 'next/image';

// ── Datos estáticos fuera del componente para evitar recreación en cada render ──
const servicios = [
  {
    id: 'intermunicipal',
    image: '/Flota.webp',
    tag: 'Más solicitado',
    title: 'Transporte Intermunicipal',
    subtitle: 'Conectando los municipios de Boyacá',
    desc: 'Cubrimos las principales rutas entre los municipios del departamento con salidas frecuentes, vehículos modernos y conductores certificados. Más de 24 rutas activas desde Duitama, Sogamoso y Tunja.',
    features: [
      'Salidas desde Duitama, Sogamoso y Tunja',
      'Más de 24 rutas a municipios de Boyacá',
      'Vehículos con seguro de pasajeros',
      'Conductores con licencia profesional',
      'Frecuencias desde cada 8 minutos',
      'Tarifas desde $3.000',
    ],
    stats: [
      { val: '24+', label: 'Rutas' },
      { val: '3', label: 'Ciudades' },
      { val: '8 min', label: 'Frecuencia' },
    ],
    accent: '#1A7FE8',
  },
  {
    id: 'taxi',
    image: '/Taxi.webp',
    tag: '24 horas',
    title: 'Taxi Municipal',
    subtitle: 'Servicio urbano en Duitama',
    desc: 'Flota de taxis disponible las 24 horas del día, los 7 días de la semana en Duitama. Tarifas reguladas y conductores identificados para tu seguridad.',
    features: [
      'Disponibilidad 24 horas, 7 días',
      'Conductores con identificación visible',
      'Servicio a domicilio',
      'Cobertura en todo Duitama',
      'Solicitud por teléfono o en calle',
    ],
    stats: [
      { val: '24/7', label: 'Disponible' },
      { val: '100%', label: 'Duitama' },
      { val: '310', label: 'Línea' },
    ],
    accent: '#D97706',
  },
];

// SVGs separados para evitar JSX inline en el array de datos
const IconoBus = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconoTaxi = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="8" rx="2"/><path d="M6 11V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/><line x1="3" y1="15" x2="21" y2="15"/></svg>;
const iconos = { intermunicipal: IconoBus, taxi: IconoTaxi };

export default function Servicios() {

  return (
    <main style={{ fontFamily: "var(--font-dm-sans-alias)", background: '#fff', color: '#0F172A' }}>
      {/* Fuentes cargadas globalmente desde layout.js via next/font */}

      <style dangerouslySetInnerHTML={{ __html: `
/* Aliases para que los font-family del CSS sigan funcionando
   usando las fuentes ya cargadas por next/font en layout.js */
:root {
  --font-dm-sans-alias: var(--font-dm-sans, 'DM Sans', sans-serif);
  --font-cormorant-alias: var(--font-cormorant, 'Cormorant Garamond', serif);
  --font-jetbrains-alias: var(--font-jetbrains, 'JetBrains Mono', monospace);
  --font-instrument-alias: var(--font-instrument, 'Instrument Serif', serif);
  --font-anybody-alias: var(--font-anybody, 'Anybody', sans-serif);
}

:root{--blue:#1A7FE8;--blue-dim:#0057B8;--sky:#5DB8FF;--navy:#0A1628;--g50:#F8FAFD;--g100:#F0F4FA;--g200:#E2E8F2;--g300:#CBD5E1;--g400:#94A3B8;--g500:#64748B;--g600:#475569;--g700:#334155;--g800:#1E293B;--g900:#0F172A;--green:#059669;--amber:#D97706;--ease:cubic-bezier(0.16,1,0.3,1)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* HERO */
.sv-hero{display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:clamp(140px,16vh,180px) 0 clamp(60px,8vh,90px);color:white;text-align:center}
.sv-hero-media{position:absolute;inset:0;z-index:0}
.sv-hero-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(2,10,20,0.88) 0%,rgba(10,22,40,0.75) 50%,rgba(10,22,40,0.92) 100%)}
.sv-hero-grain{position:absolute;inset:0;z-index:2;background-image:radial-gradient(circle,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
.sv-hero-glow{position:absolute;inset:0;z-index:2;background:radial-gradient(ellipse 50% 50% at 50% 50%,rgba(26,127,232,0.06) 0%,transparent 70%);pointer-events:none}
.sv-wrap{max-width:1400px;margin:0 auto;padding:0 clamp(28px,6vw,72px);position:relative;z-index:3}
.sv-eyebrow{display:inline-flex;align-items:center;gap:10px;padding:6px 18px 6px 14px;border-radius:100px;background:rgba(26,127,232,0.12);border:1px solid rgba(93,184,255,0.15);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);margin-bottom:28px}
.sv-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:#5DB8FF;box-shadow:0 0 8px rgba(93,184,255,0.5);animation:svP 2.5s ease infinite;flex-shrink:0}
@keyframes svP{0%,100%{opacity:1}50%{opacity:.35}}
.sv-eyebrow-text{font-family:var(--font-jetbrains-alias);font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#5DB8FF}
.sv-h1{font-family:var(--font-cormorant-alias);font-size:clamp(2.8rem,7vw,5.2rem);font-weight:700;color:white;line-height:1.08;letter-spacing:-.025em;margin:0 0 18px;text-shadow:0 4px 30px rgba(0,0,0,0.6)}
.sv-h1 em{font-style:italic;color:var(--sky);-webkit-text-fill-color:var(--sky);text-shadow:0 2px 20px rgba(93,184,255,0.3)}
.sv-hero-desc{font-size:clamp(14px,1.5vw,16px);color:rgba(255,255,255,0.50);line-height:1.85;max-width:540px;margin:0 auto}
.sv-hero-pills{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:32px}
.sv-hero-pill{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:100px;background:rgba(26,127,232,0.10);border:1px solid rgba(26,127,232,0.20);color:rgba(255,255,255,0.8);font-size:13px;font-weight:600;text-decoration:none;transition:all .25s var(--ease)}
.sv-hero-pill:hover{background:rgba(26,127,232,0.20);border-color:rgba(26,127,232,0.40);color:white}

/* PROCESS */
.sv-process{padding:clamp(48px,6vh,72px) 0;background:white;border-bottom:1px solid var(--g200)}
.sv-process-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;max-width:900px;margin:0 auto}
@media(max-width:640px){.sv-process-grid{grid-template-columns:repeat(2,1fr);gap:16px}}
.sv-step{text-align:center;padding:20px 16px;position:relative}
.sv-step-num{width:52px;height:52px;border-radius:50%;margin:0 auto 14px;background:rgba(26,127,232,0.06);border:1.5px solid rgba(26,127,232,0.15);display:flex;align-items:center;justify-content:center;font-family:var(--font-anybody-alias);font-size:16px;font-weight:900;color:var(--blue)}
.sv-step-title{font-weight:700;color:var(--g900);font-size:14px;margin-bottom:4px}
.sv-step-sub{font-size:12px;color:var(--g400);line-height:1.5}
.sv-step-arrow{position:absolute;right:-10px;top:38px;color:rgba(26,127,232,0.2);font-size:18px}
@media(max-width:640px){.sv-step-arrow{display:none}}

/* STAG */
.sv-stag{display:inline-flex;align-items:center;gap:10px;margin-bottom:18px}
.sv-stag-line{width:28px;height:1.5px;background:var(--blue)}
.sv-stag-text{font-family:var(--font-jetbrains-alias);font-size:9px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--blue)}

/* SERVICE CARDS — large editorial layout */
.sv-services{padding:clamp(60px,8vh,100px) 0;background:var(--g50)}
.sv-card{display:grid;grid-template-columns:1fr 1fr;background:white;border:1px solid var(--g200);border-radius:20px;overflow:hidden;transition:all .4s var(--ease)}
.sv-card:hover{border-color:rgba(26,127,232,0.18);box-shadow:0 24px 64px rgba(26,127,232,0.08);transform:translateY(-4px)}
@media(max-width:900px){.sv-card{grid-template-columns:1fr}}

.sv-card-visual{display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;min-height:380px}
.sv-card-photo{position:absolute;inset:0;z-index:0}
/* La transición de zoom al hover se maneja aquí */
.sv-card-photo img{object-fit:cover;object-position:center;transition:transform 1.2s cubic-bezier(0.16,1,0.3,1)}
.sv-card:hover .sv-card-photo img{transform:scale(1.06)}
.sv-card-photo-overlay{position:absolute;inset:0;z-index:1}
.sv-card-photo::after{content:'';position:absolute;inset:0;z-index:2;background-image:radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px);background-size:32px 32px;pointer-events:none}
.sv-card-visual-content{position:relative;z-index:3;padding:clamp(36px,5vw,56px);display:flex;flex-direction:column;justify-content:space-between;height:100%}
.sv-card-icon{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;border:1px solid rgba(255,255,255,0.15);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.sv-card-tag{display:inline-flex;padding:5px 16px;border-radius:100px;font-family:var(--font-jetbrains-alias);font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:18px;width:fit-content;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.sv-card-title{font-family:var(--font-instrument-alias);font-size:clamp(2rem,3.5vw,2.8rem);font-style:italic;color:white;line-height:1.08;margin-bottom:8px;text-shadow:0 2px 20px rgba(0,0,0,0.4)}
.sv-card-subtitle{font-size:13px;color:rgba(255,255,255,0.55);margin-bottom:24px;text-shadow:0 1px 8px rgba(0,0,0,0.3)}
.sv-card-stats{display:flex;gap:0;border-top:1px solid rgba(255,255,255,0.10);background:rgba(0,0,0,0.18);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.sv-card-stat{flex:1;padding:18px 0;text-align:center;border-right:1px solid rgba(255,255,255,0.08)}
.sv-card-stat:last-child{border-right:none}
.sv-card-stat-val{font-family:var(--font-anybody-alias);font-size:22px;font-weight:900;color:white;display:block;line-height:1;text-shadow:0 1px 10px rgba(0,0,0,0.3)}
.sv-card-stat-lbl{font-family:var(--font-jetbrains-alias);font-size:8px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.40);margin-top:5px;display:block}

.sv-card-content{padding:clamp(36px,5vw,56px);display:flex;flex-direction:column;justify-content:center}
.sv-card-desc{font-size:15px;line-height:1.85;color:var(--g500);margin-bottom:28px}
.sv-card-features{display:flex;flex-direction:column;gap:0;border-top:1px solid var(--g200);padding-top:20px}
.sv-feature{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--g100);font-size:14px;color:var(--g600);transition:color .2s ease}
.sv-card:hover .sv-feature{color:var(--g700)}
.sv-feature:last-child{border-bottom:none}
.sv-feature-check{width:22px;height:22px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .2s ease}
.sv-card:hover .sv-feature-check{transform:scale(1.1)}
.sv-card-cta{display:inline-flex;align-items:center;justify-content:center;gap:10px;margin-top:28px;padding:15px 32px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;transition:all .25s var(--ease);border:none;cursor:pointer;width:100%}
.sv-card-cta:hover{transform:translateY(-2px)}

/* CTA */
.sv-cta{padding:clamp(64px,9vh,100px) 0;background:linear-gradient(170deg,#020A14,var(--navy));color:white;text-align:center;position:relative;overflow:hidden}
.sv-cta-glow{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(26,127,232,0.06) 0%,transparent 70%);pointer-events:none}
.sv-cta-title{font-family:var(--font-cormorant-alias);font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:700;color:white;margin-bottom:14px}
.sv-cta-desc{color:rgba(255,255,255,0.45);font-size:15px;max-width:480px;margin:0 auto 36px;line-height:1.8}
.sv-cta-btns{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.sv-btn-solid{display:inline-flex;align-items:center;gap:9px;padding:14px 28px;border-radius:10px;background:var(--blue);color:white;font-weight:700;font-size:14px;text-decoration:none;transition:all .2s var(--ease);box-shadow:0 4px 16px rgba(26,127,232,0.18)}
.sv-btn-solid:hover{box-shadow:0 6px 28px rgba(26,127,232,0.35);transform:translateY(-2px)}
.sv-btn-ghost{display:inline-flex;align-items:center;gap:9px;padding:14px 26px;border-radius:10px;border:1px solid rgba(255,255,255,0.10);color:white;font-weight:600;font-size:14px;text-decoration:none;transition:all .2s var(--ease)}
.sv-btn-ghost:hover{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.18)}

.sv-fade{animation:svFade .5s var(--ease) both}
@keyframes svFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

/* Touch devices: disable expensive hover effects */
@media(hover:none){
  .sv-card:hover{transform:none;box-shadow:none;border-color:var(--g200)}
  .sv-card:hover .sv-card-photo img{transform:none}
  .sv-card:hover .sv-feature{color:var(--g600)}
  .sv-card:hover .sv-feature-check{transform:none}
  .sv-card-cta:hover{transform:none}
  .sv-hero-pill:hover{background:rgba(26,127,232,0.10);border-color:rgba(26,127,232,0.20);color:rgba(255,255,255,0.8)}
  .sv-btn-solid:hover,.sv-btn-ghost:hover{transform:none;box-shadow:none}
}
      `}} />

      {/* ══════════ HERO ══════════ */}
      <section className="sv-hero">
        <div className="sv-hero-media">
          {/* Esta es la imagen de fondo del Hero, asegúrate de tener terminal.jpg en public */}
          <Image src="/terminal.webp" alt="Flota de transporte Boyacá" fill priority quality={85} style={{ objectFit:'cover', objectPosition:'center' }} />
        </div>
        <div className="sv-hero-overlay"/>
        <div className="sv-hero-grain"/>
        <div className="sv-hero-glow"/>
        <div className="sv-wrap">
          <div className="sv-eyebrow">
            <span className="sv-eyebrow-dot"/>
            <span className="sv-eyebrow-text">Cooflotax · Desde 1964</span>
          </div>
          <h1 className="sv-h1">Nuestros<br/><em>Servicios</em></h1>
          <p className="sv-hero-desc">
            Más de seis décadas moviendo a Boyacá. Transporte intermunicipal en bus y servicio de taxi urbano en Duitama.
          </p>
          <div className="sv-hero-pills">
            {servicios.map(s => {
              const Icono = iconos[s.id];
              return (
                <a key={s.id} href={`#${s.id}`} className="sv-hero-pill">
                  <Icono />
                  {s.title}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ PROCESO ══════════ */}
      <section className="sv-process">
        <div className="sv-wrap">
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div className="sv-stag" style={{ justifyContent:'center' }}>
              <div className="sv-stag-line"/><span className="sv-stag-text">¿Cómo funciona?</span><div className="sv-stag-line"/>
            </div>
          </div>
          <div className="sv-process-grid">
            {[
              { n:'01', title:'Elige tu servicio', sub:'Bus intermunicipal o taxi urbano' },
              { n:'02', title:'Consulta horarios', sub:'Revisa disponibilidad y frecuencias' },
              { n:'03', title:'Adquiere tu tiquete', sub:'En taquillas o por teléfono' },
              { n:'04', title:'Viaja tranquilo', sub:'Con seguridad y calidez boyacense' },
            ].map((p,i) => (
              <div key={i} className="sv-step">
                <div className="sv-step-num">{p.n}</div>
                <div className="sv-step-title">{p.title}</div>
                <div className="sv-step-sub">{p.sub}</div>
                {i < 3 && <span className="sv-step-arrow">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SERVICIOS ══════════ */}
      <section className="sv-services">
        <div className="sv-wrap">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div className="sv-stag" style={{ justifyContent:'center' }}>
              <div className="sv-stag-line"/><span className="sv-stag-text">Lo que ofrecemos</span><div className="sv-stag-line"/>
            </div>
            <h2 style={{ fontFamily:"var(--font-cormorant-alias)", fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, color:'var(--g900)', marginTop:8 }}>
              Dos servicios, una misma calidad
            </h2>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {servicios.map((s, idx) => (
              <div key={s.id} id={s.id} className="sv-card sv-fade" style={{ animationDelay:`${idx*100}ms` }}>
                <div className="sv-card-visual">
                  {/* Photo background — AQUÍ SE CARGAN TUS FOTOS flota.png y taxine.png */}
                  <div className="sv-card-photo">
                    <Image 
                      src={s.image} // <--- Esta línea toma dinámicamente '/Flota.webp' o '/Taxi.Webp'
                      alt={s.title} 
                      fill 
                      quality={85}
                      style={{ objectFit: 'cover', objectPosition: 'center' }} // Estilos base para centrar la foto
                    />
                    <div className="sv-card-photo-overlay" style={{ background: s.id === 'intermunicipal'
                      ? 'linear-gradient(180deg, rgba(10,22,40,0.70) 0%, rgba(14,36,68,0.82) 50%, rgba(10,22,40,0.92) 100%)'
                      : 'linear-gradient(180deg, rgba(28,16,8,0.70) 0%, rgba(61,38,16,0.82) 50%, rgba(28,16,8,0.92) 100%)'
                    }} />
                  </div>
                  <div className="sv-card-visual-content">
                    <div>
                      <div className="sv-card-icon" style={{ background: s.id === 'intermunicipal' ? 'rgba(26,127,232,0.15)' : 'rgba(217,119,6,0.15)', color: s.id === 'intermunicipal' ? '#5DB8FF' : '#FBBF24' }}>
                        {(() => { const Icono = iconos[s.id]; return <Icono />; })()}
                      </div>
                      <div className="sv-card-tag" style={{ background: s.id === 'intermunicipal' ? 'rgba(26,127,232,0.15)' : 'rgba(217,119,6,0.15)', color: s.id === 'intermunicipal' ? '#5DB8FF' : '#FBBF24', border: `1px solid ${s.id === 'intermunicipal' ? 'rgba(93,184,255,0.2)' : 'rgba(251,191,36,0.2)'}` }}>
                        {s.tag}
                      </div>
                      <h3 className="sv-card-title">{s.title}</h3>
                      <p className="sv-card-subtitle">{s.subtitle}</p>
                    </div>
                    <div className="sv-card-stats">
                      {s.stats.map((st,si) => (
                        <div key={si} className="sv-card-stat">
                          <span className="sv-card-stat-val">{st.val}</span>
                          <span className="sv-card-stat-lbl">{st.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sv-card-content">
                  <p className="sv-card-desc">{s.desc}</p>
                  <div className="sv-card-features">
                    {s.features.map((f,fi) => (
                      <div key={fi} className="sv-feature">
                        <div className="sv-feature-check" style={{ background: s.id === 'intermunicipal' ? 'rgba(26,127,232,0.08)' : 'rgba(217,119,6,0.08)' }}>
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={s.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                  {s.id === 'intermunicipal' ? (
                    <Link href="/rutas" className="sv-card-cta" style={{ background:'var(--blue)', color:'white', boxShadow:'0 4px 16px rgba(26,127,232,0.18)' }}>
                      Ver todas las rutas
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </Link>
                  ) : (
                    <a href="tel:+573167602222" className="sv-card-cta" style={{ background:'rgba(217,119,6,0.08)', color:'#D97706', border:'1px solid rgba(217,119,6,0.15)' }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Solicitar taxi
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="sv-cta">
        <div className="sv-cta-glow"/>
        <div className="sv-wrap" style={{ position:'relative', zIndex:1 }}>
          <div className="sv-stag" style={{ justifyContent:'center', marginBottom:24 }}>
            <div className="sv-stag-line"/><span className="sv-stag-text" style={{ color:'var(--sky)' }}>Cooflotax</span><div className="sv-stag-line"/>
          </div>
          <h2 className="sv-cta-title">¿Necesitas más información?</h2>
          <p className="sv-cta-desc">Contáctanos para cotizaciones, horarios especiales o cualquier consulta sobre nuestros servicios.</p>
          <div className="sv-cta-btns">
            <Link href="/contacto" className="sv-btn-solid">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Contáctanos
            </Link>
            <a href="https://wa.me/573103332323" target="_blank" rel="noopener noreferrer" className="sv-btn-ghost">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}