import path from 'path';
import { createEmbedding, createEmbeddingsWithMetadata } from './embeddingService';
import { FaissVectorStore } from '@/lib/vector-store/faissStore';
import { createTopicBasedChunks, createChunksFromTextFile } from '@/utils/excel/excelParser';

// Путь к файлу данных (будем использовать относительный путь от корня проекта)
const EXCEL_FILE_PATH = path.join(process.cwd(), 'data', 'script.xlsx');
const TEXT_FILE_PATH = path.join(process.cwd(), 'data', 'test-data.txt');

// Создание и конфигурация векторного хранилища
const vectorStore = new FaissVectorStore();

/**
 * Инициализирует и наполняет векторное хранилище данными из Excel файла
 */
export async function initializeRAG(forceInit: boolean = false): Promise<void> {
  // Проверяем наличие флага инициализации
  const initRag = process.env.INIT_RAG === 'true' || forceInit;
  try {
    console.log('Инициализация RAG системы...');
    
    // Инициализация векторного хранилища
    await vectorStore.initialize();
    
    // Если стоит флаг принудительной инициализации, очищаем хранилище
    if (initRag) {
      console.log('Обнаружен флаг инициализации RAG, выполняем полную инициализацию...');
      try {
        await vectorStore.clear();
        console.log('Векторное хранилище очищено');
      } catch (clearError) {
        console.log('Ошибка при очистке хранилища или хранилище уже пустое');
      }
    } else {
      // Проверка, нужно ли заполнять хранилище
      try {
      // Выполняем тестовый поиск, чтобы проверить, есть ли данные
      const testQuery = 'тест';
      const testEmbedding = await createEmbedding(testQuery);
      const results = await vectorStore.search(testEmbedding, 1);
      
      if (results.length > 0 && !initRag) {
        console.log('Хранилище уже содержит данные, пропускаем загрузку');
        return;
      }
    } catch (error) {
      // Если возникла ошибка при тестовом поиске, продолжаем заполнение
      console.log('Требуется заполнение хранилища...');
    }
  }
    
    // Извлечение и обработка данных из текстового файла
    console.log('Извлечение данных из текстового файла:', TEXT_FILE_PATH);
    
    // Определяем тип для чанков
    type ChunkType = {text: string, metadata: Record<string, string>};
    let chunks: ChunkType[] = [];
    
    try {
      // Сначала пробуем использовать текстовый файл
      chunks = await createChunksFromTextFile(TEXT_FILE_PATH);
      console.log(`Создано ${chunks.length} чанков из текстового файла`);
    } catch (textError) {
      console.error('Ошибка при чтении текстового файла:', textError);
      
      // Если текстовый файл недоступен, пробуем Excel
      try {
        console.log('Пробуем использовать Excel файл:', EXCEL_FILE_PATH);
        chunks = await createTopicBasedChunks(EXCEL_FILE_PATH);
        console.log(`Создано ${chunks.length} чанков из Excel файла`);
      } catch (excelError) {
        console.error('Ошибка при чтении Excel файла:', excelError);
      }
    }
    
    if (chunks.length === 0) {
      console.log('Не найдено данных в файлах');
      return;
    }
    
    // Создание эмбеддингов для чанков
    console.log('Создание эмбеддингов для чанков...');
    const embeddedEntities = await createEmbeddingsWithMetadata(chunks);
    console.log(`Создано ${embeddedEntities.length} эмбеддингов`);
    
    // Добавление данных в векторное хранилище
    console.log('Добавление данных в векторное хранилище...');
    await vectorStore.addItems(embeddedEntities);
    console.log('Данные успешно добавлены в векторное хранилище');
    
  } catch (error) {
    console.error('Ошибка при инициализации RAG:', error);
    throw error;
  }
}

/**
 * Находит релевантные чанки для заданного запроса
 * @param query Запрос пользователя
 * @param maxResults Максимальное количество результатов
 * @returns Массив релевантных текстовых чанков
 */
