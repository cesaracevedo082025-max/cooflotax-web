'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.duitaxicootrachica.duitama';
const REDBUS_URL = 'https://www.redbus.co/pasajes-de-bus/duitama-a-terminal-de-tunja?fromCityName=Duitama%20(Boy)%20(Todos)&fromCityId=195186&srcCountry=COL&fromCityType=CITY&toCityName=Terminal%20de%20Tunja%2C%20Tunja%20(Boy)&toCityId=202841&destCountry=COL&toCityType=AREA&onward=20-Mar-2026&doj=20-Mar-2026&ref=home';

export default function BannerFlotante({ visible = true }) {
  const [openRedbus, setOpenRedbus] = useState(false);
  const [openDuitaxi, setOpenDuitaxi] = useState(false);
  const [tooltipRedbus, setTooltipRedbus] = useState(false);
  const [tooltipDuitaxi, setTooltipDuitaxi] = useState(false);

  // Mostrar tooltips automáticamente al aparecer los botones
  useEffect(() => {
    if (!visible) return;
    // Redbus aparece primero
    const t1 = setTimeout(() => setTooltipRedbus(true), 400);
    const t2 = setTimeout(() => setTooltipRedbus(false), 7000);
    // Duitaxi con pequeño delay
    const t3 = setTimeout(() => setTooltipDuitaxi(true), 900);
    const t4 = setTimeout(() => setTooltipDuitaxi(false), 7500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [visible]);

  if (!visible) return null;

  const toggleRedbus = () => {
    setOpenRedbus(v => !v);
    setOpenDuitaxi(false);
    setTooltipRedbus(false);
  };

  const toggleDuitaxi = () => {
    setOpenDuitaxi(v => !v);
    setOpenRedbus(false);
    setTooltipDuitaxi(false);
  };

  return (
    <>
      <style>{`
        @keyframes redbuspulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(229,62,62,0.4); }
          50%       { box-shadow: 0 0 0 12px rgba(229,62,62,0); }
        }
        @keyframes duitaxiPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,215,0,0.35); }
          50%       { box-shadow: 0 0 0 12px rgba(255,215,0,0); }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes tooltipOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(8px); }
        }
      `}</style>

      {/* ── REDBUS ─────────────────────────────────────── */}

      {/* Tooltip Redbus */}
      {tooltipRedbus && !openRedbus && (
        <div style={{
          position: 'fixed', bottom: 109, right: 96, zIndex: 9997,
          background: 'rgba(10,22,40,0.92)', borderRadius: 8,
          padding: '6px 12px', whiteSpace: 'nowrap',
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          animation: 'tooltipIn 0.25s ease forwards',
        }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'white' }}>🚌 Compra tu tiquete</p>
          {/* Flecha */}
          <div style={{
            position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
            width: 0, height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '6px solid rgba(10,22,40,0.92)',
          }} />
        </div>
      )}

      {/* Popup Redbus */}
      {openRedbus && (
        <div style={{
          position: 'fixed', bottom: 98, right: 98, zIndex: 9998,
          background: 'white', borderRadius: 16, padding: '14px 16px',
          width: 240, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid rgba(0,0,0,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <Image src="/redbus.png" alt="Redbus" width={38} height={38} style={{ objectFit: 'cover' }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#0a1628' }}>Redbus</p>
              <p style={{ fontSize: 11, color: '#e53e3e', margin: 0 }}>● Compra en línea</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#555', margin: '0 0 12px', lineHeight: 1.5 }}>
            Compra tu tiquete Duitama → Tunja fácil y rápido.
          </p>
          <a href={REDBUS_URL} target="_blank" rel="noopener noreferrer" style={{
            display: 'block', textAlign: 'center', padding: '9px 0',
            background: '#e53e3e', color: 'white', borderRadius: 8,
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}>
            Comprar tiquete →
          </a>
        </div>
      )}

      {/* Botón circular Redbus */}
      <button
        onClick={toggleRedbus}
        aria-label="Comprar tiquete en Redbus"
        style={{
          position: 'fixed', bottom: 98, right: 28, zIndex: 9999,
          width: 58, height: 58, borderRadius: '50%',
          background: '#ffffff', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'redbuspulse 2.5s ease-in-out infinite',
          overflow: 'hidden', padding: 0,
        }}
      >
        <Image src="/redbus.png" alt="Redbus" width={58} height={58} style={{ objectFit: 'cover', borderRadius: '50%' }} />
      </button>

      {/* ── DUITAXI ────────────────────────────────────── */}

      {/* Tooltip Duitaxi */}
      {tooltipDuitaxi && !openDuitaxi && (
        <div style={{
          position: 'fixed', bottom: 179, right: 96, zIndex: 9997,
          background: 'rgba(10,22,40,0.92)', borderRadius: 8,
          padding: '6px 12px', whiteSpace: 'nowrap',
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          animation: 'tooltipIn 0.25s ease forwards',
        }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'white' }}>🚕 Pide tu taxi con Duitaxi</p>
          {/* Flecha */}
          <div style={{
            position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
            width: 0, height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '6px solid rgba(10,22,40,0.92)',
          }} />
        </div>
      )}

      {/* Popup Duitaxi */}
      {openDuitaxi && (
        <div style={{
          position: 'fixed', bottom: 168, right: 98, zIndex: 9998,
          background: 'white', borderRadius: 16, padding: '14px 16px',
          width: 240, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid rgba(0,0,0,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <Image src="/Duitaxi.webp" alt="Duitaxi" width={38} height={38} style={{ objectFit: 'cover' }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#0a1628' }}>Duitaxi</p>
              <p style={{ fontSize: 11, color: '#FFD700', margin: 0 }}>● App disponible</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#555', margin: '0 0 12px', lineHeight: 1.5 }}>
            Pide tu taxi en Duitama desde la app. ¡Descárgala gratis!
          </p>
          <a href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer" style={{
            display: 'block', textAlign: 'center', padding: '9px 0',
            background: '#1a1a1a', color: '#FFD700', borderRadius: 8,
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}>
            Ver en Google Play →
          </a>
        </div>
      )}

      {/* Botón circular Duitaxi */}
      <button
        onClick={toggleDuitaxi}
        aria-label="Descargar app Duitaxi"
        style={{
          position: 'fixed', bottom: 168, right: 28, zIndex: 9999,
          width: 58, height: 58, borderRadius: '50%',
          background: '#1a1a1a', border: '2px solid #FFD700', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'duitaxiPulse 3.5s ease-in-out infinite',
          overflow: 'hidden', padding: 0,
        }}
      >
        <Image src="/Duitaxi.webp" alt="Duitaxi" width={58} height={58} style={{ objectFit: 'cover', borderRadius: '50%' }} />
      </button>
    </>
  );
}