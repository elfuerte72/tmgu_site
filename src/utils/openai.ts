import OpenAI from 'openai';
import { ChatMessage, FunctionDefinition } from './types';

// Определение системного промпта с возможностью переопределения через переменную окружения
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || 
  'Вы - цифровой ассистент Тюменского государственного университета. Отвечайте на вопросы кратко, дружелюбно и информативно.';

// Инициализация клиента OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Очищает текст от символов форматирования и специальных символов
 * @param text Текст для очистки
 * @returns Очищенный текст
 */
function cleanFormattingSymbols(text: string): string {
  // Регулярное выражение для удаления символов форматирования
  // Удаляем **, [], {}, <>, _, ~, `, #, |, и другие символы форматирования
  // Дефис (-) обрабатываем отдельно, удаляя только в случаях форматирования (в начале строки как маркер списка)
  let cleaned = text
    .replace(/[\*\[\]\{\}\<\>\_\~\`\#\|\=\+]/g, '')
    .replace(/\n\s*[-•]\s+/g, '\n'); // Заменяем маркеры списков на просто перевод строки
  
  // Обработка перечислений, чтобы преобразовать их в нумерованные списки
  // Ищем перечисления в одном предложении, например: "нужны документы: паспорт, СНИЛС, аттестат"
  // и преобразуем их в нумерованный список
  cleaned = cleaned.replace(/(?:нужн[а-я]+|необходим[а-я]+|требу[а-я]+)[^:,.]+(:|требуется|необходимо)[^:,.]*?(:)?\s*([а-яА-Я][^,.]+(?:,\s+[а-яА-Я][^,.]+)+)/gi, (match, p1, p2, p3) => {
    if (!p3) return match;
    
    // Берём перечисление (p3) и разбиваем на элементы по запятой
    const items = p3.split(/,\s+/);
    
    // Формируем заголовок и нумерованный список
    let result = match.split(p3)[0].trim() + "\n\n";
    items.forEach((item: string, index: number) => {
      result += `${index + 1}. ${item.trim()}\n`;
    });
    
    return result;
  });

  // Преобразуем любые списки с номерами "1) " или "1. " в формат с новой строкой
  // Ищем шаблон, где после цифры идет точка или скобка и текст, и убеждаемся, что это отдельный список
  cleaned = cleaned.replace(/(\n|^)\s*(\d+)[\.\)]\s+([^\n]+)/g, (match, newline, number, text) => {
    return `${newline}${number}. ${text}`;
  });

  // Проверяем, есть ли в тексте перечисления через запятую в сочетании с "документы" или "необходимо"
  if (/документ|необходим|нужн|требу/i.test(cleaned) && /[а-яА-Я][^,.]+(?:,\s+[а-яА-Я][^,.]+)+/.test(cleaned)) {
    // Преобразуем перечисление через запятую в нумерованный список
    cleaned = cleaned.replace(/(?:документ[а-я]*|необходим[а-я]*|нужн[а-я]*|требу[а-я]*)[^:,.]*?:\s*([а-яА-Я][^,.]+(?:,\s+[а-яА-Я][^,.]+)+)\.?/gi, (match, p1) => {
      if (!p1) return match;
      
      // Разбиваем перечисление на элементы
      const items = p1.split(/,\s+/).filter((item: string) => item.trim().length > 0);
      if (items.length <= 1) return match;
      
      // Формируем заголовок
      let result = match.split(p1)[0].trim() + "\n\n";
      
      // Формируем нумерованный список
      items.forEach((item: string, index: number) => {
        result += `${index + 1}. ${item.trim()}\n`;
      });
      
      return result;
    });
  }

  return cleaned;
}

// Определение доступных функций для использования с OpenAI
const availableFunctions: Record<string, (args: any) => Promise<string>> = {};

// Схемы функций для OpenAI
const functionDefinitions: FunctionDefinition[] = [];

/**
 * Преобразует наш внутренний формат сообщений в формат OpenAI API
 */
function convertMessagesToOpenAIFormat(messages: ChatMessage[]): any[] {
  return messages.map(msg => {
    const result: any = {
      role: msg.role,
      // Всегда передаем строковое значение для content, даже если null
      content: msg.content || ''
    };
    
    if (msg.name) {
      result.name = msg.name;
    }
    
    if (msg.function_call) {
      result.function_call = msg.function_call;
    }
    
    if (msg.tool_calls) {
      result.tool_calls = msg.tool_calls;
    }
    
    return result;
  });
}

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    // Проверяем, есть ли системное сообщение в начале
    if (messages.length > 0 && messages[0].role === 'system') {
      // Системное сообщение уже есть, не добавляем новое
    } else {
      // Добавляем системное сообщение в начало массива
      messages.unshift({ 
        role: 'system', 
        content: SYSTEM_PROMPT 
      });
    }
    
    // Извлекаем сообщение пользователя для анализа
    const userMessage = messages.find(msg => msg.role === 'user')?.content || '';
    console.log('Сообщение пользователя:', userMessage);
    
    // Проверяем запрос о документах для поступления и отвечаем строго формализованным списком
    if (
      (typeof userMessage === 'string') && 
      (
        (userMessage.toLowerCase().includes('документ') && userMessage.toLowerCase().includes('поступлени')) ||
        (userMessage.toLowerCase().includes('что нужно для поступлени')) ||
        (userMessage.toLowerCase().includes('какие документы нужн'))
      )
    ) {
      console.log('Используем форматированный ответ о документах для поступления');
      
      return `Для поступления в ТюмГУ тебе понадобятся следующие документы:

1. Паспорт (оригинал и копия)
2. Аттестат о среднем образовании или диплом о среднем профессиональном образовании с приложением (оригинал и копия)
3. СНИЛС (копия)
4. Фотографии 3х4 см (4 штуки)
5. Медицинская справка 086-У (для некоторых направлений)
6. Результаты ЕГЭ (действительны 4 года)
7. Документы, подтверждающие индивидуальные достижения (если есть)

Если у тебя остались вопросы о поступлении, обязательно спрашивай! 🎓`;
    }

    // Проверяем, содержит ли сообщение ключевые слова для запроса о правилах поступления
    if (
      (typeof userMessage === 'string') && 
      (
        (userMessage.toLowerCase().includes('поступлени') && userMessage.toLowerCase().includes('тюмгу')) ||
        (userMessage.toLowerCase().includes('правила') && userMessage.toLowerCase().includes('тюмгу'))
      )
    ) {
      console.log('Используем RAG для запроса о правилах поступления');
      // Продолжаем стандартную обработку
    }
    
    if (
      (typeof userMessage === 'string') && 
      (
        (userMessage.toLowerCase().includes('новост') && userMessage.toLowerCase().includes('тюмгу')) ||
        (userMessage.toLowerCase().includes('событи') && userMessage.toLowerCase().includes('тюмгу'))
      )
    ) {
      console.log('Используем RAG для запроса о новостях');
      // Продолжаем стандартную обработку
    }
    
    // Преобразуем сообщения в формат OpenAI
    const openaiMessages = convertMessagesToOpenAIFormat(messages);
    console.log('Отправляем сообщения в OpenAI:', 
      JSON.stringify(openaiMessages.map(m => ({ 
        role: m.role, 
        content: typeof m.content === 'string' && m.content.length > 50 
          ? m.content.substring(0, 50) + '...' 
          : (m.content || '[пусто]') 
      })), null, 2)
    );
    
    // Создаем запрос к OpenAI с поддержкой функций
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: openaiMessages,
      temperature: 0.3,
      max_tokens: 1000
    });

    const responseMessage = response.choices[0]?.message;
    console.log('Ответ от OpenAI:', responseMessage ? 'получен' : 'не получен');
    
    // Функциональность поиска через Tavily была удалена

    // Очищаем ответ от символов форматирования перед возвратом
    return responseMessage?.content 
      ? cleanFormattingSymbols(responseMessage.content) 
      : 'Извините, не удалось получить ответ.';
  } catch (error) {
    console.error('Ошибка при обращении к OpenAI API:', error);
    return 'Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.';
  }
}

export default openai; 