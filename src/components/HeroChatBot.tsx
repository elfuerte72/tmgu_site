import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useCycle, useAnimate } from 'framer-motion';
import useChat from '@/hooks/useChat';

interface HeroChatBotProps {
  className?: string;
}

const HeroChatBot: React.FC<HeroChatBotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage, resetChat } = useChat("hero-chat");
  const [inputMessage, setInputMessage] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(chatRef);
  const [buttonRef, animate] = useAnimate();
  const [pulseEffect, cyclePulseEffect] = useCycle(
    { scale: 1, boxShadow: "0px 0px 0px 0px rgba(59, 130, 246, 0.4)" },
    { scale: 1.05, boxShadow: "0px 0px 0px 10px rgba(59, 130, 246, 0)" }
  );
  
  // Отправляем приветственное сообщение при первом открытии чата
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        sendMessage("Привет, я Ваня! Помощник ТюмГУ, чем могу помочь?", true);
      }, 800);
    }
  }, [isOpen, messages.length, sendMessage]);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isOpen]);

  // Пульсирующий эффект для иконки
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        cyclePulseEffect();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen, cyclePulseEffect]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const toggleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
    if (isOpen) {
      resetChat();
    }
  };

  // Предотвращаем всплытие событий
  const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  // Анимация для пузырьков вокруг иконки
  const bubbleVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0.5, 1.2, 0.8],
      x: [0, Math.sin(i * 30) * 20, Math.sin(i * 30) * 30],
      y: [0, Math.cos(i * 30) * 20, Math.cos(i * 30) * 30],
      transition: {
        duration: 2,
        delay: i * 0.2,
        repeat: Infinity,
        repeatDelay: 3
      }
    })
  };

  // Варианты анимации для окна чата
  const chatWindowVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: 20,
      transformPerspective: 1000
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: 20,
      transition: {
        duration: 0.3
      }
    }
  };

  // Варианты анимации для 3D текста
  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      rotateX: 90,
      transformPerspective: 1000
    },
    visible: { 
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        delay: 0.3
      }
    },
    hover: {
      scale: 1.1,
      y: -8,
      color: "#2563EB",
      textShadow: "0 10px 20px rgba(37, 99, 235, 0.5)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Варианты анимации для контейнера текста
  const labelContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  // Анимация для отдельных символов текста
  const letterVariants = {
    hidden: { opacity: 0, y: 20, transformPerspective: 1000, rotateX: 90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        delay: i * 0.05
      }
    })
  };

  const labelText = "Нажми на меня и я помогу";

  // Функция для анимации вращения кнопки при наведении
  const handleButtonHoverStart = () => {
    animate(buttonRef.current, 
      { rotate: [0, -5, 5, -5, 0] }, 
      { duration: 0.5, ease: "easeInOut" }
    );
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`} ref={chatRef}>
      <div className="relative group">
        {/* 3D анимированная надпись */}
        {!isOpen && (
          <motion.div
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 pointer-events-none"
            variants={labelContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="bg-white/80 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg"
              whileHover="hover"
              variants={textVariants}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative overflow-hidden flex">
                {labelText.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    custom={index}
                    variants={letterVariants}
                    className="relative inline-block font-medium text-gray-700 text-lg font-serif"
                    style={{ 
                      textShadow: "0 2px 4px rgba(0,0,0,0.15)",
                      transformStyle: "preserve-3d"
                    }}
                    whileHover={{
                      color: "#2563EB",
                      y: -3,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                animate={{ 
                  scaleX: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: ["-100%", "0%", "100%"]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Анимированные пузырьки */}
        {!isOpen && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={bubbleVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="absolute -top-2 -left-2 w-3 h-3 rounded-full bg-blue-300 opacity-70"
              />
            ))}
          </>
        )}

        {/* Пульсирующая кнопка чата */}
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.button
              ref={buttonRef}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: pulseEffect.scale,
                opacity: 1,
                boxShadow: pulseEffect.boxShadow
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                duration: 1.2,
                ease: "easeInOut"
              }}
              onClick={toggleChat}
              onHoverStart={handleButtonHoverStart}
              whileHover={{ 
                scale: 1.15,
                rotate: 5,
                boxShadow: "0 15px 30px rgba(59, 130, 246, 0.6), 0 0 0 2px rgba(59, 130, 246, 0.2)",
                background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
                transition: { 
                  duration: 0.5,
                  repeat: 0,
                  type: "spring",
                  stiffness: 300,
                  damping: 10
                }
              }}
              whileTap={{ scale: 0.92, rotate: 0 }}
              className="relative flex items-center justify-center w-36 h-36 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-xl hover:shadow-blue-400/50 border border-blue-300/30 z-20 cursor-pointer group-hover:from-blue-500 group-hover:to-blue-700"
            >
              <motion.div
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex items-center justify-center"
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    background: [
                      "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 70%)",
                      "radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 70%)",
                      "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 70%)",
                      "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 70%)",
                      "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 70%)"
                    ]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <motion.span 
                  className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full border-2 border-white"
                  animate={{ 
                    scale: [1, 1.25, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(74, 222, 128, 0)',
                      '0 0 0 8px rgba(74, 222, 128, 0.3)',
                      '0 0 0 0 rgba(74, 222, 128, 0)'
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Чат-окно */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={chatWindowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
              onClick={toggleChat}
            >
              <motion.div
                className="relative w-[90vw] md:w-[680px] h-[70vh] md:h-[600px] max-h-[700px] bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden"
                style={{ 
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 122, 255, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1) inset',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={stopPropagation}
                onKeyDown={stopPropagation}
                whileHover={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 122, 255, 0.1), 0 1px 3px rgba(0, 0, 0, 0.2) inset' }}
                transition={{ duration: 0.3 }}
              >
                {/* Хедер чата */}
                <motion.div 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center text-white border-b border-blue-400/20"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner shadow-blue-500/20 border border-white/10">
                      <span className="text-lg font-semibold">ТУ</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Ассистент ТюмГУ</h3>
                      <div className="flex items-center text-xs text-blue-100">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                        Онлайн
                      </div>
                    </div>
                  </div>
                  <motion.button 
                    onClick={toggleChat}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </motion.div>

                {/* Сообщения */}
                <motion.div 
                  className="h-[calc(100%-140px)] overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-blue-50 to-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#3B82F6 #EFF6FF'
                  }}
                >
                  {messages.filter(msg => msg.role !== 'system').map((message, index) => (
                    <motion.div 
                      key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {message.role !== 'user' && (
                        <motion.div 
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 mr-3 flex items-center justify-center shadow-md"
                          whileHover={{ scale: 1.1, boxShadow: '0 5px 15px rgba(59, 130, 246, 0.4)' }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <span className="text-white text-xs font-bold">ТУ</span>
                        </motion.div>
                      )}
                      <motion.div 
                        className={`max-w-[75%] rounded-2xl p-4 ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-br-none shadow-md' 
                            : 'bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-100'
                        }`}
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className={`text-${message.role === 'user' ? 'white' : 'gray-800'} text-base leading-relaxed`}>
                          {/* Обработка переносов строк и форматирование сообщений бота */}
                          {message.content?.split('\n').map((line: string, lineIndex: number) => (
                            <div key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
                              {/* Нумерованные списки */}
                              {/^\d+\./.test(line.trim()) ? (
                                <div className="flex">
                                  <span className="font-bold mr-2">{line.match(/^\d+\./)![0]}</span>
                                  <span>{line.replace(/^\d+\./, '').trim()}</span>
                                </div>
                              ) : (
                                line || '\u00A0' /* Непечатаемый пробел для пустых строк */
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                      {message.role === 'user' && (
                        <motion.div 
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0 ml-3 flex items-center justify-center shadow-md"
                          whileHover={{ scale: 1.1, boxShadow: '0 5px 15px rgba(107, 114, 128, 0.3)' }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <span className="text-gray-600 text-xs font-bold">Вы</span>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 mr-3 flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold">ТУ</span>
                      </div>
                      <div className="bg-white rounded-2xl p-4 max-w-[75%] shadow-md border border-gray-100">
                        <div className="flex space-x-2">
                          <motion.div 
                            className="w-3 h-3 bg-blue-400 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div 
                            className="w-3 h-3 bg-blue-500 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div 
                            className="w-3 h-3 bg-blue-600 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </motion.div>

                {/* Форма ввода */}
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.03)]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center space-x-2">
                    <motion.input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Введите сообщение..."
                      className="flex-1 border border-gray-200 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-900 placeholder-gray-500 bg-gray-50"
                      disabled={isLoading}
                      whileFocus={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)", backgroundColor: "white" }}
                      transition={{ duration: 0.2 }}
                      style={{ caretColor: "#3B82F6" }}
                    />
                    <motion.button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className={`rounded-full p-3 ${
                        inputMessage.trim() && !isLoading
                          ? 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-md transition-all duration-200'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      whileHover={{ 
                        scale: inputMessage.trim() && !isLoading ? 1.05 : 1,
                        boxShadow: inputMessage.trim() && !isLoading ? "0 5px 15px rgba(59, 130, 246, 0.4)" : "none"
                      }}
                      whileTap={{ 
                        scale: inputMessage.trim() && !isLoading ? 0.95 : 1 
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" transform="rotate(180, 10, 10)" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroChatBot; 