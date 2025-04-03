import { findRelevantChunks, createPromptWithContext, hasRelevantInformation } from './ragService';
import { ChatMessage } from '@/utils/types';

/**
 * Интерфейс для результата поиска в RAG-системе
 */
interface RagSearchResult {
  chunks: string[];
  hasRelevantData: boolean;
  source: 'rag' | 'tavily' | 'default';
}

/**
 * Класс для работы с RAG-системой ТюмГУ по данным поступления
 */
export class UniversityRagService {
  /**
   * Поиск релевантной информации в RAG-системе
   * @param query Запрос пользователя
   * @returns Результат поиска
   */
  public static async searchRag(query: string): Promise<RagSearchResult> {
    console.log('🔍 Поиск релевантных данных для запроса:', query);
    
    try {
      // Находим релевантные чанки по запросу (из всех источников)
      const relevantChunks = await findRelevantChunks(query, 5);
      console.log(`📊 Найдено ${relevantChunks.length} чанков по запросу`);
      
      // Проверяем, содержат ли найденные чанки релевантную информацию
      const hasRagData = hasRelevantInformation(relevantChunks, query);
      console.log('📝 Результаты поиска содержат релевантную информацию:', hasRagData);
      
      return {
        chunks: relevantChunks,
        hasRelevantData: hasRagData,
        source: hasRagData ? 'rag' : 'default'
      };
    } catch (error) {
      console.error('❌ Ошибка при поиске в RAG:', error);
      return {
        chunks: [],
        hasRelevantData: false,
        source: 'default'
      };
    }
  }

  /**
   * Создание промпта для GPT с данными из нескольких листов Excel
   * @param query Запрос пользователя
   * @param chunks Найденные чанки
   * @returns Промпт для отправки в модель
   */
  public static createUniversityPrompt(query: string, chunks: string[]): string {
    if (chunks.length === 0) {
      return this.createDefaultPrompt(query);
    }
    
    // Объединяем все найденные чанки для создания контекста
    const context = chunks.join('\n\n');
    
    return `Ты - виртуальный ассистент Тюменского государственного университета. Твоя задача - точно отвечать на вопросы о поступлении, опираясь ТОЛЬКО на предоставленную информацию.

ИНФОРМАЦИЯ ИЗ БАЗЫ ЗНАНИЙ:
${context}

ЗАПРОС ПОЛЬЗОВАТЕЛЯ: ${query}

ПРАВИЛА ОТВЕТА:
1. Используй ТОЛЬКО информацию из предоставленного контекста.
2. Если в контексте недостаточно информации для полного ответа, честно скажи об этом. Не додумывай факты.
3. Всегда указывай источник информации (лист Excel, если это известно из контекста).
4. Отвечай кратко, структурированно и по делу.
5. Не используй длинные вводные фразы. Сразу переходи к ответу.
6. Если вопрос касается разных программ (бакалавриат, магистратура, гимназия, СПО), четко разделяй информацию по каждой программе.

Твой ответ:`;
  }

  /**
   * Создание стандартного промпта при отсутствии RAG-данных
   * @param query Запрос пользователя
   * @returns Промпт для отправки в модель
   */
  private static createDefaultPrompt(query: string): string {
    return `Ты - виртуальный ассистент Тюменского государственного университета. Твоя задача - помогать абитуриентам и студентам с информацией об университете.

К сожалению, у меня нет точной информации по твоему запросу в базе данных. Я могу дать только общую информацию, которая может быть неточной или устаревшей.

ЗАПРОС ПОЛЬЗОВАТЕЛЯ: ${query}

ПРАВИЛА ОТВЕТА:
1. Честно признай, что у тебя нет точной информации по этому вопросу в базе данных.
2. Предложи обратиться в приемную комиссию ТюмГУ для получения актуальной информации.
3. Укажи контактные данные приемной комиссии: телефон +7 (3452) 59-74-29, email: abiturient@utmn.ru.
4. Если это уместно, предложи зайти на официальный сайт ТюмГУ (https://www.utmn.ru).
5. Не придумывай факты и не давай потенциально неверную информацию.

Твой ответ:`;
  }

  /**
   * Подготовка сообщений для отправки в модель
   * @param query Запрос пользователя
   * @param history История сообщений
   * @param chunks Найденные чанки
   * @returns Массив сообщений для отправки в модель
   */
  public static prepareMessages(query: string, history: ChatMessage[], chunks: string[]): ChatMessage[] {
    // Создаем системный промпт с данными из RAG
    const systemPrompt = this.createUniversityPrompt(query, chunks);
    
    // Создаем массив сообщений для отправки в API
    let messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.filter((m: ChatMessage) => m.role !== 'system')
    ];
    
    // Добавляем сообщение пользователя, если его нет в истории
    if (!messages.some((m: ChatMessage) => m.role === 'user' && m.content === query)) {
      messages.push({ role: 'user', content: query });
    }
    
    return messages;
  }
}
