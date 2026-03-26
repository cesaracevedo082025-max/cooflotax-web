'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import WhatsappButton from './WhatsappButton';
import BannerFlotante from './BannerFlotante';

export default function WhatsappButtonConditional() {
  const pathname = usePathname();
  const [showButton, setShowButton] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const isHome = pathname === '/';
    const cameFromElsewhere = prevPathname.current !== '/';
    prevPathname.current = pathname;

    if (!isHome) {
      // En cualquier otra ruta: mostrar siempre
      setShowButton(true);
      return;
    }

    // Llegamos al home: ocultar inmediatamente sin importar el estado anterior
    setShowButton(false);

    const handleIntroFinished = () => setShowButton(true);
    window.addEventListener('introTerminada', handleIntroFinished);
    return () => window.removeEventListener('introTerminada', handleIntroFinished);
  }, [pathname]);

  return (
    <>
      <WhatsappButton visible={showButton} />
      <BannerFlotante visible={showButton} />
    </>
  );
}