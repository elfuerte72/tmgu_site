import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

/**
 * Интерфейс для хранения извлеченных данных из Excel
 */
export interface ExcelContent {
  sheets: {
    name: string;
    data: string[][];
  }[];
  text: string; // Полный текст для создания эмбеддингов
}

/**
 * Анализирует структуру Excel-файла и выводит информацию о листах и данных
 * @param filePath Путь к файлу Excel
 */
export async function analyzeExcelFile(filePath: string): Promise<void> {
  try {
    // Проверка существования файла
    if (!fs.existsSync(filePath)) {
      throw new Error(`Файл не найден: ${filePath}`);
    }

    // Чтение файла Excel
    const workbook = XLSX.readFile(filePath);
    
    console.log(`\nАнализ файла: ${path.basename(filePath)}`);
    console.log(`Количество листов: ${workbook.SheetNames.length}`);
    console.log(`Имена листов: ${workbook.SheetNames.join(', ')}`);
    
    // Анализ каждого листа
    workbook.SheetNames.forEach(sheetName => {
      console.log(`\n--- Лист: ${sheetName} ---`);
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      
      // Фильтрация пустых строк
      const cleanedData = jsonData.filter(row => row.length > 0 && row.some(cell => cell !== null && cell !== ''));
      
      console.log(`Количество строк: ${cleanedData.length}`);
      
      if (cleanedData.length > 0) {
        console.log(`Заголовки (первая строка): ${JSON.stringify(cleanedData[0])}`);
        
        // Проверка структуры данных
        const firstColumn = cleanedData.map(row => row[0]).filter(cell => cell);
        console.log(`Уникальные значения в первом столбце (возможные темы): ${JSON.stringify([...new Set(firstColumn)])}`);
        
        // Выводим первые 3 строки для примера
        console.log(`Пример данных (первые 3 строки):`);
        for (let i = 0; i < Math.min(3, cleanedData.length); i++) {
          console.log(`  Строка ${i+1}: ${JSON.stringify(cleanedData[i])}`);
        }
      }
    });
    
  } catch (error) {
    console.error('Ошибка при анализе Excel файла:', error);
  }
}

/**
 * Парсит файл Excel и извлекает текстовое содержимое
 * @param filePath Путь к файлу Excel
 * @returns ExcelContent с структурированным содержимым
 */
export async function parseExcelFile(filePath: string): Promise<ExcelContent> {
  try {
    // Проверка существования файла
    if (!fs.existsSync(filePath)) {
      throw new Error(`Файл не найден: ${filePath}`);
    }

    // Чтение файла Excel
    const workbook = XLSX.readFile(filePath);
    const result: ExcelContent = {
      sheets: [],
      text: ''
    };

    // Обработка каждого листа
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      
      // Фильтрация пустых строк и ячеек
      const cleanedData = jsonData
        .filter(row => row.length > 0 && row.some(cell => cell !== null && cell !== ''))
        .map(row => row.map(cell => cell?.toString() || ''));
      
      result.sheets.push({
        name: sheetName,
        data: cleanedData
      });

      // Формирование текста листа с учетом структуры
      let sheetText = `## Лист: ${sheetName}\n\n`;
      
      // Проверка, есть ли заголовки (первая строка)
      if (cleanedData.length > 0) {
        const headers = cleanedData[0];
        
        // Проверяем, является ли первая строка заголовком
        const hasHeaders = headers.some(header => 
          typeof header === 'string' && 
          header.length > 0 &&
          cleanedData.slice(1).some(row => 
            row.some(cell => typeof cell === 'string' && cell.length > 0)
          )
        );
        
        if (hasHeaders) {
          // Добавляем данные с заголовками
          for (let i = 1; i < cleanedData.length; i++) {
            const row = cleanedData[i];
            for (let j = 0; j < Math.min(headers.length, row.length); j++) {
              if (row[j] && headers[j]) {
                sheetText += `${headers[j]}: ${row[j]}\n`;
              }
            }
            sheetText += '\n';
          }
        } else {
          // Добавляем данные без заголовков
          for (const row of cleanedData) {
            sheetText += row.filter(cell => cell).join(' ') + '\n';
          }
        }
      }
      
      result.text += sheetText + '\n\n';
    });

    return result;
  } catch (error) {
    console.error('Ошибка при парсинге Excel файла:', error);
    throw error;
  }
}

