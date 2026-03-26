'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

// ── Datos estáticos fuera del componente — no se recrean en cada render ──
const IconoDireccion = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const IconoTelefono = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
const IconoWhatsapp = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>;
const IconoEmail = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;

const contactCards = [
  { Icon: IconoDireccion, title: 'Dirección',  info: 'CRA 18 N° 23-30, Duitama', href: 'https://maps.google.com/?q=Cooflotax+Duitama+Boyaca+Colombia' },
  { Icon: IconoTelefono, title: 'Teléfono',   info: '313 393 8967',              href: 'tel:+573133938967' },
  { Icon: IconoWhatsapp, title: 'WhatsApp',   info: '310 333 2323',              href: 'https://wa.me/573103332323' },
  { Icon: IconoEmail,    title: 'Email',       info: 'pqrsdcooflotax@gmail.com',         href: 'mailto:pqrsdcooflotax@gmail.com' },
];

const FORM_INITIAL = { nombre: '', email: '', telefono: '', asunto: '', mensaje: '' };

export default function Contacto() {
  const [form, setForm] = useState(FORM_INITIAL);
  const [enviado, setEnviado] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setForm(FORM_INITIAL);
    }, 4000);
  }, []);

  return (
    <main style={{ fontFamily: "var(--font-dm-sans-alias)", background: '#fff', color: '#0F172A' }}>
      {/* Fuentes cargadas globalmente desde layout.js via next/font */}

      <style dangerouslySetInnerHTML={{
        __html: `
        /* Aliases de fuentes cargadas en layout.js */
        :root {
          --font-dm-sans-alias: var(--font-dm-sans, 'DM Sans', sans-serif);
          --font-cormorant-alias: var(--font-cormorant, 'Cormorant Garamond', serif);
          --font-jetbrains-alias: var(--font-jetbrains, 'JetBrains Mono', monospace);
        }

        :root{--blue:#1A7FE8;--blue-dim:#0057B8;--sky:#5DB8FF;--navy:#0A1628;--g50:#F8FAFD;--g100:#F0F4FA;--g200:#E2E8F2;--g300:#CBD5E1;--g400:#94A3B8;--g500:#64748B;--g600:#475569;--g700:#334155;--g800:#1E293B;--g900:#0F172A;--green:#059669;--ease:cubic-bezier(0.16,1,0.3,1)}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        /* ═══ HERO ═══ */
        .ct-hero{display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:clamp(140px,16vh,180px) 0 clamp(60px,8vh,90px);color:white;text-align:center}
        .ct-hero-media{position:absolute;inset:0;z-index:0}
        .ct-hero-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(2,10,20,0.88) 0%,rgba(10,22,40,0.75) 50%,rgba(10,22,40,0.92) 100%)}
        .ct-hero-grain{position:absolute;inset:0;z-index:2;background-image:radial-gradient(circle,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
        .ct-hero-glow{position:absolute;inset:0;z-index:2;background:radial-gradient(ellipse 50% 50% at 50% 50%,rgba(26,127,232,0.06) 0%,transparent 70%);pointer-events:none}
        .ct-wrap{max-width:1400px;margin:0 auto;padding:0 clamp(28px,6vw,72px);position:relative;z-index:3}
        .ct-eyebrow{display:inline-flex;align-items:center;gap:10px;padding:6px 18px 6px 14px;border-radius:100px;background:rgba(26,127,232,0.12);border:1px solid rgba(93,184,255,0.15);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);margin-bottom:28px}
        .ct-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:#5DB8FF;box-shadow:0 0 8px rgba(93,184,255,0.5);animation:ctPulse 2.5s ease infinite;flex-shrink:0}
        @keyframes ctPulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes activePulse{0%,100%{opacity:1}50%{opacity:.5}}
        .ct-eyebrow-text{font-family:var(--font-jetbrains-alias);font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#5DB8FF}
        .ct-h1{font-family:var(--font-cormorant-alias);font-size:clamp(2.8rem,7vw,5.2rem);font-weight:700;color:white;line-height:1.08;letter-spacing:-.025em;margin:0 0 18px;text-shadow:0 4px 30px rgba(0,0,0,0.6)}
        .ct-h1 em{font-style:italic;color:var(--sky);-webkit-text-fill-color:var(--sky);text-shadow:0 2px 20px rgba(93,184,255,0.3)}
        .ct-hero-desc{font-size:clamp(14px,1.5vw,16px);color:rgba(255,255,255,0.50);line-height:1.85;max-width:520px;margin:0 auto}

        /* ═══ CONTACT CARDS ═══ */
        .ct-cards-section{position:relative;z-index:10;margin-top:-36px;padding:0 clamp(28px,6vw,72px)}
        .ct-cards-inner{max-width:1100px;margin:0 auto}
        .ct-cards-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:900px){.ct-cards-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:520px){.ct-cards-grid{grid-template-columns:1fr}}
        .ct-card{background:white;border:1px solid var(--g200);border-radius:14px;padding:24px 20px;text-align:center;transition:all .3s var(--ease);position:relative;overflow:hidden}
        .ct-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--blue),var(--sky));opacity:0;transition:opacity .25s ease}
        .ct-card:hover{border-color:rgba(26,127,232,0.18);box-shadow:0 12px 40px rgba(26,127,232,0.06);transform:translateY(-3px)}
        .ct-card:hover::before{opacity:1}
        .ct-card-icon{width:48px;height:48px;margin:0 auto 14px;border-radius:12px;background:rgba(26,127,232,0.06);border:1px solid rgba(26,127,232,0.08);display:flex;align-items:center;justify-content:center;color:var(--blue)}
        .ct-card-title{font-family:var(--font-jetbrains-alias);font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--g400);margin-bottom:6px}
        .ct-card-info{font-size:14px;font-weight:600;color:var(--g900);line-height:1.4}
        .ct-card a{color:var(--g900);text-decoration:none;transition:color .2s ease}
        .ct-card a:hover{color:var(--blue)}

        /* ═══ MAIN CONTENT ═══ */
        .ct-main{padding:clamp(60px,8vh,100px) 0;background:white}
        .ct-main-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:clamp(40px,5vw,72px);max-width:1300px;margin:0 auto;align-items:stretch}
        @media(max-width:900px){.ct-main-grid{grid-template-columns:1fr}}

        /* section tag */
        .ct-stag{display:inline-flex;align-items:center;gap:10px;margin-bottom:18px}
        .ct-stag-line{width:28px;height:1.5px;background:var(--blue)}
        .ct-stag-text{font-family:var(--font-jetbrains-alias);font-size:9px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--blue)}
        .ct-section-title{font-family:var(--font-cormorant-alias);font-size:clamp(1.6rem,3vw,2.2rem);font-weight:700;color:var(--g900);margin-bottom:8px}
        .ct-section-desc{font-size:14px;color:var(--g500);margin-bottom:32px;line-height:1.7}

        /* form */
        .ct-form{display:flex;flex-direction:column;gap:20px}
        .ct-form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        @media(max-width:520px){.ct-form-row{grid-template-columns:1fr}}
        .ct-field{display:flex;flex-direction:column;gap:6px}
        .ct-label{font-family:var(--font-jetbrains-alias);font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--g500)}
        .ct-input{padding:13px 16px;border-radius:10px;border:1.5px solid var(--g200);background:var(--g50);font-family:var(--font-dm-sans-alias);font-size:14px;color:var(--g900);outline:none;transition:all .2s var(--ease)}
        .ct-input:focus{border-color:var(--blue);background:white;box-shadow:0 0 0 3px rgba(26,127,232,0.06)}
        .ct-input::placeholder{color:var(--g400)}
        .ct-textarea{resize:vertical;min-height:130px}
        .ct-select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:40px}
        .ct-submit{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:16px 32px;border-radius:10px;border:none;cursor:pointer;background:var(--blue);color:white;font-family:var(--font-dm-sans-alias);font-size:15px;font-weight:700;transition:all .2s var(--ease);box-shadow:0 4px 16px rgba(26,127,232,0.18)}
        .ct-submit:hover{box-shadow:0 6px 24px rgba(26,127,232,0.30);transform:translateY(-1px)}
        .ct-submit:active{transform:translateY(0)}
        .ct-submit.sent{background:var(--green);box-shadow:0 4px 16px rgba(5,150,105,0.18)}

        /* animation */
        .ct-fade{animation:ctFade .5s var(--ease) both}
        @keyframes ctFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

        /* MAP — animación de sombra reemplazada por sombra estática (evita compositing constante) */
        .cta-map-card{box-shadow:0 20px 60px rgba(26,127,232,0.12),0 4px 16px rgba(26,127,232,0.06);transition:box-shadow .4s ease}
        .cta-map-card:hover{box-shadow:0 28px 72px rgba(26,127,232,0.20),0 6px 20px rgba(26,127,232,0.10)}

        /* Mobile: mapa altura adaptable */
        @media(max-width:900px){
          .cta-map-card{min-height:320px!important}
        }
        @media(max-width:520px){
          .cta-map-card{min-height:260px!important}
          .ct-cards-section{margin-top:-20px}
        }

        /* Touch devices: disable hover effects */
        @media(hover:none){
          .ct-card:hover{transform:none;box-shadow:none;border-color:var(--g200)}
          .ct-card:hover::before{opacity:0}
          .ct-submit:hover{transform:none;box-shadow:0 4px 16px rgba(26,127,232,0.18)}
          .cta-map-card:hover{box-shadow:0 20px 60px rgba(26,127,232,0.12),0 4px 16px rgba(26,127,232,0.06)}
        }
      `}} />

      {/* ══════════ HERO ══════════ */}
      <section className="ct-hero">
        <div className="ct-hero-media">
          <Image src="/duitama.webp" alt="Paisaje de Boyacá" fill priority quality={85} style={{ objectFit:'cover', objectPosition:'center 40%' }} />
        </div>
        <div className="ct-hero-overlay" />
        <div className="ct-hero-grain" />
        <div className="ct-hero-glow" />
        <div className="ct-wrap">
          <div className="ct-eyebrow">
            <span className="ct-eyebrow-dot" />
            <span className="ct-eyebrow-text">Atención al cliente</span>
          </div>
          <h1 className="ct-h1">Contáctanos</h1>
          <p className="ct-hero-desc">
            Estamos para servirte. Escríbenos o llámanos para resolver tus dudas, cotizaciones o cualquier información que necesites.
          </p>
        </div>
      </section>

      {/* ══════════ CONTACT CARDS ══════════ */}
      <div className="ct-cards-section">
        <div className="ct-cards-inner">
          <div className="ct-cards-grid">
            {contactCards.map((c, i) => (
              <div key={i} className="ct-card ct-fade" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="ct-card-icon"><c.Icon /></div>
                <div className="ct-card-title">{c.title}</div>
                <div className="ct-card-info">
                  <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}>{c.info}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ FORM + MAPA MEJORADO ══════════ */}
      <section className="ct-main">
        <div className="ct-wrap">
          <div className="ct-main-grid">
            
            {/* ── Formulario Izquierdo ── */}
            <div>
              <div className="ct-stag"><div className="ct-stag-line" /><span className="ct-stag-text">Escríbenos</span></div>
              <h2 className="ct-section-title">Envíanos un mensaje</h2>
              <p className="ct-section-desc">Completa el formulario y te responderemos a la brevedad posible.</p>

              <form className="ct-form" onSubmit={handleSubmit} style={{marginBottom: '32px'}}>
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label className="ct-label">Nombre completo</label>
                    <input className="ct-input" type="text" name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Tu nombre" />
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Correo electrónico</label>
                    <input className="ct-input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="pqrsdcooflotax@gmail.com" />
                  </div>
                </div>
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label className="ct-label">Teléfono</label>
                    <input className="ct-input" type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="300 000 0000" />
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Asunto</label>
                    <select className="ct-input ct-select" name="asunto" value={form.asunto} onChange={handleChange} required>
                      <option value="">Seleccionar...</option>
                      <option value="informacion">Información general</option>
                      <option value="rutas">Consulta de rutas</option>
                      <option value="cotizacion">Cotización</option>
                      <option value="queja">Queja o reclamo</option>
                      <option value="sugerencia">Sugerencia</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>
                <div className="ct-field">
                  <label className="ct-label">Mensaje</label>
                  <textarea className="ct-input ct-textarea" name="mensaje" value={form.mensaje} onChange={handleChange} required placeholder="Escribe tu mensaje aquí..." rows={5} />
                </div>
                <button type="submit" className={`ct-submit${enviado ? ' sent' : ''}`}>
                  {enviado ? (
                    <>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Mensaje enviado
                    </>
                  ) : (
                    <>
                      Enviar mensaje
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* ── Mapa Lado Derecho (Estilo Componente Nosotros) ── */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <div className="ct-stag"><div className="ct-stag-line" /><span className="ct-stag-text">Encuéntranos</span></div>
               <h2 className="ct-section-title">Nuestra ubicación</h2>
               <p className="ct-section-desc">Visítanos en nuestra sede principal en Duitama, Boyacá.</p>
               
               <div className="cta-map-card" style={{
                  borderRadius: 24, overflow: 'hidden',
                  border: '1px solid rgba(26,127,232,0.14)',
                  background: 'white',
                  height: '100%', minHeight: '480px',
                  display: 'flex', flexDirection: 'column',
                  boxShadow: '0 20px 60px rgba(10,22,40,0.10)'
                }}>

                  {/* Header del mapa */}
                  <div style={{
                    padding: '14px 18px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'white',
                    borderBottom: '1px solid rgba(26,127,232,0.08)',
                    flexShrink: 0
                  }}>
                    {/* Pin icon */}
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: 'linear-gradient(135deg, #1A7FE8, #0057B8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(26,127,232,0.28)'
                    }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    {/* Título */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 13.5, fontWeight: 700, color: '#0A1628', margin: 0, lineHeight: 1.2 }}>Sede Central Cooflotax</p>
                      <p style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 11, color: '#94A3B8', margin: 0 }}>Terminal de Transportes · Duitama, Boyacá</p>
                    </div>
                    {/* Badge activo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)', flexShrink: 0 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'activePulse 2s ease-in-out infinite' }} />
                      <span style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 11, fontWeight: 700, color: '#16a34a' }}>Activo</span>
                    </div>
                  </div>

                  {/* Mapa Iframe */}
                  <div style={{ position: 'relative', flex: 1, minHeight: '300px' }}>
                    <iframe
                      title="Cooflotax Duitama"
                      src="https://maps.google.com/maps?q=Cooflotax+Duitama+Boyaca+Colombia&z=13&output=embed"
                      style={{ display: 'block', border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  {/* Footer del mapa */}
                  <div style={{
                    padding: '13px 18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    background: 'white',
                    borderTop: '1px solid rgba(26,127,232,0.08)',
                    flexShrink: 0, flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#1A7FE8" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        <span style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 11.5, fontWeight: 600, color: '#374151' }}>Cra. 18 N° 23-30 · Cll 5 36B 140, Duitama</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 17 }}>
                        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span style={{ fontFamily: 'var(--font-dm-sans-alias)', fontSize: 11, color: '#94A3B8' }}>Lun – Dom · 5:00 AM – 10:00 PM</span>
                      </div>
                    </div>
                    <a
                      href="https://maps.google.com/?q=Cooflotax+Duitama+Boyaca+Colombia"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        padding: '10px 16px', borderRadius: 22,
                        background: 'white',
                        border: '1.5px solid rgba(26,127,232,0.25)',
                        fontFamily: 'var(--font-dm-sans-alias)', fontSize: 12.5, fontWeight: 700,
                        color: '#1A7FE8', textDecoration: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Abrir en Maps
                    </a>
                    <a
                      href="https://maps.google.com/?q=Cooflotax+Duitama+Boyaca+Colombia"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        padding: '10px 20px', borderRadius: 22,
                        background: 'linear-gradient(135deg, #1A7FE8, #0057B8)',
                        fontFamily: 'var(--font-dm-sans-alias)', fontSize: 12.5, fontWeight: 700,
                        color: 'white', textDecoration: 'none',
                        boxShadow: '0 6px 18px rgba(26,127,232,0.30)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      Cómo llegar
                    </a>
                  </div>
                </div>

            </div>
          </div>
        </div>
      </section>

    </main>
  );
}