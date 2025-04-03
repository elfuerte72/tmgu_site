"use client";

import dynamic from "next/dynamic";

// Динамический импорт чат-бота без SSR
const UniversityChatBot = dynamic(() => import("./chat/UniversityChatBot"), {
  ssr: false,
});

/**
 * Компонент-провайдер для глобального чат-бота
 * Используется как клиентский компонент в серверном layout.tsx
 */
export default function GlobalChatProvider() {
  return <UniversityChatBot />;
}
