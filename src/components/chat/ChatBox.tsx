'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from '@/utils/types';
import VoiceRecorder from '@/components/VoiceRecorder';

interface ChatBoxProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClose: () => void;
}

const ChatBox = ({ messages, isLoading, onSendMessage, onClose }: ChatBoxProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleVoiceRecording = async (blob: Blob) => {
    try {
      setIsProcessingAudio(true);
      
      // Создаем FormData для отправки аудио
      const formData = new FormData();
      formData.append('audio', blob);

      // Отправляем аудио на сервер для распознавания
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка при распознавании речи');
      }

      const { text } = await response.json();
      
      // Отправляем распознанный текст в чат
      if (text.trim()) {
        onSendMessage(text);
      }
    } catch (error) {
      console.error('Ошибка при обработке голосового сообщения:', error);
    } finally {
      setIsProcessingAudio(false);
    }
  };

  // Воспроизведение ответа голосом
  const playResponse = async (text: string) => {
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании аудио');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Ошибка при воспроизведении ответа:', error);
    }
  };

  // Воспроизводим последний ответ ассистента
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && lastMessage.content) {
      playResponse(lastMessage.content);
    }
  }, [messages]);

  // Автоматическая прокрутка вниз при новом сообщении только в пределах контейнера сообщений
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col w-full h-full max-w-md max-h-[500px] border border-blue-100/50 dark:border-blue-900/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 122, 255, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1) inset',
      }}
    >
      {/* Заголовок чата с градиентом */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-white text-lg">Ассистент ТюмГУ</h3>
            <div className="flex items-center text-xs text-blue-100">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              Онлайн
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Сообщения с улучшенным дизайном */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-blue-50/30 dark:bg-gray-800/30" onClick={(e) => e.stopPropagation()}>
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="font-medium text-gray-600 dark:text-gray-300">Задайте вопрос ассистенту ТюмГУ</p>
            <p className="text-sm">Я могу рассказать о программах обучения, жизни в университете и ответить на другие вопросы</p>
          </div>
        )}

        {messages.filter(msg => msg.role !== 'system').map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role !== 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 mr-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">ТУ</span>
              </div>
            )}
            <div 
              className={`max-w-[80%] rounded-2xl p-3.5 ${
                message.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none shadow-md' 
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-600'
              }`}
            >
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
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 ml-2 flex items-center justify-center">
                <span className="text-gray-600 text-xs font-bold">Вы</span>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 mr-2 flex items-center justify-center">
              <span className="text-white text-xs font-bold">ТУ</span>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-3.5 max-w-[80%] shadow-sm border border-gray-100 dark:border-gray-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Аудио элемент для воспроизведения ответов */}
      <audio ref={audioRef} className="hidden" />

      {/* Улучшенная форма ввода */}
      <form onSubmit={handleSubmit} className="border-t border-gray-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 rounded-b-2xl">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            disabled={isLoading || isProcessingAudio}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex items-center space-x-2 min-w-[80px]">
            <VoiceRecorder onRecordingComplete={handleVoiceRecording} />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading || isProcessingAudio}
              className={`rounded-full p-3 ${
                inputMessage.trim() && !isLoading && !isProcessingAudio
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatBox;
