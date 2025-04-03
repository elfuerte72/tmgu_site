import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/utils/openai';
import { ChatMessage } from '@/utils/types';
import { initializeRAG } from '@/services/rag/ragService';
import { UniversityRagService } from '@/services/rag/universityRagService';

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
        console.log('🚀 RAG-система успешно инициализирована');
      } catch (initError) {
        console.error('❌ Ошибка при инициализации RAG системы:', initError);
        // Продолжаем работу даже при ошибке инициализации
      }
    }

    // Получаем данные запроса
    const { message, history, instanceId = 'default' } = await request.json();
    
    // Используем новый UniversityRagService для поиска данных
    console.log('🔎 Поиск информации для запроса:', message);
    const searchResult = await UniversityRagService.searchRag(message);
    console.log(`📊 Результаты поиска: найдено ${searchResult.chunks.length} чанков, релевантность: ${searchResult.hasRelevantData}`);
    
    if (searchResult.hasRelevantData) {
      console.log('✅ Используем данные из RAG для ответа');
      
      // Подготавливаем сообщения с данными из RAG
      const messages = UniversityRagService.prepareMessages(message, history, searchResult.chunks);
      
      // Получаем ответ от OpenAI с контекстом из RAG
      const responseContent = await generateChatResponse(messages);
      
      return NextResponse.json({ 
        message: responseContent,
        source: 'rag',
        instanceId
      });
    } else {
      // Если в RAG не найдено релевантных данных, используем обычный чат
      console.log('ℹ️ Не найдено релевантных данных в RAG, используем обычный чат без дополнительного контекста');
      
      // Используем пустой массив чанков для создания дефолтного промпта
      const messages = UniversityRagService.prepareMessages(message, history, []);
      
      const responseContent = await generateChatResponse(messages);
      
      return NextResponse.json({ 
        message: responseContent,
        source: 'default',
        instanceId
      });
    }
  } catch (error) {
    console.error('❌ Ошибка API чата с RAG:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке запроса' },
      { status: 500 }
    );
  }
}