/**
 * Извлекает текст из Excel файла и разбивает его на чанки
 * @param filePath Путь к файлу Excel
 * @param chunkSize Размер чанка (в символах)
 * @param chunkOverlap Перекрытие между чанками
 * @returns Массив текстовых чанков
 */
export async function createChunksFromExcel(
  filePath: string, 
  chunkSize: number = 500, 
  chunkOverlap: number = 100
): Promise<string[]> {
  try {
    const content = await parseExcelFile(filePath);
    const text = content.text;
    
    // Простая стратегия разбиения на чанки по размеру с перекрытием
    const chunks: string[] = [];
    let startIndex = 0;
    
    while (startIndex < text.length) {
      // Вычисляем конец текущего чанка
      const endIndex = Math.min(startIndex + chunkSize, text.length);
      
      // Добавляем чанк в массив
      chunks.push(text.slice(startIndex, endIndex));
      
      // Передвигаем стартовый индекс с учетом перекрытия
      startIndex += (chunkSize - chunkOverlap);
      
      // Избегаем бесконечного цикла для коротких текстов
      if (startIndex >= text.length) break;
    }
    
    return chunks.filter(chunk => chunk.trim().length > 0);
  } catch (error) {
    console.error('Ошибка при создании чанков из Excel файла:', error);
    throw error;
  }
}

/**
 * Создает более семантически значимые чанки по темам/разделам
 * @param filePath Путь к файлу Excel
 * @returns Массив чанков, разделенных по логическим блокам
 */
/**
 * Читает текстовый файл и создает чанки для RAG
 * @param filePath Путь к текстовому файлу
 * @returns Массив чанков с метаданными
 */
export async function createChunksFromTextFile(filePath: string): Promise<{text: string, metadata: {source: string, section: string}}[]> {
  try {
    // Проверка существования файла
    if (!fs.existsSync(filePath)) {
      throw new Error(`Файл не найден: ${filePath}`);
    }
    
    // Чтение текстового файла
    const content = await fsPromises.readFile(filePath, 'utf-8');
    
    // Разделяем текст на разделы по пустым строкам
    const sections = content.split(/\n\s*\n/);
    
    // Создаем чанки из разделов
    const chunks = sections.map((section, index) => {
      // Определяем заголовок раздела (первая строка)
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      const text = section.trim();
      
      return {
        text,
        metadata: {
          source: path.basename(filePath),
          section: title || `Раздел ${index + 1}`
        }
      };
    });
    
    return chunks.filter(chunk => chunk.text.length > 0);
  } catch (error) {
    console.error('Ошибка при чтении текстового файла:', error);
    throw error;
  }
}

