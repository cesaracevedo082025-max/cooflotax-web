'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import WhatsappButton from './WhatsappButton';
import BannerFlotante from './BannerFlotante';

export default function WhatsappButtonConditional() {
  const pathname = usePathname();
  const [showButton, setShowButton] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const [closeFloatersSignal, setCloseFloatersSignal] = useState(0);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const isHome = pathname === '/';
    prevPathname.current = pathname;

    if (!isHome) {
      setShowButton(true);
      return;
    }

    setShowButton(false);

    const handleIntroFinished = () => setShowButton(true);
    window.addEventListener('introTerminada', handleIntroFinished);
    return () => window.removeEventListener('introTerminada', handleIntroFinished);
  }, [pathname]);

  // Ocultar flotantes en móvil cuando el navbar está abierto
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setMobileMenuOpen(document.body.classList.contains('mobile-menu-open'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleWaToggle = () => {
    if (!waOpen) setCloseFloatersSignal(s => s + 1); // cerrar Duitaxi/RedBus al abrir WA
    setWaOpen(v => !v);
  };

  const handleFloaterOpen = () => setWaOpen(false); // cerrar WA al abrir Duitaxi/RedBus

  const floatersVisible = showButton && !mobileMenuOpen;

  return (
    <>
      <WhatsappButton visible={floatersVisible} open={waOpen} onToggle={handleWaToggle} />
      <BannerFlotante visible={floatersVisible} onAnyOpen={handleFloaterOpen} closeAllSignal={closeFloatersSignal} />
    </>
  );
}