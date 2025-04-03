"use client";

import React, { useState, useRef, useEffect } from "react";
import "@/styles/chatIcon.css";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Volume2, VolumeX, StopCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatMessage as ChatMessageType } from "@/utils/types";

interface Message {
  id: number;
  content: string;
  sender: "bot" | "user";
  isPlaying?: boolean;
}

interface AnimatedChatBotProps {
  embedded?: boolean;
}

const ChatMessage: React.FC<{ message: Message; onPlaySound: (text: string) => void; onStopSound: () => void }> = ({ message, onPlaySound, onStopSound }) => {
  const isUser = message.sender === "user";
  return (
    <div className={cn("flex mb-3", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "py-2 px-4 rounded-2xl max-w-[75%] text-sm shadow-sm",
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none backdrop-blur-sm border border-gray-200/50"
        )}
      >
        {message.content}
      </div>
      {!isUser && (
        <div className="flex flex-col gap-1 ml-2 self-end">
          {message.isPlaying ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-500 hover:text-red-700 p-1 bg-gray-100 rounded-full border border-gray-200/50"
              onClick={onStopSound}
              aria-label="Остановить озвучивание"
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-blue-500 hover:text-blue-700 p-1 bg-gray-100 rounded-full border border-gray-200/50"
              onClick={() => onPlaySound(message.content)}
              aria-label="Озвучить сообщение"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};


export const AnimatedChatBot: React.FC<AnimatedChatBotProps> = ({ embedded = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Здравствуйте! Я ассистент ТюмГУ. Как я могу помочь вам?",
      sender: "bot",
      isPlaying: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setCurrentPlayingId(null);
        setMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
      };
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);


  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const newMessage: Message = {
      id: Date.now(),
      content: trimmedInput,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare chat history for API call
      const chatHistory: ChatMessageType[] = messages
        .filter(msg => msg.id !== newMessage.id) // Exclude the message we just added
        .map(msg => ({
          role: msg.sender === 'bot' ? 'assistant' : 'user',
          content: msg.content,
        }));

      // Call the chat API
      const response = await fetch('/api/chat-rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedInput,
          history: chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chat API');
      }

      const data = await response.json();
      
      const botResponse: Message = {
        id: Date.now() + 1,
        content: data.message || "Извините, я не смог обработать ваш запрос. Пожалуйста, попробуйте еще раз.",
        sender: "bot",
        isPlaying: false,
      };
      
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
      
      // Auto-play response if not muted
      if (!isMuted) {
        handlePlaySound(botResponse.content, botResponse.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      // Show error message to user
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз позже.",
        sender: "bot",
        isPlaying: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handlePlaySound = async (text: string, messageId?: number) => {
    if (isMuted) return;
    
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Update message state to show playing status
      if (messageId) {
        setCurrentPlayingId(messageId);
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, isPlaying: true } : { ...msg, isPlaying: false }
        ));
      }
      
      // Call the text-to-speech API
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to convert text to speech');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      setCurrentPlayingId(null);
      setMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
    }
  }
  
  const handleStopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentPlayingId(null);
    setMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
  }

  const handleMicClick = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      setIsRecording(true);
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleSpeechToText(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording with 30 second time limit
      mediaRecorder.start();
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 30000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const handleSpeechToText = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to convert speech to text');
      }
      
      const data = await response.json();
      
      if (data.text) {
        // Create and send the user message
        const newMessage: Message = {
          id: Date.now(),
          content: data.text,
          sender: "user",
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        
        // Prepare chat history for API call
        const chatHistory: ChatMessageType[] = messages
          .map(msg => ({
            role: msg.sender === 'bot' ? 'assistant' : 'user',
            content: msg.content
          }));

        // Call the chat API
        const chatResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: data.text,
            history: chatHistory,
          }),
        });

        if (!chatResponse.ok) {
          throw new Error('Failed to get response from chat API');
        }

        const chatData = await chatResponse.json();
        
        const botResponse: Message = {
          id: Date.now() + 1,
          content: chatData.message || "Извините, я не смог обработать ваш запрос. Пожалуйста, попробуйте еще раз.",
          sender: "bot",
          isPlaying: false,
        };
        
        setMessages((prev) => [...prev, botResponse]);
        setIsLoading(false);
        
        // Auto-play response if not muted
        if (!isMuted) {
          handlePlaySound(botResponse.content, botResponse.id);
        }
      }
    } catch (error) {
      console.error('Error processing speech to text:', error);
      setIsLoading(false);
      
      // Show error message to user
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: "Извините, произошла ошибка при обработке вашего голосового сообщения. Пожалуйста, попробуйте еще раз.",
        sender: "bot",
        isPlaying: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      handleSendMessage();
    }
  };

  return (
    <>
      {embedded ? (
        // Embedded version for hero section
        <div className="w-full h-full flex items-center justify-center">
          <motion.div
            className="relative w-64 h-64 md:w-80 md:h-80 cursor-pointer bg-transparent border-none shadow-none overflow-visible"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              y: [0, -8, 0],
              transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            aria-label="Открыть чат"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="chat-icon-container">
                <div className="chat-icon-image circle-mask w-full h-full">
                  <Image
                    src="/images/chat-icon-updated.png"
                    alt="Чат-бот ТюмГУ"
                    fill
                    style={{ objectFit: 'contain' }}
                    className="pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        // Floating version for other pages
        <div className="fixed bottom-6 right-6 z-50"> 
          <motion.button
            className="relative w-16 h-16 md:w-20 md:h-20 focus:outline-none bg-transparent border-none shadow-none overflow-visible"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
                y: [0, -5, 0],
                transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            aria-label="Открыть чат"
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="chat-icon-image circle-mask w-full h-full flex items-center justify-center">
                <Image
                  src="/images/chat-icon-updated.png" 
                  alt="Чат-бот ТюмГУ"
                  width={80}
                  height={80}
                  className="pointer-events-none"
                />
              </div>
            </div>
          </motion.button>
        </div>
      )}
      
      {/* Chat window - shared between both versions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
             <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

             <motion.div
              className="relative z-50 w-full max-w-2xl h-[80vh] max-h-[700px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200/50"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/95">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Ассистент ТюмГУ</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMuted(!isMuted)}
                      aria-label={isMuted ? "Включить звук" : "Отключить звук"}
                  >
                      {isMuted ? <VolumeX className="h-5 w-5"/> : <Volume2 className="h-5 w-5"/>}
                  </Button>
                  <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                      aria-label="Закрыть чат"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                   </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.map((msg) => (
                  <ChatMessage 
                    key={msg.id} 
                    message={msg} 
                    onPlaySound={handlePlaySound} 
                    onStopSound={handleStopSound} 
                  />
                ))}
                {isLoading && (
                   <div className="flex justify-start mb-3">
                       <div className="py-2 px-4 rounded-2xl bg-gray-100 text-gray-500 rounded-bl-none border border-gray-200/50 backdrop-blur-sm">
                           <div className="flex items-center gap-2">
                             <div className="flex space-x-1">
                               <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                               <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                               <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                             </div>
                             <span>Печатает...</span>
                           </div>
                       </div>
                   </div>
                )}
                <div ref={messagesEndRef} /> 
              </div>

              <div className="p-4 border-t border-gray-200/50 bg-white/95">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                   <Button
                       type="button"
                       variant="ghost"
                       size="icon"
                       className={`flex-shrink-0 h-10 w-10 rounded-full transition-all duration-300 ${isRecording 
                         ? 'bg-red-500 text-white pulsate-faint' 
                         : 'bg-gray-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700'}`}
                       onClick={handleMicClick}
                       aria-label={isRecording ? 'Остановить запись' : 'Голосовой ввод'}
                   >
                       <Mic className="h-5 w-5" />
                       {isRecording && (
                         <span className="absolute -top-1 -right-1 flex h-3 w-3">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                         </span>
                       )}
                   </Button>

                   <div className="relative flex-grow">
                     <textarea
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       onKeyDown={handleKeyDown}
                       placeholder="Введите сообщение..."
                       className="w-full resize-none rounded-2xl py-3 px-4 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 min-h-[45px] max-h-[120px] transition-all duration-200"
                       rows={1}
                       disabled={isLoading || isRecording}
                     />
                   </div>

                   <Button
                    type="submit"
                    size="icon"
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full h-10 w-10 disabled:opacity-50 shadow-sm transition-all duration-200 disabled:hover:bg-blue-600"
                    disabled={(!input.trim() && !isRecording) || isLoading}
                    aria-label="Отправить сообщение"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedChatBot;
