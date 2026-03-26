"use client"

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

export default function Footer() {

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Rutas', href: '/rutas' },
    { name: 'Contacto', href: '/contacto' },
  ];

  const services = [
    'Transporte Intermunicipal',
    'Servicio de Taxis',
  ];

  return (
    <footer className="ft-root" style={{ background: '#020A14' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Reset & Root ── */
        .ft-root {
          position: relative;
          color: white;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Shimmer top line ── */
        @keyframes shimmerLine {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .ft-shimmer-line {
          height: 1px; width: 100%;
          background: linear-gradient(90deg,
            rgba(0,87,184,0) 0%,
            rgba(26,127,232,0.75) 38%,
            rgba(140,200,255,1) 50%,
            rgba(26,127,232,0.75) 62%,
            rgba(0,87,184,0) 100%
          );
          background-size: 200% auto;
          animation: shimmerLine 5s linear infinite;
        }

        /* ── Glow halo behind top line ── */
        .ft-halo {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 55%; height: 220px;
          background: radial-gradient(ellipse 50% 200px at 50% 0%,
            rgba(26,127,232,0.10) 0%, transparent 100%);
          pointer-events: none;
        }

        /* ── Inner container ── */
        .ft-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 48px 56px 0;
        }

        /* ── Main grid ── */
        .ft-grid {
          display: grid;
          grid-template-columns: 1.55fr 1fr 1fr 1.35fr;
          gap: 32px 48px;
        }
        @media (max-width: 900px) {
          .ft-grid { grid-template-columns: 1fr 1fr; gap: 32px 28px; }
          .ft-inner { padding: 40px 28px 0; }
        }
        @media (max-width: 520px) {
          .ft-grid { grid-template-columns: 1fr; }
        }

        /* ── Section label ── */
        .ft-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #4da6ff;
          margin: 0 0 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ft-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(26,127,232,0.28);
          border-radius: 1px;
        }

        @keyframes lightSweepNavbar {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .ft-shimmer-text {
          background: linear-gradient(
            108deg,
            #0057B8 0%, #0057B8 36%,
            #4da3ff 41%, #d4eaff 46%, #4da3ff 51%,
            #0057B8 56%, #0057B8 100%
          );
          background-size: 280% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.9));
          animation: lightSweepNavbar 9s linear infinite;
        }

        /* ── Logo block ── */
        .ft-logo-wrap {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 14px;
        }
        .ft-logo-img-wrap {
          position: relative;
          width: 120px;
          height: 120px;
          flex-shrink: 0;
        }
        @media (max-width: 520px) {
          .ft-logo-img-wrap { width: 90px; height: 90px; }
        }
        .ft-logo-name {
          font-family: 'Montserrat', sans-serif;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.02em;
          display: block;
          line-height: 1.1;
        }
        .ft-logo-sub {
          font-family: 'Montserrat', sans-serif;
          font-size: 7.5px;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          display: block;
          margin-top: 4px;
        }
        .ft-desc {
          font-size: 13px;
          font-weight: 400;
          line-height: 1.75;
          color: rgba(255,255,255,0.72);
          margin: 0 0 18px;
          max-width: 280px;
        }

        /* ── Social icons ── */
        .ft-socials {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .ft-social {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.12);
          transition: transform 0.22s ease, box-shadow 0.22s ease,
                      border-color 0.22s ease, filter 0.22s ease;
          flex-shrink: 0;
        }
        .ft-social:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.35);
          border-color: rgba(255,255,255,0.28);
          filter: brightness(1.15);
        }
        .ft-social-fb  { background: #1877F2; }
        .ft-social-ig  { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); }
        .ft-social-maps { background: #ffffff; border-color: rgba(0,0,0,0.12) !important; }

        /* ── Nav links ── */
        .ft-nav-link {
          color: rgba(255,255,255,0.72);
          font-size: 13px;
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          transition: color 0.22s ease, gap 0.22s ease;
          padding: 1px 0;
        }
        .ft-nav-link:hover { color: #ffffff; gap: 14px; }
        .ft-nav-link:hover .ft-dot { background: #4da6ff; transform: scale(1.6); }
        .ft-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(26,127,232,0.60);
          flex-shrink: 0;
          transition: background 0.22s ease, transform 0.22s ease;
        }

        /* ── Service items ── */
        .ft-service-item {
          display: flex;
          align-items: center;
          gap: 11px;
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.72);
          transition: color 0.22s ease;
          padding: 1px 0;
        }
        .ft-service-item:hover { color: #ffffff; }
        .ft-service-item:hover .ft-service-dot { background: #4da6ff; transform: scale(1.6); }
        .ft-service-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(26,127,232,0.60);
          flex-shrink: 0;
          transition: background 0.22s ease, transform 0.22s ease;
        }

        /* ── Contact — premium redesign ── */
        .ft-contact-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .ft-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid rgba(26,127,232,0.10);
          text-decoration: none;
          transition: border-color 0.2s ease;
        }
        .ft-contact-item:first-child { padding-top: 0; }
        .ft-contact-item:last-child { border-bottom: none; padding-bottom: 0; }
        .ft-contact-item:hover { border-color: rgba(26,127,232,0.25); }
        .ft-contact-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: rgba(26,127,232,0.12);
          border: 1px solid rgba(26,127,232,0.28);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .ft-contact-item:hover .ft-contact-icon {
          background: rgba(26,127,232,0.24);
          box-shadow: 0 0 10px rgba(26,127,232,0.20);
        }
        .ft-contact-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .ft-contact-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: #4da6ff;
          margin: 0 0 3px;
        }
        .ft-contact-value {
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.72);
          margin: 0;
          line-height: 1.5;
          letter-spacing: 0.01em;
        }
        .ft-contact-phones {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ft-phone-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ft-phone-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4da6ff;
          min-width: 40px;
          background: rgba(26,127,232,0.12);
          border: 1px solid rgba(26,127,232,0.28);
          border-radius: 4px;
          padding: 1px 5px;
          text-align: center;
        }
        .ft-phone-num {
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.72);
          letter-spacing: 0.03em;
        }
        .ft-email-val {
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.72);
          word-break: break-all;
          letter-spacing: 0.01em;
          transition: color 0.2s ease;
        }
        a.ft-contact-item:hover .ft-email-val { color: #4da6ff; }

        /* ── Info cards (Transparencia / Políticas) ── */
        .ft-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 28px;
        }
        @media (max-width: 640px) {
          .ft-cards { grid-template-columns: 1fr; }
        }
        .ft-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 24px;
          border-radius: 12px;
          border: 1px solid rgba(26,127,232,0.22);
          background: linear-gradient(135deg,
            rgba(26,127,232,0.07) 0%,
            rgba(0,87,184,0.04) 100%
          );
          text-decoration: none;
          overflow: hidden;
          transition: border-color 0.25s ease, background 0.25s ease,
                      box-shadow 0.25s ease, transform 0.25s ease;
        }
        .ft-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,
            rgba(26,127,232,0.10) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.25s ease;
          border-radius: inherit;
        }
        .ft-card:hover {
          border-color: rgba(26,127,232,0.55);
          background: linear-gradient(135deg,
            rgba(26,127,232,0.13) 0%,
            rgba(0,87,184,0.07) 100%
          );
          box-shadow: 0 0 0 1px rgba(26,127,232,0.12),
                      0 8px 32px rgba(26,127,232,0.14);
          transform: translateY(-2px);
        }
        .ft-card:hover::before { opacity: 1; }
        .ft-card-left {
          display: flex;
          align-items: center;
          gap: 14px;
          position: relative;
          z-index: 1;
        }
        .ft-card-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(26,127,232,0.14);
          border: 1px solid rgba(26,127,232,0.32);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.25s ease, box-shadow 0.25s ease;
        }
        .ft-card:hover .ft-card-icon {
          background: rgba(26,127,232,0.26);
          box-shadow: 0 0 14px rgba(26,127,232,0.22);
        }
        .ft-card-text {}
        .ft-card-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ffffff;
          text-shadow: 0 0 16px rgba(255,255,255,0.12);
          margin: 0 0 3px;
        }
        .ft-card-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: rgba(255,255,255,0.60);
          margin: 0;
        }
        .ft-card-arrow {
          position: relative;
          z-index: 1;
          font-family: 'JetBrains Mono', monospace;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4da6ff;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(77,166,255,0.40);
          background: rgba(26,127,232,0.10);
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.22s ease, border-color 0.22s ease,
                      color 0.22s ease, box-shadow 0.22s ease;
        }
        .ft-card:hover .ft-card-arrow {
          background: rgba(26,127,232,0.26);
          border-color: rgba(77,166,255,0.70);
          color: #a8d8ff;
          box-shadow: 0 0 14px rgba(26,127,232,0.25);
        }

        /* ── Bottom bar ── */
        .ft-bottom {
          margin-top: 0;
        }
        .ft-bottom-sep {
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(26,127,232,0.18) 20%,
            rgba(26,127,232,0.35) 50%,
            rgba(26,127,232,0.18) 80%,
            transparent 100%
          );
        }
        .ft-bottom-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 18px 56px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        @media (max-width: 520px) {
          .ft-bottom-inner { padding: 16px 28px; flex-direction: column; align-items: flex-start; }
        }
        .ft-bottom-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ft-bottom-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(26,127,232,0.5);
          flex-shrink: 0;
        }
        .ft-copy {
          font-size: 11.5px;
          font-weight: 400;
          color: rgba(255,255,255,0.50);
          margin: 0;
        }
        .ft-regulator {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.30);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ft-regulator::before {
          content: '';
          display: inline-block;
          width: 14px;
          height: 1px;
          background: rgba(77,166,255,0.45);
          flex-shrink: 0;
        }
      `}} />

      {/* Top shimmer */}
      <div className="ft-shimmer-line" />
      <div className="ft-halo" />

      <div className="ft-inner">

        {/* ── Main grid ── */}
        <div className="ft-grid">

          {/* Brand column */}
          <div>
            <div className="ft-logo-wrap">
              <div className="ft-logo-img-wrap">
                <Image
                  src="/logo.webp"
                  alt="Logo COOFLOTAX"
                  fill
                  sizes="120px"
                  quality={90}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="ft-logo-name ft-shimmer-text">COOFLOTAX</span>
                <span className="ft-logo-sub">Servimos con Calidez</span>
              </div>
            </div>
            <p className="ft-desc">
              Cooperativa de Transportadores Flotax Duitama. Más de 60 años conectando a Boyacá con servicio, seguridad y calidez humana.
            </p>
            <div className="ft-socials">
              {/* Facebook */}
              <a href="https://www.facebook.com/Cooflotax1" target="_blank" rel="noopener noreferrer" className="ft-social ft-social-fb" aria-label="Facebook">
                <FaFacebook size={20} color="#fff" />
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/cooflotax" target="_blank" rel="noopener noreferrer" className="ft-social ft-social-ig" aria-label="Instagram">
                <FaInstagram size={20} color="#fff" />
              </a>
              {/* Google Maps */}
              <a href="https://maps.google.com/?q=Cooflotax+Duitama+Boyaca+Colombia" target="_blank" rel="noopener noreferrer" className="ft-social ft-social-maps" aria-label="Google Maps">
                <FaLocationDot size={20} color="#EA4335" />
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <p className="ft-label">Navegación</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {navLinks.map(l => (
                <li key={l.name}>
                  <Link href={l.href} className="ft-nav-link">
                    <span className="ft-dot" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <p className="ft-label">Servicios</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {services.map(s => (
                <li key={s} className="ft-service-item">
                  <span className="ft-service-dot" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="ft-label">Contacto</p>
            <div className="ft-contact-list">

              {/* Dirección */}
              <div className="ft-contact-item">
                <div className="ft-contact-icon">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#1A7FE8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="ft-contact-body">
                  <p className="ft-contact-eyebrow">Dirección</p>
                <p className="ft-contact-value">CRA 18 n 23-30 — Boyacá, Colombia</p>
                </div>
              </div>

              {/* Teléfonos */}
              <div className="ft-contact-item">
                <div className="ft-contact-icon">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#1A7FE8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12 19.79 19.79 0 0 1 1.06 3.34 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="ft-contact-body">
                  <p className="ft-contact-eyebrow">Teléfonos</p>
                  <div className="ft-contact-phones">
                    <div className="ft-phone-row">
                      <span className="ft-phone-tag">Oficina</span>
                      <span className="ft-phone-num">313 393 8967</span>
                    </div>
                    <div className="ft-phone-row">
                      <span className="ft-phone-tag">Taxi</span>
                      <span className="ft-phone-num">316 760 2222</span>
                    </div>
                    <div className="ft-phone-row">
                      <span className="ft-phone-tag">Taxi</span>
                      <span className="ft-phone-num">316 023 2222</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <a href="mailto:transportesflotax@cooflotax.com" className="ft-contact-item">
                <div className="ft-contact-icon">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#1A7FE8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="ft-contact-body">
                  <p className="ft-contact-eyebrow">Correo</p>
                  <span className="ft-email-val">pqrsdcooflotax@gmail.com</span>
                </div>
              </a>

            </div>
          </div>
        </div>

        {/* ── Info cards ── */}
        <div className="ft-cards">

          <Link href="/Documentos" className="ft-card">
            <div className="ft-card-left">
              <div className="ft-card-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1A7FE8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <div className="ft-card-text">
                <p className="ft-card-title">Transparencia y Documentos ESAL</p>
                <p className="ft-card-sub">Accede a nuestra información pública obligatoria</p>
              </div>
            </div>
            <span className="ft-card-arrow">Ver documentos →</span>
          </Link>

          <Link href="/politicas" className="ft-card">
            <div className="ft-card-left">
              <div className="ft-card-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1A7FE8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L3 7l9 5 9-5-9-5z"/>
                  <path d="M3 17l9 5 9-5"/>
                  <path d="M3 12l9 5 9-5"/>
                </svg>
              </div>
              <div className="ft-card-text">
                <p className="ft-card-title">Políticas Internas</p>
                <p className="ft-card-sub">Consulta nuestras políticas y reglamentos</p>
              </div>
            </div>
            <span className="ft-card-arrow">Ver políticas →</span>
          </Link>

        </div>

        {/* ── Stat band ── */}

      </div>

      {/* ── Bottom bar ── */}
      <div className="ft-bottom">
        <div className="ft-bottom-sep" />
        <div className="ft-bottom-inner">
          <div className="ft-bottom-left">
            <span className="ft-bottom-dot" />
            <p className="ft-copy">
              © {new Date().getFullYear()} COOFLOTAX — Cooperativa de Transportadores Flotax Duitama.
            </p>
          </div>
          <p className="ft-regulator">
            Vigilados por la Superintendencia de Puertos y Transporte
          </p>
        </div>
      </div>

    </footer>
  );
}