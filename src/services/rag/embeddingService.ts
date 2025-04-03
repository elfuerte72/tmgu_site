import OpenAI from 'openai';

// Инициализация клиента OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Интерфейс для сущности с эмбеддингом
 */
export interface EmbeddedEntity {
  id: string;
  text: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

/**
 * Создает эмбеддинги для массива текстов
 * @param texts Массив текстов для эмбеддинга
 * @returns Массив эмбеддингов
 */
export async function createEmbeddings(
  texts: string[]
): Promise<number[][]> {
  try {
    if (!texts.length) return [];

    // Используем модель OpenAI для текстовых эмбеддингов
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
      encoding_format: 'float', // Получаем эмбеддинги как массив чисел с плавающей точкой
    });

    // Извлекаем эмбеддинги из ответа
    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Ошибка при создании эмбеддингов:', error);
    throw error;
  }
}

/**
 * Создает эмбеддинг для одного текста
 * @param text Текст для эмбеддинга
 * @returns Эмбеддинг текста
 */
export async function createEmbedding(text: string): Promise<number[]> {
  const embeddings = await createEmbeddings([text]);
  return embeddings[0];
}

/**
 * Создает эмбеддинги для массива чанков с метаданными
 * @param chunks Массив чанков с метаданными
 * @returns Массив EmbeddedEntity с эмбеддингами
 */
export async function createEmbeddingsWithMetadata(
  chunks: { text: string; metadata: Record<string, any> }[]
): Promise<EmbeddedEntity[]> {
  try {
    if (!chunks.length) return [];

    // Извлекаем только текст для создания эмбеддингов
    const texts = chunks.map(chunk => chunk.text);
    
    // Создаем эмбеддинги
    const embeddings = await createEmbeddings(texts);
    
    // Объединяем эмбеддинги с исходными данными и метаданными
    return chunks.map((chunk, index) => ({
      id: `chunk-${index}`,
      text: chunk.text,
      embedding: embeddings[index],
      metadata: chunk.metadata,
    }));
  } catch (error) {
    console.error('Ошибка при создании эмбеддингов с метаданными:', error);
    throw error;
  }
}
