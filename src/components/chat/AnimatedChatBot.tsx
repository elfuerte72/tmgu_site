"use client";

import React, { useState } from "react";
import { GraduationCap, Send, Paperclip, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
  ChatMessageList,
  ChatInput,
} from "@/components/ui/expandable-chat";

interface Message {
  id: number;
  content: string;
  sender: "bot" | "user";
}

export const AnimatedChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Здравствуйте! Я ассистент ТюмГУ. Как я могу помочь вам?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      content: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    // Симуляция ответа бота
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        content: "Спасибо за ваш вопрос! Я обрабатываю информацию...",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <ExpandableChat
      size="lg"
      position="bottom-right"
      icon={<GraduationCap className="h-6 w-6" />}
      className="font-inter"
    >
      <ExpandableChatHeader className="flex-col text-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <h1 className="text-xl font-semibold">Ассистент ТюмГУ</h1>
        <p className="text-sm opacity-90">
          Задайте вопрос о университете
        </p>
      </ExpandableChatHeader>

      <ExpandableChatBody className="bg-gray-50">
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                className={cn(
                  "h-8 w-8 shrink-0",
                  message.sender === "bot"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : "bg-gradient-to-br from-gray-500 to-gray-600"
                )}
                fallback={message.sender === "user" ? "Вы" : "А"}
              />
              <ChatBubbleMessage
                variant={message.sender === "user" ? "sent" : "received"}
                className={cn(
                  "shadow-sm",
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                )}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="bg-gradient-to-br from-blue-500 to-blue-600"
                fallback="А"
              />
              <ChatBubbleMessage isLoading className="bg-white shadow-sm" />
            </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter className="bg-white border-t">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-2"
        >
          <div className="relative rounded-lg border bg-gray-50 focus-within:ring-1 focus-within:ring-blue-500 p-1">
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введите сообщение..."
              className="min-h-12 bg-transparent"
            />
            <div className="flex items-center p-2 pt-0 justify-between">
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="submit"
                disabled={!input.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
};

export default AnimatedChatBot;
