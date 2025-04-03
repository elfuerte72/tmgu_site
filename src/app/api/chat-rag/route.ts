import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/utils/openai';
import { ChatMessage } from '@/utils/types';
import { 
  findRelevantChunks, 
  createPromptWithContext, 
  hasRelevantInformation, 
  initializeRAG 
} from '@/services/rag/ragService';
import { searchWeb } from '@/utils/tavily';

// Инициализируем RAG систему при первом вызове API
let isRagInitialized = false;

/**
 * Обработчик POST запросов для чат-бота с поддержкой RAG
 */
export async function POST(request: NextRequest) {
  try {
    // Убедимся, что RAG система инициализирована
    if (!isRagInitialized) {
      try {
        await initializeRAG();
        isRagInitialized = true;
        console.log('RAG-система успешно инициализирована');
      } catch (initError) {
        console.error('Ошибка при инициализации RAG системы:', initError);
        // Продолжаем работу даже при ошибке инициализации
      }
    }

    // Получаем данные запроса
    const { message, history, instanceId = 'default' } = await request.json();
    
    // Получаем контекст из RAG системы
    console.log('Поиск релевантных чанков для запроса:', message);
    const relevantChunks = await findRelevantChunks(message, 3);
    console.log(`Найдено ${relevantChunks.length} релевантных чанков`);

    // Проверяем, есть ли релевантные данные из RAG системы
    const hasRagData = hasRelevantInformation(relevantChunks, message);
    
    if (hasRagData) {
      console.log('Используем данные из RAG для ответа');
      
      // Создаем системный промпт с данными из RAG
      const systemPrompt = createPromptWithContext(message, relevantChunks);
      
      // Создаем массив сообщений для отправки в API
      let messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...history.filter((m: ChatMessage) => m.role !== 'system')
      ];
      
      // Добавляем сообщение пользователя
      if (!messages.some((m: ChatMessage) => m.role === 'user' && m.content === message)) {
        messages.push({ role: 'user', content: message });
      }
      
      // Получаем ответ от OpenAI с контекстом из RAG
      const responseContent = await generateChatResponse(messages);
      
      return NextResponse.json({ 
        message: responseContent,
        source: 'rag',
        instanceId
      });
    } else {
      console.log('Не найдено релевантных данных в RAG, используем Tavily');
      
      // Создаем обычный массив сообщений
      const messages: ChatMessage[] = [
        ...history
      ];
      
      // Добавляем сообщение пользователя
      messages.push({ role: 'user', content: message });
      
      // Получаем ответ от OpenAI
      const responseContent = await generateChatResponse(messages);
      
      return NextResponse.json({ 
        message: responseContent,
        source: 'default',
        instanceId
      });
    }
  } catch (error) {
    console.error('Ошибка API чата с RAG:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке запроса' },
      { status: 500 }
    );
  }
}
