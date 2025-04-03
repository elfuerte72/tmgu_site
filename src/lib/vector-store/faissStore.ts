import { promises as fs } from 'fs';
import path from 'path';

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
 * Интерфейсы для работы с векторным хранилищем
 */
export interface SearchResult {
  id: string;
  text: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface Entity {
  id: string;
  vector: number[];
  metadata?: Record<string, any>;
}

/**
 * Интерфейс для сущности с эмбеддингом
 */
export interface EmbeddedEntity {
  id: string;
  text?: string;
  embedding?: number[];
  vector?: number[];
  metadata?: Record<string, any>;
}

export interface VectorStore {
  addItems(newEntities: EmbeddedEntity[]): Promise<void>;
  search(queryVector: number[], k?: number): Promise<SearchResult[]>;
  clear(): Promise<void>;
  initialize(): Promise<void>;
  save(): Promise<void>;
  load(): Promise<void>;
}

export class FaissVectorStore implements VectorStore {
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
      console.log('=== Инициализация векторного хранилища ===');
      console.log('Путь к хранилищу:', this.storePath);
      console.log('Путь к данным:', this.dataPath);
      
      try {
        // Пытаемся загрузить существующие данные
        await this.load();
        console.log('Данные успешно загружены из:', this.dataPath);
        console.log(`Загружено ${this.entities.length} сущностей`);
      } catch (error) {
        // Если не удалось загрузить, создаем новое хранилище
        console.log('Не удалось загрузить существующие данные:', error instanceof Error ? error.message : 'Неизвестная ошибка');
        console.log('Создаем новое векторное хранилище...');
        this.entities = [];
        
        // Создаем директорию для хранения, если её нет
        console.log('Создание директории хранилища:', this.storePath);
        await fs.mkdir(this.storePath, { recursive: true });
        console.log('Директория хранилища создана или уже существует');
      }
    } catch (error) {
      console.error('Критическая ошибка при инициализации векторного хранилища:', error);
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
  async search(queryEmbedding: number[], k: number = 5): Promise<SearchResult[]> {
    try {
      if (this.entities.length === 0) {
        console.log('Хранилище пусто, нет результатов для поиска');
        return [];
      }

      console.log(`Поиск в хранилище с ${this.entities.length} сущностями`);
      
      // Проверяем структуру первой сущности
      if (this.entities.length > 0) {
        const firstEntity = this.entities[0];
        console.log('Структура первой сущности:', Object.keys(firstEntity));
      }

      // Вычисляем косинусное сходство между запросом и всеми эмбеддингами
      const similarities = this.entities.map(entity => {
        // Проверяем, есть ли свойство embedding или vector
        const vector = entity.embedding || entity.vector;
        if (!vector) {
          console.error('Ошибка: не найден вектор в сущности', entity);
          return { entity, similarity: 0 };
        }
        return {
          entity,
          similarity: cosineSimilarity(queryEmbedding, vector)
        };
      });
      
      // Сортируем по убыванию сходства
      similarities.sort((a, b) => b.similarity - a.similarity);
      
      // Возвращаем топ-k результатов в формате SearchResult
      return similarities.slice(0, k).map(item => ({
        id: item.entity.id,
        text: item.entity.text || '',
        score: item.similarity,
        metadata: item.entity.metadata
      }));
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
      console.log('=== Сохранение данных в хранилище ===');
      console.log('Путь для сохранения:', this.dataPath);
      console.log(`Количество сущностей для сохранения: ${this.entities.length}`);
      
      // Создаем директорию, если она не существует
      await fs.mkdir(this.storePath, { recursive: true });
      console.log('Директория хранилища подготовлена');
      
      // Сохраняем метаданные и тексты
      const data = JSON.stringify(this.entities, null, 2);
      console.log(`Размер данных для сохранения: ${data.length} байт`);
      
      await fs.writeFile(this.dataPath, data);
      console.log('Данные успешно записаны в файл');
      
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
