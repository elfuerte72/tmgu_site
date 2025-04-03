import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const filePath = '/Users/maximpenkin/Documents/projects/tmgy_site/data/script.xlsx';

// Анализ структуры Excel-файла
async function analyzeExcelFile(filePath) {
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
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
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

// Запуск анализа
analyzeExcelFile(filePath);
