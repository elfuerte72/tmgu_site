"use client";

import dynamic from "next/dynamic";

const AnimatedChatBot = dynamic(() => import("./AnimatedChatBot"), {
  ssr: false,
});

export default function ChatBotWrapper() {
  return <AnimatedChatBot />;
}
