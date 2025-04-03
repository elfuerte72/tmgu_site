import { analyzeExcelFile } from '../src/utils/excel/excelParser';

const filePath = '/Users/maximpenkin/Documents/projects/tmgy_site/data/script.xlsx';

// Запуск анализа
analyzeExcelFile(filePath)
  .then(() => {
    console.log('Анализ завершен');
  })
  .catch(error => {
    console.error('Ошибка при запуске анализа:', error);
  });
