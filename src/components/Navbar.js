'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ── Datos estáticos fuera del componente — no se recrean en cada render ──
const NAV_LINKS = [
  { name: 'Inicio',    href: '/' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Servicios',href: '/servicios' },
  { name: 'Rutas',    href: '/rutas' },
  { name: 'Contacto', href: '/contacto' },
];

// ── CSS estático fuera del componente — no se re-inyecta en cada render ──
const NAVBAR_CSS = `
  @keyframes slideUpFade {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lightSweepNavbar {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .anim-stagger {
    animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }
  .mobile-bg-anim {
    animation: fadeIn 0.4s ease forwards;
  }

  .nav-link-corporate {
    position: relative;
    color: rgba(255, 255, 255, 0.78);
    transition: color 0.35s ease;
    font-family: var(--font-montserrat, 'Montserrat', sans-serif);
    letter-spacing: 0.05em;
  }
  .nav-link-corporate::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #0057B8, #1A7FE8);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 2px;
  }
  .nav-link-corporate:hover { color: #ffffff; }
  .nav-link-corporate:hover::after { width: 100%; }

  /* Touch: desactivar underline hover (no funciona en touch de todos modos) */
  @media (hover: none) {
    .nav-link-corporate:hover { color: rgba(255,255,255,0.78); }
    .nav-link-corporate:hover::after { width: 0; }
  }

  .corporate-shimmer-text {
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
`;

export default function Navbar() {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const rafRef = useRef(null);

  // ✅ Throttle via RAF — evita setState en cada pixel de scroll
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ✅ Cleanup correcto al desmontar + scroll al cerrar menú
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // ✅ useCallback para no recrear la función en cada render
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);

  return (
    <>
      {/* ✅ dangerouslySetInnerHTML evita hydration mismatch en Next.js */}
      <style dangerouslySetInnerHTML={{ __html: NAVBAR_CSS }} />

      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isScrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-4'
        }`}
        style={{
          background:    isScrolled ? 'rgba(2,10,24,0.88)' : 'transparent',
          backdropFilter:isScrolled ? 'blur(22px) saturate(1.9)' : 'none',
          borderBottom:  isScrolled ? '1px solid rgba(0,87,184,0.18)' : '1px solid transparent',
          boxShadow:     isScrolled ? '0 4px 30px rgba(0,87,184,0.08)' : 'none',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 sm:gap-4 group flex-shrink-0">
              <div className={`relative transition-all duration-700 ease-out flex-shrink-0 ${
                isScrolled
                  ? 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24'
                  : 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32'
              }`}>
                <Image
                  src="/logo.webp"
                  alt="Logo COOFLOTAX"
                  fill
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
                  quality={90}
                  priority
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col justify-center overflow-hidden">
                <span
                  className={`font-black tracking-tighter leading-none transition-all duration-700 corporate-shimmer-text ${
                    isScrolled
                      ? 'text-xl sm:text-2xl md:text-3xl'
                      : 'text-2xl sm:text-3xl md:text-4xl'
                  }`}
                  style={{ fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)" }}
                >
                  COOFLOTAX
                </span>
                <span className={`font-medium tracking-[0.25em] sm:tracking-[0.3em] uppercase mt-1 transition-all duration-700 text-white/75 ${
                  isScrolled ? 'text-[7px] sm:text-[8px] md:text-[9px]' : 'text-[8px] sm:text-[9px] md:text-[11px]'
                }`}>
                  Servimos con Calidez
                </span>
              </div>
            </Link>

            {/* ENLACES DESKTOP */}
            <div className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="nav-link-corporate text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* BOTÓN MENÚ MÓVIL — z-[110] para estar sobre el overlay */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden relative z-[110] text-white p-2 hover:opacity-80 transition-opacity focus:outline-none"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="relative w-7 h-5 flex flex-col justify-between overflow-hidden">
                <span className={`w-full h-[2px] rounded-full bg-[#1A7FE8] transform transition-all duration-500 origin-left ${isMobileMenuOpen ? 'rotate-45 translate-x-px' : ''}`} />
                <span className={`w-full h-[2px] rounded-full bg-white transform transition-all duration-500 ${isMobileMenuOpen ? 'opacity-0 translate-x-4' : 'opacity-100'}`} />
                <span className={`w-full h-[2px] rounded-full bg-[#1A7FE8] transform transition-all duration-500 origin-left ${isMobileMenuOpen ? '-rotate-45 translate-x-px' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* MENÚ MÓVIL — z-[105] entre navbar(100) y botón(110) */}
      {isMobileMenuOpen && (
        <div
          className="mobile-bg-anim fixed inset-0 z-[105] flex flex-col items-center justify-center pt-10 pb-10 px-6"
          style={{
            background:    'rgba(2,10,24,0.97)',
            backdropFilter:'blur(24px)',
          }}
        >
          <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,87,184,0.5), transparent)' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(0,87,184,0.08) 0%, transparent 70%)' }} />

          {/* ✅ Logo sin animación de flotación en el menú mobile */}
          <div className="relative w-24 h-24 mb-8 anim-stagger" style={{ animationDelay: '0.1s' }}>
            <Image
              src="/logo.webp"
              alt="Logo COOFLOTAX"
              fill
              sizes="96px"
              quality={90}
              className="object-contain"
            />
          </div>

          <div
            className="flex flex-col items-center gap-2 w-full max-w-xs relative z-10"
            style={{ fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)" }}
          >
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobileMenu}
                className="anim-stagger w-full text-center relative group py-4 border-b last:border-0"
                style={{
                  animationDelay: `${0.15 + i * 0.08}s`,
                  borderColor: 'rgba(0,87,184,0.12)',
                }}
              >
                <span className="relative text-white/80 text-lg font-semibold tracking-wide group-hover:text-[#1A7FE8] group-active:text-[#1A7FE8] transition-colors duration-300">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="anim-stagger mt-10 text-center" style={{ animationDelay: '0.7s' }}>
            <p className="text-white/40 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Servicio al Cliente
            </p>
            <a
              href="tel:+573103332323"
              className="text-xl font-black transition-colors text-[#1A7FE8] hover:text-white"
            >
              310 333 2323
            </a>
          </div>
        </div>
      )}
    </>
  );
}