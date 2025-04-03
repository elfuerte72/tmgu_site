import path from 'path';
import { createTopicBasedChunks } from '@/utils/excel/excelParser';
import { createEmbeddingsWithMetadata } from '@/services/rag/embeddingService';
import { FaissVectorStore } from '@/lib/vector-store/faissStore';

// Путь к Excel файлу
const EXCEL_FILE_PATH = path.join(process.cwd(), 'data', 'script.xlsx');

/**
 * Инициализирует RAG систему и заполняет векторное хранилище
 */
async function main() {
  try {
    console.log('Начало инициализации RAG системы...');
    
    // Создаем векторное хранилище
    const vectorStore = new FaissVectorStore();
    await vectorStore.initialize();
    
    // Проверка, есть ли уже данные в хранилище
    console.log('Проверка существующих данных...');
    try {
      // Очищаем хранилище перед заполнением
      console.log('Очистка хранилища...');
      await vectorStore.clear();
    } catch (error) {
      console.log('Хранилище пустое или произошла ошибка при очистке:', error);
    }
    
    // Извлечение данных из Excel
    console.log('Извлечение данных из Excel файла:', EXCEL_FILE_PATH);
    const chunks = await createTopicBasedChunks(EXCEL_FILE_PATH);
    console.log(`Создано ${chunks.length} чанков из Excel файла`);
    
    if (chunks.length === 0) {
      throw new Error('Не найдено данных для обработки в Excel файле');
    }
    
    // Создание эмбеддингов для чанков
    console.log('Создание эмбеддингов для чанков...');
    const embeddedEntities = await createEmbeddingsWithMetadata(chunks);
    console.log(`Создано ${embeddedEntities.length} эмбеддингов`);
    
    // Добавление данных в векторное хранилище
    console.log('Добавление данных в векторное хранилище...');
    await vectorStore.addItems(embeddedEntities);
    console.log('Данные успешно добавлены в векторное хранилище');
    
    console.log('Инициализация RAG системы завершена успешно!');
  } catch (error) {
    console.error('Ошибка при инициализации RAG:', error);
    process.exit(1);
  }
}

// Выполняем функцию
main();
