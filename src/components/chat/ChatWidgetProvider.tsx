'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Динамически импортируем ChatWidget, чтобы избежать проблем с SSR
const ChatWidget = dynamic(() => import('./ChatWidget'), {
  ssr: false
});

export default function ChatWidgetProvider() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Рендерим только на клиенте, чтобы избежать проблем с гидратацией
  if (!isClient) {
    return null;
  }

  return <ChatWidget />;
} 