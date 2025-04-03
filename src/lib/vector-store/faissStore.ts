import { promises as fs } from 'fs';
import path from 'path';
import { EmbeddedEntity } from '@/services/rag/embeddingService';

/**
 * Вычисляет косинусное сходство между двумя векторами
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Класс для управления простым векторным хранилищем
 */
export class FaissVectorStore {
  private entities: EmbeddedEntity[] = [];
  private dimensions: number = 1536; // Размерность для модели text-embedding-3-small
  private storePath: string;
  private dataPath: string;

  /**
   * Создает экземпляр векторного хранилища
   * @param storePath Путь для сохранения данных
   */
  constructor(storePath: string = path.join(process.cwd(), 'data', 'faiss-store')) {
    this.storePath = storePath;
    this.dataPath = path.join(this.storePath, 'entities.json');
  }

  /**
   * Инициализирует векторное хранилище
   */
  async initialize(): Promise<void> {
    try {
      try {
        // Пытаемся загрузить существующие данные
        await this.load();
        console.log('Данные успешно загружены');
      } catch (error) {
        // Если не удалось загрузить, создаем новое хранилище
        console.log('Создаем новое векторное хранилище...');
        this.entities = [];
        
        // Создаем директорию для хранения, если её нет
        await fs.mkdir(this.storePath, { recursive: true });
      }
    } catch (error) {
      console.error('Ошибка при инициализации векторного хранилища:', error);
      throw error;
    }
  }

  /**
   * Добавляет сущности с эмбеддингами в хранилище
   * @param newEntities Новые сущности для добавления
   */
  async addItems(newEntities: EmbeddedEntity[]): Promise<void> {
    try {
      if (newEntities.length === 0) return;

      // Добавляем сущности в наш массив
      this.entities.push(...newEntities);
      
      // Сохраняем обновленные данные
      await this.save();
      console.log(`Добавлено ${newEntities.length} новых элементов в хранилище`);
    } catch (error) {
      console.error('Ошибка при добавлении элементов в хранилище:', error);
      throw error;
    }
  }

  /**
   * Выполняет поиск ближайших соседей для запроса с использованием косинусного сходства
   * @param queryEmbedding Эмбеддинг запроса
   * @param k Количество ближайших соседей для возврата
   * @returns Массив найденных сущностей
   */
  async search(queryEmbedding: number[], k: number = 5): Promise<EmbeddedEntity[]> {
    try {
      if (this.entities.length === 0) {
        console.log('Хранилище пусто, нет результатов для поиска');
        return [];
      }

      // Вычисляем косинусное сходство между запросом и всеми эмбеддингами
      const similarities = this.entities.map(entity => ({
        entity,
        similarity: cosineSimilarity(queryEmbedding, entity.embedding)
      }));
      
      // Сортируем по убыванию сходства
      similarities.sort((a, b) => b.similarity - a.similarity);
      
      // Возвращаем топ-k результатов
      return similarities.slice(0, k).map(item => item.entity);
    } catch (error) {
      console.error('Ошибка при поиске в векторном хранилище:', error);
      throw error;
    }
  }

  /**
   * Сохраняет данные на диск
   */
  async save(): Promise<void> {
    try {
      // Создаем директорию, если она не существует
      await fs.mkdir(this.storePath, { recursive: true });
      
      // Сохраняем метаданные и тексты
      await fs.writeFile(
        this.dataPath,
        JSON.stringify(this.entities, null, 2)
      );
      
      console.log('Данные успешно сохранены');
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
      throw error;
    }
  }

  /**
   * Загружает данные с диска
   */
  async load(): Promise<void> {
    try {
      // Проверяем существование файла данных
      await fs.access(this.dataPath);
      
      // Загружаем данные сущностей
      const data = await fs.readFile(this.dataPath, 'utf-8');
      this.entities = JSON.parse(data);
      
      console.log(`Загружено ${this.entities.length} сущностей в векторное хранилище`);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      throw error;
    }
  }

  /**
   * Очищает данные
   */
  async clear(): Promise<void> {
    try {
      this.entities = [];
      await this.save();
      console.log('Векторное хранилище очищено');
    } catch (error) {
      console.error('Ошибка при очистке хранилища:', error);
      throw error;
    }
  }
}