export async function createTopicBasedChunks(filePath: string): Promise<{text: string, metadata: {source: string, sheet: string}}[]> {
  try {
    const content = await parseExcelFile(filePath);
    const chunks: {text: string, metadata: {source: string, sheet: string}}[] = [];
    
    console.log(`Найдено ${content.sheets.length} листов в Excel-файле`);
    console.log(`Листы: ${content.sheets.map(s => s.name).join(', ')}`);
    
    // Обрабатываем каждый лист как отдельный источник
    for (const sheet of content.sheets) {
      console.log(`Обработка листа: ${sheet.name}`);
      
      // Определяем, есть ли явные заголовки или темы
      const data = sheet.data;
      
      if (data.length === 0) {
        console.log(`Лист ${sheet.name} пуст, пропускаем`);
        continue;
      }
      
      // Добавляем название листа как отдельный чанк для улучшения поиска
      chunks.push({
        text: `# ${sheet.name}\nИнформация о поступлении в ТюмГУ - ${sheet.name}`,
        metadata: {
          source: path.basename(filePath),
          sheet: sheet.name
        }
      });
      
      // Проверка, являются ли первая строка заголовками
      const possibleHeaders = data[0];
      const hasHeaders = possibleHeaders.some(header => 
        typeof header === 'string' && 
        header.length > 0 &&
        data.slice(1).some(row => 
          row.some(cell => typeof cell === 'string' && cell.length > 0)
        )
      );
      
      if (hasHeaders) {
        console.log(`Лист ${sheet.name} имеет заголовки`);
        
        // Группируем данные по разделам, если первый столбец содержит название темы/раздела
        let currentTopic = sheet.name; // Начинаем с названия листа как темы
        let currentChunk = '';
        
        // Добавляем заголовки в текущий чанк
        currentChunk += `Заголовки: ${possibleHeaders.filter(h => h).join(', ')}\n\n`;
        
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          
          // Если первый столбец заполнен, считаем его новой темой или подтемой
          if (row[0] && row[0].trim()) {
            // Если у нас уже есть тема и контент, сохраняем предыдущий чанк
            if (currentChunk.trim()) {
              chunks.push({
                text: `## ${currentTopic}\n${currentChunk}`,
                metadata: {
                  source: path.basename(filePath),
                  sheet: sheet.name
                }
              });
            }
            
            currentTopic = row[0];
            currentChunk = '';
            
            // Добавляем остальные данные из строки
            for (let j = 1; j < Math.min(possibleHeaders.length, row.length); j++) {
              if (row[j] && possibleHeaders[j]) {
                currentChunk += `${possibleHeaders[j]}: ${row[j]}\n`;
              }
            }
          } else {
            // Продолжаем добавлять данные к текущей теме
            for (let j = 0; j < Math.min(possibleHeaders.length, row.length); j++) {
              if (row[j] && possibleHeaders[j]) {
                currentChunk += `${possibleHeaders[j]}: ${row[j]}\n`;
              }
            }
          }
          
          // Добавляем разделитель для лучшей читаемости
          if (currentChunk && !currentChunk.endsWith('\n\n')) {
            currentChunk += '\n';
          }
          
          // Если чанк стал слишком большим, сохраняем его и начинаем новый
          if (currentChunk.length > 1000) {
            chunks.push({
              text: `## ${currentTopic}\n${currentChunk}`,
              metadata: {
                source: path.basename(filePath),
                sheet: sheet.name
              }
            });
            currentChunk = '';
          }
        }
        
        // Добавляем последний чанк
        if (currentChunk.trim()) {
          chunks.push({
            text: `## ${currentTopic}\n${currentChunk}`,
            metadata: {
              source: path.basename(filePath),
              sheet: sheet.name
            }
          });
        }
      } else {
        console.log(`Лист ${sheet.name} не имеет явных заголовков`);
        
        // Разбиваем по абзацам, если нет явной структуры
        let currentChunk = `# ${sheet.name}\n`;
        let lineCount = 0;
        
        for (const row of data) {
          const rowText = row.filter(cell => cell).join(' ');
          if (rowText) {
            currentChunk += rowText + '\n';
            lineCount++;
            
            // Ограничиваем чанк по количеству строк
            if (lineCount >= 10) {
              chunks.push({
                text: currentChunk,
                metadata: {
                  source: path.basename(filePath),
                  sheet: sheet.name
                }
              });
              currentChunk = `# ${sheet.name} (продолжение)\n`;
              lineCount = 0;
            }
          }
        }
        
        // Добавляем последний чанк
        if (currentChunk.length > sheet.name.length + 5) { // Проверяем, что в чанке есть что-то кроме заголовка
          chunks.push({
            text: currentChunk,
            metadata: {
              source: path.basename(filePath),
              sheet: sheet.name
            }
          });
        }
      }
    }
    
    console.log(`Создано ${chunks.length} чанков из Excel файла`);
    return chunks;
  } catch (error) {
    console.error('Ошибка при создании тематических чанков из Excel файла:', error);
    throw error;
  }
}