export async function findRelevantChunks(query: string, maxResults: number = 3): Promise<string[]> {
  try {
    // Преобразуем запрос в эмбеддинг
    const queryEmbedding = await createEmbedding(query);
    
    // Ищем ближайшие документы в векторном хранилище
    const results = await vectorStore.search(queryEmbedding, maxResults);
    
    // Извлекаем текст из найденных документов
    return results.map(result => result.text);
  } catch (error) {
    console.error('Ошибка при поиске релевантных чанков:', error);
    return [];
  }
}

/**
 * Создает промпт для модели GPT с контекстом из найденных чанков
 * @param query Запрос пользователя
 * @param contextChunks Массив релевантных чанков
 * @returns Промпт с контекстом
 */
export function createPromptWithContext(query: string, contextChunks: string[]): string {
  if (contextChunks.length === 0) {
    return query;
  }
  
  // Объединяем все найденные чанки в один контекст
  const context = contextChunks.join('\n\n');
  
  // Создаем промпт с инструкциями для модели GPT
  return `Вы - цифровой ассистент Тюменского государственного университета.
  
КОНТЕКСТ:
${context}

ЗАПРОС ПОЛЬЗОВАТЕЛЯ:
${query}

Используйте предоставленный КОНТЕКСТ, чтобы ответить на ЗАПРОС ПОЛЬЗОВАТЕЛЯ. 
Если в контексте недостаточно информации для полного ответа, укажите это.
Отвечайте кратко, дружелюбно и информативно.`;
}

/**
 * Проверяет, нашла ли RAG система релевантную информацию
 * @param chunks Массив найденных чанков
 * @param query Запрос пользователя
 * @returns true, если найдены релевантные чанки
 */
export function hasRelevantInformation(chunks: string[], query: string): boolean {
  if (chunks.length === 0) return false;
  
  // Добавляем синонимы и связанные слова для улучшения поиска
  const synonymMap: Record<string, string[]> = {
    'пода': ['подач', 'подать', 'подавать', 'способ'],
    'документ': ['документы', 'бумаг', 'документаци'],
    'прием': ['принятие', 'подача', 'поступлени'],
    'когда': ['срок', 'дата', 'время', 'период'],
    'нужн': ['необходим', 'требу', 'обязательн'],
    'как': ['каким образом', 'каким способом', 'способ'],
  };
  
  // Разбиваем запрос на слова и фильтруем короткие слова
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  // Расширяем набор ключевых слов синонимами
  let expandedKeywords = [...queryWords];
  
  queryWords.forEach(word => {
    // Проверяем каждое ключевое слово в карте синонимов
    Object.keys(synonymMap).forEach(key => {
      if (word.includes(key) || key.includes(word)) {
        // Добавляем синонимы в расширенный набор ключевых слов
        expandedKeywords = [...expandedKeywords, ...synonymMap[key]];
      }
    });
  });
  
  // Удаляем дубликаты
  expandedKeywords = [...new Set(expandedKeywords)];
  
  if (expandedKeywords.length === 0) return false;
  
  console.log('Расширенные ключевые слова:', expandedKeywords);
  
  // Проверяем наличие ключевых слов в чанках
  const relevantChunks = chunks.filter(chunk => {
    const chunkLower = chunk.toLowerCase();
    // Считаем чанк релевантным, если в нем есть хотя бы 2 ключевых слова
    const matchCount = expandedKeywords.filter(keyword => chunkLower.includes(keyword)).length;
    return matchCount >= 1; // Требуем минимум 1 совпадение
  });
  
  console.log(`Найдено ${relevantChunks.length} релевантных чанков из ${chunks.length}`);
  
  // Если есть хотя бы один релевантный чанк, считаем, что информация найдена
  return relevantChunks.length > 0;
}

// Экспортируем векторное хранилище для доступа из других модулей
export { vectorStore };
