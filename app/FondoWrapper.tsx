'use client';

import dynamic from 'next/dynamic';

const FondoCosmico = dynamic(() => import('./FondoCosmico'), { ssr: false });

export default function FondoWrapper() {
  return <FondoCosmico />;
}
