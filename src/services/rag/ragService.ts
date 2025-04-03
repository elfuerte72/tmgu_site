import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { createEmbedding, createEmbeddingsWithMetadata } from './embeddingService';
import { FaissVectorStore } from '@/lib/vector-store/faissStore';
import { createTopicBasedChunks, createChunksFromTextFile } from '@/utils/excel/excelParser';

// Путь к файлу данных (будем использовать относительный путь от корня проекта)
const EXCEL_FILE_PATH = path.join(process.cwd(), 'data', 'script.xlsx');
const TEXT_FILE_PATH = path.join(process.cwd(), 'data', 'test-data.txt');

// Создание и конфигурация векторного хранилища
const vectorStore = new FaissVectorStore();

/**
 * Инициализирует RAG систему и заполняет векторное хранилище
 */
export async function initializeRAG(): Promise<void> {
  console.log('Инициализация RAG системы...');
  
  try {
    console.log('=== Начало инициализации RAG ===');
    console.log('INIT_RAG флаг:', process.env.INIT_RAG);
    
    // Проверяем, есть ли уже загруженные данные
    try {
      console.log('Попытка инициализации векторного хранилища...');
      await vectorStore.initialize();
      console.log('Векторное хранилище успешно инициализировано');
    } catch (error) {
      console.error('Ошибка при инициализации векторного хранилища:', error);
    }
    
    // Если стоит флаг принудительной инициализации, очищаем хранилище
    const initRag = process.env.INIT_RAG === 'true';
    console.log('Проверка флага INIT_RAG:', initRag);
    
    if (initRag) {
      console.log('=== Начало полной инициализации RAG ===');
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
    
    // Определяем тип для чанков
    type ChunkType = {text: string, metadata: Record<string, string>};
    let chunks: ChunkType[] = [];
    
    // Загружаем все файлы из папки data
    const dataDir = path.join(process.cwd(), 'data');
    console.log('Сканирование директории:', dataDir);
    const files = await fsPromises.readdir(dataDir);
    console.log('Найдены файлы:', files);
    
    for (const file of files) {
      console.log('Обработка файла:', file);
      if (file === 'faiss-store') continue; // Пропускаем папку с векторным хранилищем
      
      const filePath = path.join(dataDir, file);
      const stats = await fsPromises.stat(filePath);
      
      if (!stats.isFile()) continue;
      
      try {
        if (file.endsWith('.xlsx')) {
          console.log('Обработка Excel файла:', file);
          const excelChunks = await createTopicBasedChunks(filePath);
          chunks.push(...excelChunks);
        } else if (file.endsWith('.txt')) {
          console.log('Обработка текстового файла:', file);
          const textChunks = await createChunksFromTextFile(filePath);
          chunks.push(...textChunks);
        }
      } catch (error) {
        console.error(`Ошибка при обработке файла ${file}:`, error);
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
    // Проверяем, инициализировано ли хранилище
    try {
      await vectorStore.initialize();
    } catch (initError) {
      console.error('Ошибка при инициализации хранилища:', initError);
    }
    
    // Преобразуем запрос в эмбеддинг
    const queryEmbedding = await createEmbedding(query);
    
    // Ищем ближайшие документы в векторном хранилище
    const results = await vectorStore.search(queryEmbedding, maxResults);
    
    console.log(`Найдено ${results.length} результатов по запросу:`, query);
    results.forEach((result, index) => {
      console.log(`Результат ${index + 1}, сходство: ${result.score.toFixed(4)}`);
      console.log(`Фрагмент: ${result.text.substring(0, 100)}...`);
    });
    
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
  const basePrompt = process.env.SYSTEM_PROMPT || '';
  
  return `${basePrompt}

ВАЖНО: В базе знаний найдена следующая информация по вашему запросу. Используйте эти данные для ответа:

${context}

Запрос: ${query}

Инструкции:
1. Ответ должен основываться ТОЛЬКО на предоставленной информации выше
2. Если информации недостаточно - честно скажите об этом
3. Не придумывайте данные, которых нет в контексте
4. Сохраняйте стиль общения как в базовом промпте, но строго опирайтесь на факты из контекста`;
}

/**
 * Проверяет, нашла ли RAG система релевантную информацию
 * @param chunks Массив найденных чанков
 * @param query Запрос пользователя
 * @returns true, если найдены релевантные чанки
 */
export function hasRelevantInformation(chunks: string[], query: string): boolean {
  if (chunks.length === 0) return false;
  
  // Расширенный список синонимов и связанных слов для улучшения поиска
  const synonymMap: Record<string, string[]> = {
    'пода': ['подач', 'подать', 'подавать', 'способ', 'прием', 'принятие'],
    'документ': ['документы', 'бумаг', 'документаци', 'справк', 'заявлени'],
    'прием': ['принятие', 'подача', 'поступлени', 'зачислени'],
    'когда': ['срок', 'дата', 'время', 'период', 'начало', 'конец', 'до'],
    'нужн': ['необходим', 'требу', 'обязательн', 'надо', 'следует'],
    'как': ['каким образом', 'каким способом', 'способ', 'где', 'куда'],
    'гимназ': ['гимназия', 'гимназии', 'гимназист', 'школ'],
    'бакалавр': ['бакалавриат', 'бакалавра', 'первое высшее'],
    'специал': ['специалитет', 'специальность', 'направлени'],
    'магистр': ['магистратура', 'магистерск', 'второе высшее'],
    'вступительн': ['экзамен', 'испытани', 'тест', 'егэ', 'баллы'],
    'очн': ['очная', 'очное', 'очного', 'дневн'],
    'заочн': ['заочная', 'заочное', 'дистанционн', 'удаленн'],
    'форма': ['формат', 'формы', 'форме', 'способ'],
    'обучени': ['учеб', 'образовани', 'учиться', 'подготовк'],
    'стоимост': ['цена', 'оплат', 'платн', 'бюджет'],
    'льгот': ['скидк', 'преимуществ', 'особые права', 'квот'],
    'общежити': ['жиль', 'прожива', 'комнат', 'место'],
    'адрес': ['находит', 'расположен', 'где', 'как добраться'],
    'контакт': ['телефон', 'почта', 'email', 'связаться']
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
    // Снижаем порог до 1 совпадения, чтобы увеличить шансы найти релевантную информацию
    const matchCount = expandedKeywords.filter(keyword => chunkLower.includes(keyword)).length;
    return matchCount >= 1;
  });
  
  console.log(`Найдено ${relevantChunks.length} релевантных чанков из ${chunks.length}`);
  
  // Всегда возвращаем true, если есть хотя бы один релевантный чанк
  return relevantChunks.length > 0;
}

// Экспортируем векторное хранилище для доступа из других модулей
export { vectorStore };
