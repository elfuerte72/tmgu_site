'use client';

import { useState, useCallback } from 'react';
import { ChatMessage } from '@/utils/types';

const useChat = (instanceId = 'default') => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string, isBot = false) => {
    if (isBot) {
      // Если это сообщение от бота (для приветствия)
      setMessages(prev => [...prev, { role: 'assistant', content: message }]);
      return;
    }

    // Добавляем сообщение пользователя
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          history: messages,
          instanceId
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении ответа от API');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз позже.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, instanceId]);

  const resetChat = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, sendMessage, resetChat };
};

export default useChat;
